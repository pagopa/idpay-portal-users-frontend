import { Box, Card, CardContent, Container, FormControl, FormControlLabel, Button, IconButton, Radio, RadioGroup, Switch, Tooltip, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { ArrowBack, Info } from '@mui/icons-material'
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { theme } from '@pagopa/mui-italia';


const VerifyRequirements: React.FC = () => {
    const { t } = useTranslation();
    const [iseeValue, setIseeValue] = useState('');
    const [switchValue, setSwitchValue] = useState(false);

    return (
        <Box
            sx={{
                overflowX: 'clip',
                flexDirection: 'column',
                justifyContent: 'center',
                py: 4,
            }}
        >
            <Container sx={{width: "100%", px: "20%"}}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                    }}
                >
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
                        <Card sx={{borderRadius: "4px"}}>
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

                    <Box>
                        <Card sx={{borderRadius: "4px"}}>
                            <CardContent>
                                <Typography
                                    sx={{ fontWeight: 700, fontSize: '24px' }}
                                    component="h2"
                                >
                                    {t('verifyRequirements.selfDeclaration.title')}
                                </Typography>
                                <Typography sx={{ fontSize: '14px', fontWeight: 400, my: 2,}}>
                                    {t('verifyRequirements.selfDeclaration.description')}
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mt: 2,
                                    }}
                                >
                                    <Card sx={{borderColor: theme.palette.divider, borderWidth: "1px", borderStyle: "solid", width: "100%"}}>
                                        <CardContent>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Typography sx={{fontWeight: "600", fontSize: "14px", color: theme.palette.text.secondary}}>
                                                    {t('verifyRequirements.selfDeclaration.switchLabel')}
                                                </Typography>
                                                <Switch onChange={() => setSwitchValue(!switchValue)} sx={{
                                                    ml: 2,
                                                    '& .MuiSwitch-switchBase': {
                                                        color: theme.palette.primary.contrastText,
                                                        '&.Mui-checked': {
                                                            color: theme.palette.primary.contrastText,
                                                            '& + .MuiSwitch-track': {
                                                            backgroundColor: theme.palette.primary.main,
                                                            },
                                                        },
                                                    },
                                                    '& .MuiSwitch-track': {
                                                    backgroundColor: theme.palette.error.dark,
                                                    },
                                                }} />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                                { !switchValue &&
                                    <Typography variant='caption-semibold' sx={{color: theme.palette.error.dark}}>
                                        {t('verifyRequirements.error')}
                                    </Typography>
                                }
                            </CardContent>
                        </Card>
                    </Box>

                    <Box>
                        <Card sx={{borderRadius: "4px"}}>
                            <CardContent>
                                <Typography
                                    sx={{ fontWeight: 700, fontSize: '24px' }}
                                    component="h2"
                                >
                                    {t('verifyRequirements.isee.title')}
                                </Typography>
                                <Typography sx={{ fontSize: '14px', fontWeight: 400, my: 2,}}>
                                    {t('verifyRequirements.isee.description')}
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mt: 2,
                                    }}
                                >
                                    <Card sx={{ borderColor: theme.palette.divider, borderWidth: "1px", borderStyle: "solid", width: "100%" }}>
                                        <CardContent>
                                            <FormControl component="fieldset" fullWidth>
                                                <RadioGroup
                                                    value={iseeValue}
                                                    onChange={(e) => setIseeValue(e.target.value)}
                                                >
                                                    <FormControlLabel
                                                        sx={{pb: 2}}
                                                        value="under25k"
                                                        control={<Radio />}
                                                        label={
                                                            <Box>
                                                                <Typography fontWeight={500}>
                                                                    {t('verifyRequirements.isee.option.<25000')}
                                                                </Typography>
                                                                <Typography fontSize={14} color="text.secondary">
                                                                    {t('verifyRequirements.isee.hint.<25000')}
                                                                </Typography>
                                                            </Box>
                                                        }
                                                    />
                                                    <FormControlLabel
                                                        sx={{pb: 2}}
                                                        value="over25k"
                                                        control={<Radio />}
                                                        label={
                                                            <Box>
                                                                <Typography fontWeight={500}>
                                                                    {t('verifyRequirements.isee.option.>=25000')}
                                                                </Typography>
                                                                <Typography fontSize={14} color="text.secondary">
                                                                    {t('verifyRequirements.isee.hint.>=25000')}
                                                                </Typography>
                                                            </Box>
                                                        }
                                                    />
                                                    <FormControlLabel
                                                        value="no"
                                                        control={<Radio />}
                                                        label={
                                                            <Box>
                                                                <Typography fontWeight={500}>
                                                                    {t('verifyRequirements.isee.option.none')}
                                                                </Typography>
                                                                <Typography fontSize={14} color="text.secondary">
                                                                    {t('verifyRequirements.isee.hint.none')}
                                                                </Typography>
                                                            </Box>
                                                        }
                                                    />
                                                </RadioGroup>
                                            </FormControl>
                                        </CardContent>
                                    </Card>
                                </Box>
                                { iseeValue === "" &&
                                    <Typography variant='caption-semibold' sx={{color: theme.palette.error.dark}}>
                                        {t('verifyRequirements.error')}
                                    </Typography>
                                }
                            </CardContent>
                        </Card>
                    </Box>

                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                        <Button variant="outlined" size='medium' startIcon={<ArrowBack sx={{ color: theme.palette.primary.main, }} />}>{t('verifyRequirements.back')}</Button>
                        <Button variant="contained" size='medium'>{t('verifyRequirements.submit')}</Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default VerifyRequirements;