import { Box, Button, Card, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ItWalletQrContent from '../../components/Dashboard/ItWalletQrContent';
import { getItWalletDeepLink } from '../../utils/env';
import { getItWalletStoreUrl, navigateToUrl } from '../../utils/itWallet';

const ItWalletQrPage = () => {
  const { t } = useTranslation();
  const deepLink = getItWalletDeepLink();
  const [isMobile, setIsMobile] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const openAppOrStore = (): (() => void) | void => {
    if (!deepLink) {
      navigateToUrl(getItWalletStoreUrl());
      return;
    }

    let fallbackTimer = 0;

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        window.clearTimeout(fallbackTimer);
        document.removeEventListener('visibilitychange', onVisibilityChange);
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    fallbackTimer = window.setTimeout(() => {
      if (document.visibilityState === 'visible') {
        navigateToUrl(getItWalletStoreUrl());
      }
      document.removeEventListener('visibilitychange', onVisibilityChange);
    }, 1800);

    navigateToUrl(deepLink);

    return () => {
      window.clearTimeout(fallbackTimer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  };

  useEffect(() => {
    const isMobileDevice = /android|iphone|ipad|ipod/i.test(navigator.userAgent || navigator.vendor || '');
    setIsMobile(isMobileDevice);

    if (isMobileDevice && deepLink) {
      navigateToUrl(deepLink);
    }

    const loadingTimer = window.setTimeout(() => {
      setIsInitialLoading(false);
    }, 300);

    return () => {
      window.clearTimeout(loadingTimer);
    };
  }, [deepLink]);

  const handleOpenAppClick = () => {
    openAppOrStore();
  };

  return (
    <Box
      sx={{
        minHeight: '100%',
        bgcolor: '#f2f4f7',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        px: 2,
        py: { xs: 3, md: 4 },
        boxSizing: 'border-box',
      }}
      >
      {isInitialLoading && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(242, 244, 247, 0.72)',
            backdropFilter: 'blur(2px)',
          }}
        >
          <CircularProgress />
        </Box>
      )}

      <Card
        sx={{
          width: '100%',
          maxWidth: 640,
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
          p: { xs: 3, md: 5 },
          textAlign: 'center',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        <Box width='100%'>
          {isMobile && (
            <Box
              sx={{
                mb: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Button
                variant='contained'
                onClick={handleOpenAppClick}
              >
                {t('dashboard.barcodeSection.walletAccessOpenApp')}
              </Button>
              <Typography mt={0.75} variant='body2' color='text.secondary'>
                {t('dashboard.barcodeSection.walletAccessOr')}
              </Typography>
            </Box>
          )}
          <ItWalletQrContent deepLink={deepLink} />
        </Box>
      </Card>
    </Box>
  );
};

export default ItWalletQrPage;
