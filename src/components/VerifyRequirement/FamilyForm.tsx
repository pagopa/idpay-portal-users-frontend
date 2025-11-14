import { Box, Card, CardContent, Typography } from '@mui/material'
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
                                <Typography variant='body2' >
                                    {t('verifyRequirements.family.description1')}
                                </Typography>
                                <Typography variant='body2'>
                                    {t('verifyRequirements.family.description2')}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </>
    )
}
