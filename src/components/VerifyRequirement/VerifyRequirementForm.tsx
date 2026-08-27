import { Box, Container, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material'
import { useTranslation } from 'react-i18next';
import { theme } from '@pagopa/mui-italia';
import { useEffect, useState } from 'react';
import FamilyForm from './FamilyForm';
import IseeForm from './IseeForm';
import SelfDeclaration from './SelfDeclaration';
import HeaderForm from './HeaderForm';
import ROUTES from '../../routes';
import { useNavigate } from 'react-router-dom';
import { useEmailStore } from '../../hooks/useEmailStore';
import { commonHeaders, OnboardingWebApi } from '../../api/onboardingWebApiClient';
import { extractErrorResponse, isSuccessStatus } from '../../utils/api';
import { useVerifyRequirementStore } from '../../hooks/useVerifyRequirementStore';
import { useTOSCheckboxStore } from '../../hooks/useTOSCheckboxStore';
import { getInitiativeId } from '../../utils/env';
import { normalizeEmail } from '../../utils/validateEmail';

export default function VerifyRequirementForm() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { email, confirmEmail } = useEmailStore();
    const { isee, selfDeclaration, setIsee, setSelfDeclaration } = useVerifyRequirementStore();
    const [iseeValue, setIseeValue] = useState(isee);
    const [switchValue, setSwitchValue] = useState(selfDeclaration);
    const [submitted, setSubmitted] = useState(false);
    const { tosAccepted } = useTOSCheckboxStore();
    const hasIseeCopy = i18n.exists('verifyRequirements.isee');
    const hasSwitchLabel = i18n.exists('verifyRequirements.selfDeclaration.switchLabel');

    useEffect(() => {
        if (!tosAccepted) {
            navigate(ROUTES.GATEWAY, { replace: true });
            return;
        }
    }, [tosAccepted]);

    if (!tosAccepted) {
        return null;
    }

    const handleBack = () => {
        if (hasIseeCopy) {
            setIsee(iseeValue);
        }
        if (hasSwitchLabel) {
            setSelfDeclaration(switchValue);
        }
        navigate(ROUTES.INSERT_EMAIL);
    }

    const handleContinue = async () => {
        setSubmitted(true);
        const isValid = (!hasIseeCopy || iseeValue !== '') && (!hasSwitchLabel || switchValue);
        if (!isValid) { return; }

        const selfDeclarationList = [
            ...(hasIseeCopy ? [{
                _type: 'multi_consent' as const,
                code: 'isee',
                value: iseeValue === '3' ? '2' : iseeValue
            }] : []),
            ...(hasSwitchLabel ? [{
                _type: 'boolean' as const,
                code: '1',
                accepted: switchValue
            }] : [])
        ];

        const payload = {
            initiativeId: getInitiativeId(),
            confirmedTos: tosAccepted,
            pdndAccept: true,
            selfDeclarationList,
            userMail: normalizeEmail(email),
            userMailConfirmation: normalizeEmail(confirmEmail),
        };

        try {
            const apiResponse = await OnboardingWebApi.save({
                body: payload,
                ...commonHeaders
            });

            if (isSuccessStatus(apiResponse.status)) {
                navigate(ROUTES.FEEDBACK, { state: { status: 'REQUEST_SUBMITTED' } });
                return;
            }
            navigate(ROUTES.ERROR_PAGE, { state: { status: 'TECHNICAL_ERROR' } });
        } catch (apiError: any) {
            const res = extractErrorResponse(apiError);
            if (isSuccessStatus(res?.status)) {
                navigate(ROUTES.FEEDBACK, { state: { status: 'REQUEST_SUBMITTED' } });
                return;
            }
            if(res?.status === 429){
                navigate(ROUTES.WAITING_PAGE, {state: payload});
                return;
            }
            navigate(ROUTES.ERROR_PAGE, { state: { status: 'TECHNICAL_ERROR' } });
        }
    };

    return (
        <Container sx={{ width: "100%", px: { lg: "5%", md: "20%", sm: "10%", xs: "1%" } }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                }}
            >
                <HeaderForm />

                <FamilyForm />
                <SelfDeclaration switchValue={switchValue} setSwitchValue={setSwitchValue} showError={submitted} />
                {hasIseeCopy && <IseeForm iseeValue={iseeValue} setIseeValue={setIseeValue} showError={submitted} />}

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Button variant="outlined" size='medium' startIcon={<ArrowBack sx={{ color: theme.palette.primary.main }} />} onClick={handleBack}>{t('commons.back')}</Button>
                    <Button variant="contained" size='medium' onClick={handleContinue}>{t('verifyRequirements.submit')}</Button>
                </Box>
            </Box>
        </Container>
    )
}
