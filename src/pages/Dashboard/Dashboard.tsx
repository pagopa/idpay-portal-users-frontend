import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useEffect, useState } from 'react';
import { OnboardingWebApi } from '../../api/onboardingWebApiClient';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';
import Overlay from '../../components/Overlay/Overlay';
import { theme } from '@pagopa/mui-italia';
import Barcode from 'react-barcode';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation();
  const [trxCode, setTrxCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const mockResponse =
  {
    amount: '100,00 €',
    expirationDate: '03/10/2025',
    validity: '10 giorni',
    fiscalCode: 'RSSLNZ85T10H501Z'
  };

  const details = [
    { label: 'Importo', value: mockResponse.amount },
    { label: 'Da utilizzare entro il', value: mockResponse.expirationDate },
    { label: 'Durata del buono', value: mockResponse.validity },
    { label: 'Codice Fiscale', value: mockResponse.fiscalCode }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const initiativeId = '68c4449d0d8426093743d00e';
      try {
        const response = await OnboardingWebApi.getBarCode(initiativeId);
        setTrxCode(response.data?.trxCode);
      } catch (error) {
        navigate(ROUTES.ERROR_PAGE, { state: { status: 'UNKNOWN_ERROR' } });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <Overlay />;

  const showBarcode = Boolean(trxCode);

  return (
    <>
      <Box>
        <Typography variant="h4" gutterBottom>
          {t('dashboard.title')}
        </Typography>
        <Typography variant="body1" gutterBottom mt={2}>
          {t('dashboard.description')}
        </Typography>
      </Box>

      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Dettagli del buono sconto
        </Typography>

        <Box
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          gap={3}
          mt={2}
        >
          <Box flex={2}>
            <Card>
              <CardContent>
                <Box mt={2}>
                  {details.map((item, index) => (
                    <Box
                      key={index}
                      display="flex"
                      py={1}
                    >
                      <Typography
                        variant="body2"
                        width={'50%'}
                        pr={2}
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={'bold'}
                        width={'40%'}
                      >
                        {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Box mt={2}>
                  <ButtonNaked
                    color="primary"
                    size="medium"
                    endIcon={<OpenInNewIcon />}
                    sx={{ fontWeight: 'bold' }}
                  >
                    Visualizza i punti vendita abilitati
                  </ButtonNaked>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {showBarcode && (
            <Box flex={1}>
              <Card>
                <CardContent>
                  <Typography variant="overline">
                    {t('dashboard.barcodeSection.barcodeDescription')}
                  </Typography>
                  <Box
                    border={1}
                    borderColor={theme.palette.divider}
                    borderRadius={1}
                    px={1}
                    py={3}
                    mt={2}
                    mb={3}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <Barcode value={trxCode} width={3} />
                  </Box>

                  <Box mb={2} display="flex" justifyContent="center">
                    <Button
                      disabled={true}
                      endIcon={<DownloadIcon />}
                      variant="contained"
                    >
                      {t('dashboard.barcodeSection.downloadBarcode')}
                    </Button>
                  </Box>

                  <Box display="flex" justifyContent="center">
                    <ButtonNaked
                      endIcon={<OpenInNewIcon />}
                      color='primary'
                      size='medium'
                      onClick={() => window.open("https://google.com", "_blank")}
                    >
                      {t('dashboard.barcodeSection.showMerchants')}
                    </ButtonNaked>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;