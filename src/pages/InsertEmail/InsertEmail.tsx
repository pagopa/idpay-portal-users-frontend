import { Box, Button, Typography, Card, CardContent, Container } from '@mui/material';
import EmailInputBox from '../../components/EmailInputBox/EmailInputBox';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { theme } from '@pagopa/mui-italia';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';
import { useEmailStore } from '../../hooks/useEmailStore';
import { validateEmail } from '../../utils/validateEmail';
import { useTOSCheckboxStore } from '../../hooks/useTOSCheckboxStore';
import { ArrowBack } from '@mui/icons-material';
import { useIsMobile } from '../../hooks/useIsMobile';

const InsertEmail = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const { email, confirmEmail, setEmail, setConfirmEmail } = useEmailStore();
  const [emailInput, setEmailInput] = useState(email);
  const [confirmEmailInput, setConfirmEmailInput] = useState(confirmEmail);
  const [showErrors, setShowErrors] = useState(false);
  const { tosAccepted } = useTOSCheckboxStore();

  useEffect(() => {
    if (!tosAccepted) {
      navigate(ROUTES.GATEWAY, { replace: true });
      return;
    }
    setEmailInput(email);
    setConfirmEmailInput(confirmEmail);
  }, [tosAccepted, email, confirmEmail]);

  if (!tosAccepted) {
    return null;
  }

  const isEmailValid = validateEmail(emailInput);
  const emailsMatch =
    emailInput !== '' &&
    confirmEmailInput !== '' &&
    emailInput === confirmEmailInput;
  const isFormValid = isEmailValid && emailsMatch;

  const handleContinue = () => {
    if (!isFormValid) {
      setShowErrors(true);
      return;
    }
    setEmail(emailInput);
    setConfirmEmail(confirmEmailInput);
    navigate(ROUTES.VERIFY_REQUIREMENTS);
  };

  const handleBack = () => {
    setEmail(emailInput);
    setConfirmEmail(confirmEmailInput);
    navigate(ROUTES.TOS);
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, sm: 6 } }}>
      <Box textAlign="center" mb={3}>
        <Typography variant="h3" fontWeight={theme.typography.fontWeightBold} mb={2}>
          {t('insertEmail.title')}
        </Typography>
        <Typography variant="body1">
          {t('insertEmail.description')}
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 3, 
        boxShadow: `0px 6px 30px 5px rgba(0, 43, 85, 0.10),
        0px 16px 24px 2px rgba(0, 43, 85, 0.05),
        0px 8px 10px -5px rgba(0, 43, 85, 0.10)`, 
        mb: 4,
      }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <EmailInputBox
            value={emailInput}
            onChange={(val) => {
              setEmailInput(val);
              setShowErrors(false);
            }}
            placeholderLabel={t('commons.email')}
            showSubmitError={showErrors && !isEmailValid}
            errorMessage={t('commons.invalidEmail')}
          />
          <EmailInputBox
            value={confirmEmailInput}
            onChange={(val) => {
              setConfirmEmailInput(val);
              setShowErrors(false);
            }}
            placeholderLabel={t('commons.confirmEmail')}
            showSubmitError={showErrors && !emailsMatch}
            errorMessage={
              !confirmEmailInput
                ? t('commons.requiredField')
                : !emailsMatch
                  ? t('commons.emailMismatch')
                  : ''
            }
            onPaste={(e) => e.preventDefault()}
          />
        </CardContent>
      </Card>

      <Box
        display="flex"
        flexDirection='row'
        gap={2}
        justifyContent="center"
      >
        <Button
          variant="outlined"
          size="medium"
          fullWidth={isMobile}
          sx={{
            flex: isMobile ? 1 : null,
          }}
          startIcon={<ArrowBack sx={{ color: theme.palette.primary.main }} />}
          onClick={handleBack}
        >
          {t('commons.back')}
        </Button>

        <Button
          variant="contained"
          size="medium"
          fullWidth={isMobile}
          sx={{
            flex: isMobile ? 1 : null,
          }}
          onClick={handleContinue}
        >
          {t('commons.continue')}
        </Button>
      </Box>
    </Container>
  );
};

export default InsertEmail;