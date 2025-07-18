import { Box, Card, CardContent, Container, FormControl, FormControlLabel, Button, IconButton, Radio, RadioGroup, Switch, Tooltip, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { ArrowBack, Info } from '@mui/icons-material'
import { useState } from 'react';

const VerifyRequirements: React.FC = () => {
    const [iseeValue, setIseeValue] = useState('');

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
                            startIcon={<ArrowBack sx={{ color: "#0073E6", }} />}
                            sx={{ color: "#0073E6", }}
                        >
                            Esci
                        </ButtonNaked>
                        <Typography sx={{ fontWeight: "700", fontSize: "32px", mt: 2 }}>
                            Verifica dei requisiti
                        </Typography>
                        <Typography sx={{ fontWeight: "400", fontSize: "16px", mt: 1 }}>
                            Compila i campi e invia la tua richiesta. Se rispetta i requisiti, riceverai il buono sconto da scaricare e mostrare nei punti vendita abilitati.
                        </Typography>
                    </Box>

                    <Box>
                        <Card sx={{borderRadius: "4px"}}>
                            <CardContent>
                                <Typography
                                    sx={{ fontWeight: 700, fontSize: '24px' }}
                                    component="h2"
                                >
                                    Nucleo familiare
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
                                            Per accedere all’iniziativa {`{{Bonus Elettrodomestici}}`},
                                            verificheremo con alcuni enti se hai il requisito relativo al tuo
                                            nucleo familiare.
                                        </Typography>
                                        <Typography sx={{ fontSize: '14px', fontWeight: 400 }}>
                                            Questo passaggio è richiesto dal Ministero dell’Interno.
                                        </Typography>
                                    </Box>
                                    <Tooltip
                                        title={
                                            <Typography fontSize={10} color={"#FFFFFF"}>
                                                Comunichiamo direttamente con l’ente che detiene
                                                l’informazione necessaria a effettuare il controllo, in
                                                questo caso {`{{provider}}`}. In questo modo non devi
                                                produrre alcuna autocertificazione.
                                            </Typography>
                                        }
                                        placement="bottom"
                                        arrow
                                    >
                                        <IconButton size="small" sx={{ mt: '2px', color: "#455B71" }}>
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
                                    Autodichiarazione
                                </Typography>
                                <Typography sx={{ fontSize: '14px', fontWeight: 400, my: 2,}}>
                                    L’autodichiarazione è resa ai sensi del D.P.R. 28 dicembre 2000, n. 445.
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mt: 2,
                                    }}
                                >
                                    <Card sx={{borderColor: "#E3E7EB", borderWidth: "1px", borderStyle: "solid", width: "100%"}}>
                                        <CardContent>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Typography sx={{fontWeight: "600", fontSize: "14px", color: "#5C6F82"}}>
                                                    Dichiaro che userò il bonus per l'acquisto di un elettrodomestico di classe energetica superiore destinato a sostituire un altro della stessa tipologia
                                                </Typography>
                                                <Switch sx={{color: "#0073E6", ml: 2}} />
                                            </Box>
                                        </CardContent>
                                    </Card>
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
                                    Dichiarazione ISEE 2025
                                </Typography>
                                <Typography sx={{ fontSize: '14px', fontWeight: 400, my: 2,}}>
                                    Se sei in possesso di un ISEE 2025 inferiore a 25.000€, verrà effettuata una verifica con INPS
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mt: 2,
                                    }}
                                >
                                    <Card sx={{ borderColor: "#E3E7EB", borderWidth: "1px", borderStyle: "solid", width: "100%" }}>
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
                                                                    Ho un ISEE inferiore a 25.000€
                                                                </Typography>
                                                                <Typography fontSize={14} color="text.secondary">
                                                                    Hai diritto fino a €200
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
                                                                    Ho un ISEE uguale o superiore a 25.000€
                                                                </Typography>
                                                                <Typography fontSize={14} color="text.secondary">
                                                                    Hai diritto fino a €100
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
                                                                    Non ho un ISEE
                                                                </Typography>
                                                                <Typography fontSize={14} color="text.secondary">
                                                                    Hai diritto fino a €100
                                                                </Typography>
                                                            </Box>
                                                        }
                                                    />
                                                </RadioGroup>
                                            </FormControl>
                                        </CardContent>
                                    </Card>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>

                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                        <Button variant="outlined" size='medium' startIcon={<ArrowBack sx={{ color: "#0073E6", }} />}>Indietro</Button>
                        <Button variant="contained" size='medium'>Invia Richiesta</Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default VerifyRequirements;