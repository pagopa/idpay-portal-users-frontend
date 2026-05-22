import { Box, Typography, Card, CardContent, Button, useMediaQuery } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ButtonNaked, theme } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import Barcode from 'react-barcode';
import { OnboardingWebApi } from '../../api/onboardingWebApiClient';
import { useState } from 'react';
import { downloadFileFromBase64 } from '../../commons/decode';
import { BARCODE_BREAKPOINTS, getBarcodeWidth } from '../../utils/barcodeResponsiveUtils';
import { getBaseUrl, getInitiativeId, getItWalletDeepLink, isItWalletEnabled } from '../../utils/env';
import walletIcon from '../../assets/wallet-icon.svg';
import ItWalletQrModal from './ItWalletQrModal';

interface BarcodeCardProps {
  trxCode: string;
}

const BarcodeCard: React.FC<BarcodeCardProps> = ({ trxCode }) => {
  const { t } = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isWalletQrModalOpen, setIsWalletQrModalOpen] = useState(false);

  const isLargeScreen = useMediaQuery(BARCODE_BREAKPOINTS.large);
  const isMediumScreen = useMediaQuery(BARCODE_BREAKPOINTS.medium);
  const isSmallScreen = useMediaQuery(BARCODE_BREAKPOINTS.small);
  const showItWalletButton = isItWalletEnabled();
  const walletDeepLink = getItWalletDeepLink();
  const isMobileDevice = /android|iphone|ipad|ipod/i.test(navigator.userAgent || navigator.vendor || '');

  const handleAddToWallet = () => {
    if (isMobileDevice) {
      window.location.href = walletDeepLink;
      return;
    }

    setIsWalletQrModalOpen(true);
  };

  const downloadPDF = async () => {
    const initiativeId = getInitiativeId();
    setIsDownloading(true)
    try {
      const pdfResponse = await OnboardingWebApi.downloadPDF(initiativeId, trxCode);
      if (pdfResponse.status === 200 && pdfResponse.data) {
        const { data } = pdfResponse.data;
        if (data) downloadFileFromBase64(data, `barcode_${trxCode}.pdf`)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardContent>
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
          {trxCode ? <Barcode
            value={trxCode}
            fontSize={18}
            textMargin={20}
            fontOptions="bold"
            width={getBarcodeWidth(isLargeScreen, isMediumScreen, isSmallScreen)}
          /> : (
            <>
              <Typography mt={2} textAlign={"center"}>Stiamo preparando il tuo barcode.</Typography>
              <Typography mt={4} mb={2} textAlign={"center"}>Puoi provare ad aggiornarne lo stato tra qualche istante.</Typography>
            </>
          )
          }
        </Box>
        <Box mt='auto'>
          {trxCode && <Box py={1} display='flex' flexDirection='column' alignItems='center'>
            {showItWalletButton && (
              <Button
                variant='contained'
                sx={{ width: 220 }}
                startIcon={<Box component='img' src={walletIcon} alt='' sx={{ width: 20, height: 20 }} />}
                onClick={handleAddToWallet}
              >
                {t('dashboard.barcodeSection.addToWallet')}
              </Button>
            )}
            <Button
              sx={{ mt: showItWalletButton ? 2 : 0, width: 220 }}
              disabled={isDownloading}
              endIcon={<DownloadIcon />}
              variant={showItWalletButton ? 'outlined' : 'contained'}
              onClick={() => downloadPDF()}
            >
              {t('dashboard.barcodeSection.downloadBarcode')}
            </Button>
          </Box>
          }
          <Box py={1} display='flex' justifyContent='center'>
            <ButtonNaked
              weight='default'
              endIcon={<OpenInNewIcon />}
              color='primary'
              size='medium'
              onClick={() => window.open(`${getBaseUrl()}/lista-punti-vendita`, '_blank')}
            >
              {t('dashboard.barcodeSection.showMerchants')}
            </ButtonNaked>
          </Box>
        </Box>
      </CardContent>
      <ItWalletQrModal
        open={isWalletQrModalOpen}
        onClose={() => setIsWalletQrModalOpen(false)}
        deepLink={walletDeepLink}
      />
    </Card>
  );
};

export default BarcodeCard;