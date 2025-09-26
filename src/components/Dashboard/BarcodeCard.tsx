import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ButtonNaked, theme } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import Barcode from 'react-barcode';

interface BarcodeCardProps {
  trxCode: string;
}

const BarcodeCard: React.FC<BarcodeCardProps> = ({ trxCode }) => {
  const { t } = useTranslation();

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
            <Button disabled endIcon={<DownloadIcon />} variant='contained'>
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