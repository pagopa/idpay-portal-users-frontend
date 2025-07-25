import { Box, Button, Typography, Card, CardContent } from '@mui/material';
import EmailInputBox from '../../components/EmailInputBox/EmailInputBox';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { theme } from '@pagopa/mui-italia';

const InsertEmail = () => {
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const emailsMatch = email && confirmEmail && email === confirmEmail;
  const isFormValid = isEmailValid && emailsMatch;

  const handleContinue = () => {
    if (!isFormValid) {
      setShowErrors(true);
      return;
    }

    console.log('valid email:', email);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      px={2}
      py={{ xs: 4, sm: 6 }}
    >
      <Box textAlign="center" mb={3} width="100%" maxWidth={480}>
        <Typography variant="h3" fontWeight={theme.typography.fontWeightBold} mb={1}>
          {t('insertEmail.title')}
        </Typography>
        <Typography variant="body1">
          {t('insertEmail.description')}
        </Typography>
      </Box>

      <Card
        sx={{
          width: '100%',
          maxWidth: 480,
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <EmailInputBox
            onChange={(value, valid) => {
              setEmail(value);
              setIsEmailValid(valid);
              setShowErrors(false);
            }}
            placeholderLabel={t('commons.email')}
            showSubmitError={showErrors && !isEmailValid}
            errorMessage={t('commons.invalidEmail')}
          />
          <EmailInputBox
            onChange={(value) => {
              setConfirmEmail(value);
              setShowErrors(false);
            }}
            placeholderLabel={t('commons.confirmEmail')}
            showSubmitError={showErrors && !emailsMatch}
            errorMessage={
              !confirmEmail
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
        mt={4}
        width="100%"
        maxWidth={480}
        justifyContent="center"
      >
        <Button variant="outlined">{t('commons.back')}</Button>
        <Button variant="contained" onClick={handleContinue}>
          {t('commons.continue')}
        </Button>
      </Box>
    </Box>
  );
};

export default InsertEmail;