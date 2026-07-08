import { Box, Card, CardContent, Switch, Typography } from '@mui/material'
import { theme } from '@pagopa/mui-italia'
import type { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import TitleCard from '../Titles/TitleCard';

interface SelfDeclarationProps {
    switchValue: boolean;
    setSwitchValue: Dispatch<SetStateAction<boolean>>;
    showError?: boolean;
}

export default function SelfDeclaration(props: SelfDeclarationProps) {
    const { t } = useTranslation();
    const { switchValue, setSwitchValue } = props;
    return (
        <Box>
            <Card sx={{ borderRadius: "4px" }}>
                <CardContent>
                    <TitleCard title='verifyRequirements.selfDeclaration.title' />
                    <Box my={2}>
                        <Typography variant='body2'>
                            {t('verifyRequirements.selfDeclaration.description')}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mt: 2,
                        }}
                    >
                        <Card sx={{ borderColor: theme.palette.divider, width: "100%" }}>
                            <CardContent>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Switch
                                        id="self-declaration-switch"
                                        checked={switchValue}
                                        onChange={(_, checked) => setSwitchValue(checked)}
                                        slotProps={{
                                            input: {
                                                'aria-label': t('verifyRequirements.selfDeclaration.switchLabel')
                                            }
                                        }}
                                        sx={{
                                            mr: 2,
                                            '& .MuiSwitch-switchBase': {
                                                color: theme.palette.primary.contrastText,
                                                '&.Mui-checked': {
                                                    color: theme.palette.primary.contrastText,
                                                    '& .MuiSwitch-track': {
                                                        backgroundColor: theme.palette.primary.main,
                                                    },
                                                },
                                            },
                                            '& .MuiSwitch-track': {
                                                backgroundColor: props.showError ? theme.palette.error.dark : null,
                                            },
                                        }} />
                                    <Typography variant='body2'>
                                        {t('verifyRequirements.selfDeclaration.switchLabel')}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                    {props.showError && !switchValue &&
                        <Typography variant='caption-semibold' sx={{ color: theme.palette.error.dark }}>
                            {t('verifyRequirements.selfDeclarationError')}
                        </Typography>
                    }
                </CardContent>
            </Card>
        </Box>
    )
}
