import { Box, Button, TextField, Typography } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { Fragment, useState } from 'react';
import { useTranslation } from "react-i18next";
import { validateEmail } from "../../utils/validateEmail.ts";
import { ArrowBack } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const AssistanceEmailForm = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [emailInput, setEmailInput] = useState("");
    const [confirmEmailInput, setConfirmEmailInput] = useState("");
    const [showErrors, setShowErrors] = useState(false);
    const [touched, setTouched] = useState({ email: false, confirm: false });

    const isEmailValid = validateEmail(emailInput);
    const isConfirmEmailValid = validateEmail(confirmEmailInput);
    const emailsMatch = emailInput === confirmEmailInput;
    const isFormValid = isEmailValid && isConfirmEmailValid && emailsMatch;

    const showEmailError = (touched.email || showErrors) && !isEmailValid;
    const shouldShowConfirm = touched.confirm || showErrors;
    const showConfirmError = shouldShowConfirm && (!isConfirmEmailValid || !emailsMatch);

    const getConfirmHelperText = () => {
        if (!shouldShowConfirm) return ' ';
        if (!isConfirmEmailValid) return t('commons.invalidEmail');
        if (emailInput && confirmEmailInput && !emailsMatch) return t('commons.emailMismatch');
        return ' ';
    };

    const handleContinue = () => {
        setShowErrors(true);
        if (isFormValid) {
            // TODO integration with Zendesk
        }
    };

    const handleBlur = (field: 'email' | 'confirm') => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    return (
        <Fragment>
            <Box
                display="flex"
                flexDirection="column"
                borderRadius="4px"
                sx={{
                    width: '100%',
                    pt: 4,
                    pb: 2,
                    px: 3,
                    gap: 2,
                    backgroundColor: theme.palette.background.paper
                }}
            >
                <TextField
                    label={t("assistance.emailPlaceholder")}
                    variant="outlined"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onBlur={() => handleBlur('email')}
                    onPaste={(e) => e.preventDefault()}
                    error={showEmailError}
                    helperText={showEmailError ? t('commons.invalidEmail') : ' '}
                    fullWidth
                    size="small"
                />

                <TextField
                    label={t("assistance.confirmEmailPlaceholder")}
                    variant="outlined"
                    value={confirmEmailInput}
                    onChange={(e) => setConfirmEmailInput(e.target.value)}
                    onBlur={() => handleBlur('confirm')}
                    onPaste={(e) => e.preventDefault()}
                    error={showConfirmError}
                    helperText={getConfirmHelperText()}
                    fullWidth
                    size="small"
                />
            </Box>

            <Typography
                variant="body2"
                color={theme.palette.text.secondary}
                gutterBottom
                textAlign="left"
                width="100%"
                my={3}
            >
                {t('assistance.prePolicy')}{' '}
                <Link to="https://www.pagopa.it/it/privacy-policy-assistenza/" target="_blank">
                    Privacy Policy Assistenza
                </Link>
            </Typography>

            <Box
                width="100%"
                display="flex"
                flexDirection="row"
                gap={2}
                justifyContent="space-between"
                mt={2}
            >
                <Button
                    variant="outlined"
                    size="medium"
                    startIcon={<ArrowBack sx={{ color: theme.palette.primary.main }} />}
                    onClick={() => navigate(-1)}
                >
                    {t('commons.back')}
                </Button>

                <Button
                    variant="contained"
                    size="medium"
                    onClick={handleContinue}
                    disabled={!isFormValid}
                >
                    {t('assistance.next')}
                </Button>
            </Box>
        </Fragment>
    );
};

export default AssistanceEmailForm;