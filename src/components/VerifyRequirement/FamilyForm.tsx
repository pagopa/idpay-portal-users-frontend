import { ArrowBack, Info } from '@mui/icons-material'
import { Box, Card, CardContent, IconButton, Tooltip, Typography } from '@mui/material'
import { theme, ButtonNaked } from '@pagopa/mui-italia'
import { useTranslation } from 'react-i18next'

export default function FamilyForm() {
    const { t } = useTranslation();
    return (
        <>
            <Box>
                <ButtonNaked color="text"
                    onFocusVisible={() => { }}
                    size="medium"
                    startIcon={<ArrowBack sx={{ color: theme.palette.primary.main, }} />}
                    sx={{ color: theme.palette.primary.main, }}
                >
                    {t('verifyRequirements.exit')}
                </ButtonNaked>
                <Typography sx={{ fontWeight: "700", fontSize: "32px", mt: 2 }}>
                    {t('verifyRequirements.title')}
                </Typography>
                <Typography sx={{ fontWeight: "400", fontSize: "16px", mt: 1 }}>
                    {t('verifyRequirements.description')}
                </Typography>
            </Box>

            <Box>
                <Card sx={{ borderRadius: "4px" }}>
                    <CardContent>
                        <Typography
                            sx={{ fontWeight: 700, fontSize: '24px' }}
                            component="h2"
                        >
                            {t('verifyRequirements.family.title')}
                        </Typography>
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
