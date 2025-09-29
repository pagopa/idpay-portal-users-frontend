import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ButtonNaked, theme } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import Barcode from 'react-barcode';
import { OnboardingWebApi } from '../../api/onboardingWebApiClient';
import { useState } from 'react';
import { downloadFileFromBase64 } from '../../commons/decode';

interface BarcodeCardProps {
  trxCode: string;
}

const BarcodeCard: React.FC<BarcodeCardProps> = ({ trxCode }) => {
  const { t } = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPDF = async () => {
    const initiativeId = '68c4449d0d8426093743d00e';
    setIsDownloading(true)
    try{
      const pdfResponse = await OnboardingWebApi.downloadPDF(initiativeId, trxCode);
      if (pdfResponse.status === 200 && pdfResponse.data) {
        const { data } = pdfResponse.data;
        if(data) downloadFileFromBase64(data, `barcode_${trxCode}.pdf`)
      }
    }catch(error){
      console.error(error)
    }finally{
      setIsDownloading(false);
    }
  }

  if (!trxCode) return null;

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Typography variant='overline'>
          {t('dashboard.barcodeSection.barcodeDescription')}
        </Typography>
        <Box
          border={1}
          borderColor={theme.palette.divider}
          borderRadius={1}
          px={1}
          py={3}
          mt={3}
          mb={3}
          display='flex'
          flexDirection='column'
          alignItems='center'
        >
          <Barcode value={trxCode} width={3} />
        </Box>
        <Box mt='auto'>
          <Box py={1} display='flex' justifyContent='center'>
            <Button disabled={isDownloading} endIcon={<DownloadIcon />} variant='contained' onClick={() => downloadPDF()}>
              {t('dashboard.barcodeSection.downloadBarcode')}
            </Button>
          </Box>
          <Box py={1} display='flex' justifyContent='center'>
            <ButtonNaked
              weight='default'
              endIcon={<OpenInNewIcon />}
              color='primary'
              size='medium'
              onClick={() => window.open('https://google.com', '_blank')}
            >
              {t('dashboard.barcodeSection.showMerchants')}
            </ButtonNaked>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BarcodeCard;