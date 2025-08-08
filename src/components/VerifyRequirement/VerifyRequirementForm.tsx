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

export default function VerifyRequirementForm() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { email, confirmEmail } = useEmailStore();
    const [iseeValue, setIseeValue] = useState('');
    const [switchValue, setSwitchValue] = useState(false);

    const handleBack = () => {
        navigate(ROUTES.INSERT_EMAIL);
    }

    const handleContinue = async () => {
        const isValid = iseeValue !== '' && switchValue === true;

        if (!isValid) {
            return;
        }

        try {
            const initiativeId = '688ba02b2542210740f7ca48' //TODO retrieve and store initiativeId
            const confirmedTos = true;
            const pdndAccept = true; //TODO

            const selfDeclarationList = [
                {
                    _type: 'boolean',
                    code: '1',
                    accepted: switchValue
                },
               {
                    _type: 'text',
                    code: '2',
                    value: '' //TODO
                }
            ];

            const response = await OnboardingWebApi.save({
                body: {
                    initiativeId,
                    confirmedTos,
                    pdndAccept,
                    selfDeclarationList,
                    userMail: email,
                    userMailConfirmation: confirmEmail
                },
                ...commonHeaders
            });

            if (response.status !== 202) {
                console.error('Errore API:', response);
                //TODO add error redirect
                return;
            }

            navigate(ROUTES.FEEDBACK, { state: { status: 'REQUEST_SUBMITTED' } });
        } catch (error) {
            //TODO add generic error
            console.error('Error: ', error);
        };
    };

    return (
        <Container sx={{ width: "100%", px: {lg: "5%", md: "20%", sm: "10%", xs: "1%"} }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                }}
            >
                <HeaderForm />

                <FamilyForm />
                <SelfDeclaration switchValue={switchValue} setSwitchValue={setSwitchValue}/>
                <IseeForm iseeValue={iseeValue} setIseeValue={setIseeValue} />

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Button variant="outlined" size='medium' startIcon={<ArrowBack sx={{ color: theme.palette.primary.main }} />} onClick={handleBack}>{t('commons.back')}</Button>
                    <Button variant="contained" size='medium' onClick={handleContinue}>{t('verifyRequirements.submit')}</Button>
                </Box>
            </Box>
        </Container>
    )
}
