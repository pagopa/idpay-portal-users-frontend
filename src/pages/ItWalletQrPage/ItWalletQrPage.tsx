import { Box, Button, Card, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import ItWalletQrContent from '../../components/Dashboard/ItWalletQrContent';
import { getItWalletDeepLink } from '../../utils/env';
import { getItWalletStoreUrl, navigateToUrl } from '../../utils/itWallet';

const INITIAL_LOADER_DELAY_MS = 250;
const MOBILE_FALLBACK_DELAY_MS = 1500;

const isMobileDevice = (): boolean =>
  /android|iphone|ipad|ipod/i.test(navigator.userAgent || navigator.vendor || '');

type LoaderProps = {
  isMobile: boolean;
};

const InitialLoader = ({ isMobile }: LoaderProps) => (
  <Box
    sx={{
      position: 'fixed',
      inset: 0,
      bgcolor: isMobile ? '#ffffff' : '#f2f4f7',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      pt: '10vh',
    }}
  >
    <CircularProgress size={24} />
  </Box>
);

type MobileFlowProps = {
  isOpeningApp: boolean;
  onOpenAppClick: () => void;
};

const MobileFlow = ({ isOpeningApp, onOpenAppClick }: MobileFlowProps) => (
  <Box
    sx={{
      position: 'fixed',
      inset: 0,
      bgcolor: '#ffffff',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      pt: '10vh',
    }}
  >
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <Button variant='contained' onClick={onOpenAppClick} disabled={isOpeningApp}>
        Apri l'app
      </Button>

      {isOpeningApp && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(255,255,255,0.86)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            pointerEvents: 'all',
          }}
        >
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  </Box>
);

const ItWalletQrPage = () => {
  const deepLink = getItWalletDeepLink();
  const isMobile = isMobileDevice();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isOpeningApp, setIsOpeningApp] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsInitialLoading(false);
    }, INITIAL_LOADER_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const handleOpenAppClick = () => {
    setIsOpeningApp(true);

    const storeUrl = getItWalletStoreUrl();

    if (!deepLink) {
      navigateToUrl(storeUrl);
      return;
    }

    const fallbackTimer = window.setTimeout(() => {
      if (document.visibilityState === 'visible') {
        navigateToUrl(storeUrl);
      }
    }, MOBILE_FALLBACK_DELAY_MS);

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        window.clearTimeout(fallbackTimer);
        document.removeEventListener('visibilitychange', onVisibilityChange);
        window.removeEventListener('pagehide', onPageHide);
      }
    };

    const onPageHide = () => {
      window.clearTimeout(fallbackTimer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', onPageHide);
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', onPageHide);

    navigateToUrl(deepLink);
  };

  return (
    <Box
      sx={{
        minHeight: '100%',
        bgcolor: isMobile ? '#ffffff' : '#f2f4f7',
        display: 'flex',
        justifyContent: 'center',
        alignItems: isMobile ? 'center' : 'flex-start',
        px: 2,
        py: { xs: 3, md: 4 },
        boxSizing: 'border-box',
      }}
    >
      {isInitialLoading && <InitialLoader isMobile={isMobile} />}

      {!isInitialLoading && isMobile && (
        <MobileFlow
          isOpeningApp={isOpeningApp}
          onOpenAppClick={handleOpenAppClick}
        />
      )}

      {!isInitialLoading && !isMobile && (
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
            <ItWalletQrContent deepLink={deepLink} />
          </Box>
        </Card>
      )}
    </Box>
  );
};

export default ItWalletQrPage;