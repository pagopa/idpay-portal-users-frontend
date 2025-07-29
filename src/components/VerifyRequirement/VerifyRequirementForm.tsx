
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

export default function VerifyRequirementForm() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [iseeValue, setIseeValue] = useState('');
    const [switchValue, setSwitchValue] = useState(false);

    const handleBack = () => {
        navigate(ROUTES.INSERT_EMAIL);
    }

    const handleContinue = () => {
        //TODO add API call
        const feedbackStatus = 'REQUEST_SUBMITTED'
        navigate(ROUTES.FEEDBACK, {state: {status: feedbackStatus}})
    }
    
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
