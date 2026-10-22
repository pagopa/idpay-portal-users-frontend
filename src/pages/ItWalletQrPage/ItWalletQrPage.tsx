import { Box, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import ItWalletQrContent from '../../components/Dashboard/ItWalletQrContent';
import ItWalletSubheader from '../../components/Header/ItWalletSubheader';
import { getItWalletDeepLink } from '../../utils/env';
import { isMobileDevice, openItWalletDeepLink } from '../../utils/itWallet';

const INITIAL_LOADER_DELAY_MS = 250;
const MOBILE_APP_OPEN_LOADER_MS = 6000;

const InitialLoader = () => (
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
        bgcolor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      {isInitialLoading && <InitialLoader />}

      {!isInitialLoading && isMobile && <MobileFlow isOpeningApp={isOpeningApp} />}

      {!isMobile && <ItWalletSubheader />}

      {!isInitialLoading && !isMobile && (
        <Box
          sx={{
            width: '100%',
            maxWidth: 640,
            mx: 'auto',
            px: 2,
            pt: '38px',
            pb: '40px',
            textAlign: 'center',
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}
        >
          <ItWalletQrContent deepLink={deepLink} variant='page' />
        </Box>
      )}
    </Box>
  );
};

export default ItWalletQrPage;