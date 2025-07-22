import { ArrowBack } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { ButtonNaked, theme } from '@pagopa/mui-italia'
import TitleCard from '../Titles/TitleCard'
import { useTranslation } from 'react-i18next'

export default function HeaderForm() {
    const { t } = useTranslation();
    return (
        <Box>
            <ButtonNaked color="text"
                onFocusVisible={() => { }}
                size="medium"
                startIcon={<ArrowBack sx={{ color: theme.palette.primary.main, }} />}
                sx={{ color: theme.palette.primary.main, }}
            >
                {t('verifyRequirements.exit')}
            </ButtonNaked>

            <Box mt={1.5} >
                <Typography variant='h4' >
                    {t('verifyRequirements.title')}
                </Typography>
            </Box>
            <Box mt={1}>
                 <Typography variant='body1'>
                    {t('verifyRequirements.description')}
                </Typography>
            </Box>
        </Box>
    )
}
