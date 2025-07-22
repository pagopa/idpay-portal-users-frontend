import { Box, Card, CardContent, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material'
import { theme } from '@pagopa/mui-italia'
import type { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

interface IseeFormProps {
  iseeValue: string;
  setIseeValue: Dispatch<SetStateAction<string>>;
}

export default function IseeForm(props: IseeFormProps) {
    const {iseeValue, setIseeValue} = props;
    const { t } = useTranslation();
    return (
        <Box>
            <Card sx={{ borderRadius: "4px" }}>
                <CardContent>
                    <Typography
                        sx={{ fontWeight: 700, fontSize: '24px' }}
                        component="h2"
                    >
                        {t('verifyRequirements.isee.title')}
                    </Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: 400, my: 2, }}>
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
                                            sx={{ pb: 2 }}
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
                                            sx={{ pb: 2 }}
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
                    {iseeValue === "" &&
                        <Typography variant='caption-semibold' sx={{ color: theme.palette.error.dark }}>
                            {t('verifyRequirements.error')}
                        </Typography>
                    }
                </CardContent>
            </Card>
        </Box>
    )
}
