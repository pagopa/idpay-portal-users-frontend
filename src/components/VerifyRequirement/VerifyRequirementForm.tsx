import { Box, Container, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material'
import { useTranslation } from 'react-i18next';
import { theme } from '@pagopa/mui-italia';
import { useState } from 'react';
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

export default function VerifyRequirementForm() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { email, confirmEmail } = useEmailStore();
    const { isee, selfDeclaration, setIsee, setSelfDeclaration } = useVerifyRequirementStore();
    const [iseeValue, setIseeValue] = useState(isee);
    const [switchValue, setSwitchValue] = useState(selfDeclaration);
    const [submitted, setSubmitted] = useState(false);
    const { tosAccepted } = useTOSCheckboxStore();

    const handleBack = () => {
        setIsee(iseeValue);
        setSelfDeclaration(switchValue);
        navigate(ROUTES.INSERT_EMAIL);
    }

    const handleContinue = async () => {
        setSubmitted(true);
        const isValid = iseeValue !== '' && switchValue === true;
        if (!isValid) { return; }

        const payload = {
            initiativeId: '68dd003ccce8c534d1da22bc',
            confirmedTos: tosAccepted,
            pdndAccept: true,
            selfDeclarationList: [
                {
                    _type: 'multi_consent',
                    code: 'isee',
                    value: iseeValue
                },
                {
                    _type: 'boolean',
                    'code': '1',
                    'accepted': switchValue
                }
            ],
            userMail: email,
            userMailConfirmation: confirmEmail,
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
                <IseeForm iseeValue={iseeValue} setIseeValue={setIseeValue} showError={submitted} />

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Button variant="outlined" size='medium' startIcon={<ArrowBack sx={{ color: theme.palette.primary.main }} />} onClick={handleBack}>{t('commons.back')}</Button>
                    <Button variant="contained" size='medium' onClick={handleContinue}>{t('verifyRequirements.submit')}</Button>
                </Box>
            </Box>
        </Container>
    )
}
