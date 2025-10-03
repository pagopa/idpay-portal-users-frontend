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

const InsertEmail = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
        <Typography variant="h3" fontWeight={theme.typography.fontWeightBold} mb={1}>
          {t('insertEmail.title')}
        </Typography>
        <Typography variant="body1">
          {t('insertEmail.description')}
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: 3, mb: 4 }}>
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
          />
        </CardContent>
      </Card>

      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        gap={2}
        justifyContent="center"
      >
        <Button variant="outlined" onClick={handleBack}>
          {t('commons.back')}
        </Button>
        <Button variant="contained" onClick={handleContinue}>
          {t('commons.continue')}
        </Button>
      </Box>
    </Container>
  );
};

export default InsertEmail;