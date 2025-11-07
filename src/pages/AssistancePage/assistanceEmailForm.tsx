import {Box, Button, TextField, Typography} from '@mui/material';
import {theme} from '@pagopa/mui-italia';
import {Fragment, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {isValidEmail} from "../../utils/validateEmail.ts";
import {ArrowBack} from "@mui/icons-material";
import {Link, useNavigate} from "react-router-dom";
import {getInitiativeId} from "../../utils/env.ts";
import {OnboardingWebApi} from "../../api/onboardingWebApiClient.ts";
import {storageTokenOps} from "@pagopa/selfcare-common-frontend/lib/utils/storage";
import {parseJwt} from "../../utils/functions.ts";
import {SupportResponseDTO} from "../../api/generated/onboarding-web/SupportResponseDTO.ts";

const AssistanceEmailForm = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const initiativeId = getInitiativeId();
    const token = storageTokenOps.read();
    const jwtUser = parseJwt(token);

    const [emailInput, setEmailInput] = useState(jwtUser?.email || '');
    const [confirmEmailInput, setConfirmEmailInput] = useState('');
    const [showErrors, setShowErrors] = useState(false);
    const [touched, setTouched] = useState({email: false, confirm: false});

    const isEmailValid = isValidEmail(emailInput);
    const isConfirmEmailValid = isValidEmail(confirmEmailInput);
    const emailsMatch = emailInput === confirmEmailInput;
    const isFormValid = isEmailValid && isConfirmEmailValid && emailsMatch && isValidEmail(emailInput);

    const showEmailError = (touched.email || showErrors) && !isEmailValid;
    const shouldShowConfirm = touched.confirm || showErrors;
    const showConfirmError = shouldShowConfirm && (!isConfirmEmailValid || !emailsMatch);
    const [zendeskAuthData, setZendeskAuthData] = useState<SupportResponseDTO>();

    const getConfirmHelperText = () => {
        if (!shouldShowConfirm) return ' ';
        if (!isConfirmEmailValid) return t('commons.invalidEmail');
        if (emailInput && confirmEmailInput && !emailsMatch) return t('commons.emailMismatch');
        return ' ';
    };

    useEffect(() => {
        if (zendeskAuthData) {
            const form = document.getElementById('jwtForm') as HTMLFormElement;
            if (form) {
                form.submit();
            }
        }
    }, [zendeskAuthData]);

    function buildPayload(token: string | null, jwtUser: any, email: string, productId: string) {
        const payload: any = {
            email,
            productId
        };

        if (token && jwtUser) {
            payload.firstName = jwtUser.given_name;
            payload.lastName = jwtUser.family_name;
            payload.fiscalCode = jwtUser.fiscalNumber;
        }

        return payload;
    }

    const handleContinue = async () => {
        setShowErrors(true);
        if (isFormValid) {
            try {
                const payload = buildPayload(token, jwtUser, emailInput, initiativeId);
                const response = await OnboardingWebApi.support(payload);

                if (response.status === 200 && 'jwt' in response.data && 'returnTo' in response.data) {
                    setZendeskAuthData({ jwt: response.data.jwt, returnTo: response.data.returnTo });
                } else {
                    console.error("Support request error", response.data);
                }
            } catch (error) {
                console.error("Unexpected error", error);
            }
        }
    };

    const handleBlur = (field: 'email' | 'confirm') => {
        setTouched(prev => ({...prev, [field]: true}));
    };

    return (
        <Fragment>
            <Box
                display="flex"
                flexDirection="column"
                borderRadius="4px"
                sx={{
                    width: '100%',
                    pt: 2,
                    pb: 2,
                    px: 3,
                    gap: 2,
                    backgroundColor: theme.palette.background.paper
                }}
            >
                <form id="jwtForm" method="POST" target="_blank" action={'https://pagopa.zendesk.com/access/jwt'}>
                    <input id="jwtString" type="hidden" name="jwt" value={zendeskAuthData?.jwt ?? ''} />
                    <input
                        id="returnTo"
                        type="hidden"
                        name="return_to"
                        value={zendeskAuthData?.returnTo ?? ''}
                    />
                </form>
                <TextField
                    label={t("assistance.emailPlaceholder")}
                    variant="outlined"
                    value={emailInput ?? ''}
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
                    value={confirmEmailInput ?? ''}
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
                    startIcon={<ArrowBack sx={{color: theme.palette.primary.main}}/>}
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