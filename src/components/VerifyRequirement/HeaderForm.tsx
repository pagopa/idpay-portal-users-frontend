import { ArrowBack } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { ButtonNaked, theme } from '@pagopa/mui-italia'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../contexts/AuthContext';

export default function HeaderForm() {
    const { t } = useTranslation();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <Box>
            <ButtonNaked color="text"
                onFocusVisible={() => { }}
                size="medium"
                startIcon={<ArrowBack sx={{ color: theme.palette.primary.main, }} />}
                sx={{ color: theme.palette.primary.main, }}
                onClick= {handleLogout}
            >
                {t('verifyRequirements.exit')}
            </ButtonNaked>

            <Box mt={2} >
                <Typography variant='h4' >
                    {t('verifyRequirements.title')}
                </Typography>
            </Box>
            <Box mt={3}>
                 <Typography variant='body1'>
                    {t('verifyRequirements.description')}
                </Typography>
            </Box>
        </Box>
    )
}
