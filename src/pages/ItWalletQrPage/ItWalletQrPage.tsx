import { Box, Card, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import ItWalletQrContent from '../../components/Dashboard/ItWalletQrContent';
import { getItWalletDeepLink } from '../../utils/env';
import { isMobileDevice, openItWalletDeepLink } from '../../utils/itWallet';

const INITIAL_LOADER_DELAY_MS = 250;
const MOBILE_APP_OPEN_LOADER_MS = 6000;

type LoaderProps = {
  isMobile: boolean;
  test?: boolean;
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
};

const MobileFlow = ({ isOpeningApp }: MobileFlowProps) => (
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
    {isOpeningApp && <CircularProgress size={24} />}
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

  useEffect(() => {
    if (isInitialLoading || !isMobile) {
      return;
    }

    setIsOpeningApp(true);

    const loaderTimer = window.setTimeout(() => {
      setIsOpeningApp(false);
    }, MOBILE_APP_OPEN_LOADER_MS);
    const cleanup = deepLink ? openItWalletDeepLink(deepLink) : undefined;

    return () => {
      window.clearTimeout(loaderTimer);
      cleanup?.();
    };
  }, [deepLink, isInitialLoading, isMobile]);

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

      {!isInitialLoading && isMobile && <MobileFlow isOpeningApp={isOpeningApp} />}

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