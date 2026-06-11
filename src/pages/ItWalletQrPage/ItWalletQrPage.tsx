import { Box, Card, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import ItWalletQrContent from '../../components/Dashboard/ItWalletQrContent';
import { getItWalletDeepLink } from '../../utils/env';
import { getItWalletStoreUrl, navigateToUrl } from '../../utils/itWallet';

const DEVICE_DETECTION_DELAY_MS = 250;
const MOBILE_LOADER_DELAY_MS = 6000;
const LOADER_TOP_POSITION = '25vh';

const ItWalletQrPage = () => {
  const deepLink = getItWalletDeepLink();
  const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent || navigator.vendor || '');
  const [showDeviceLoader, setShowDeviceLoader] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (!isMobile) {
      const desktopLoaderTimer = window.setTimeout(() => {
        setShowDeviceLoader(false);
      }, DEVICE_DETECTION_DELAY_MS);

      return () => {
        window.clearTimeout(desktopLoaderTimer);
      };
    }

    if (deepLink) {
      navigateToUrl(deepLink);
    }

    const storeUrl = getItWalletStoreUrl();
    const deviceTimer = window.setTimeout(() => {
      setShowDeviceLoader(false);
    }, DEVICE_DETECTION_DELAY_MS);

    const loaderTimer = window.setTimeout(() => {
      if (document.visibilityState === 'visible') {
        setShowLoader(false);
        navigateToUrl(storeUrl);
      }
    }, MOBILE_LOADER_DELAY_MS);

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        window.clearTimeout(loaderTimer);
        document.removeEventListener('visibilitychange', onVisibilityChange);
      }
    };

    const onPageHide = () => {
      window.clearTimeout(loaderTimer);
      window.removeEventListener('pagehide', onPageHide);
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', onPageHide);

    return () => {
      window.clearTimeout(deviceTimer);
      window.clearTimeout(loaderTimer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', onPageHide);
    };
  }, [deepLink, isMobile]);

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
      {showDeviceLoader && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            bgcolor: isMobile ? '#ffffff' : '#f2f4f7',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: LOADER_TOP_POSITION,
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <CircularProgress size={24} />
          </Box>
        </Box>
      )}

      {!showDeviceLoader && isMobile && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            bgcolor: '#ffffff',
          }}
        >
          {showLoader && (
            <Box
              sx={{
                position: 'absolute',
                top: LOADER_TOP_POSITION,
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <CircularProgress size={24} />
            </Box>
          )}
        </Box>
      )}

      {!showDeviceLoader && !isMobile && (
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