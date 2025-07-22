import { ArrowBack, Info, Title } from '@mui/icons-material'
import { Box, Card, CardContent, IconButton, Tooltip, Typography } from '@mui/material'
import { theme, ButtonNaked } from '@pagopa/mui-italia'
import { useTranslation } from 'react-i18next'
import TitleCard from '../Titles/TitleCard';

export default function FamilyForm() {
    const { t } = useTranslation();
    return (
        <>
           

            <Box>
                <Card sx={{ borderRadius: "4px" }}>
                    <CardContent>
                        <TitleCard title='verifyRequirements.family.title'/>
                        
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mt: 2,
                            }}
                        >
                            <Box>
                                <Typography sx={{ fontSize: '14px', fontWeight: 400, }}>
                                    {t('verifyRequirements.family.description1')}
                                </Typography>
                                <Typography sx={{ fontSize: '14px', fontWeight: 400 }}>
                                    {t('verifyRequirements.family.description2')}
                                </Typography>
                            </Box>
                            <Tooltip
                                title={
                                    <Typography fontSize={10} color={theme.palette.primary.contrastText}>
                                        {t('verifyRequirements.tooltip')}
                                    </Typography>
                                }
                                placement="bottom"
                                arrow
                            >
                                <IconButton size="small" sx={{ mt: '2px', color: theme.palette.action.active }}>
                                    <Info fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </>
    )
}
