import { Box, Card, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import ItWalletQrContent from '../../components/Dashboard/ItWalletQrContent';
import { getItWalletDeepLink } from '../../utils/env';
import { navigateToUrl } from '../../utils/itWallet';

const ItWalletQrPage = () => {
  const deepLink = getItWalletDeepLink();
  const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent || navigator.vendor || '');
  const [showLoader, setShowLoader] = useState(true);
  const loaderDurationMs = 5000;

  useEffect(() => {
    if (!isMobile) {
      return;
    }

    if (deepLink) {
      navigateToUrl(deepLink);
    }

    const loaderTimer = window.setTimeout(() => {
      setShowLoader(false);
    }, loaderDurationMs);

    return () => {
      window.clearTimeout(loaderTimer);
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
      {isMobile && (
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
                top: '25vh',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <CircularProgress size={24} />
            </Box>
          )}
        </Box>
      )}

      {!isMobile && (
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