import { Box } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import HeroBackground from '../../assets/io-gradient-blu.png'
import CustomHeroSection from '../../components/LandingPage/CustomHeroSection';
import { useTranslation } from 'react-i18next';
import CustomLandingSection from '../../components/LandingPage/CustomLandingSection';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';
import { useAuth } from '../../contexts/AuthContext';

const LandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
  if (!loading && isAuthenticated) {
    navigate(ROUTES.TOS);
  }
}, [loading, isAuthenticated]);

  const handleDownloadClick = () => {
    const userAgent = navigator.userAgent || navigator.vendor || '';

    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(navigator as any).msStream;

    if (isAndroid) {
      window.open('https://play.google.com/store/apps/details?id=it.pagopa.io.app', '_blank');
    } else if (isIOS) {
      window.open('https://apps.apple.com/it/app/io/id1501681835', '_blank');
    } else {
      window.open('https://ioapp.it/scarica-io', '_blank');
    }
  };

  return (
    <Box
      sx={{
        overflowX: 'clip',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          margin: '0 auto',
          overflow: 'hidden',
        }}
      >
        <CustomLandingSection />
        
        <Box
          sx={{
            height: "auto",
            flex: 1,
            backgroundColor: "#0B3EE3",
            color: theme.palette.common.white,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <CustomHeroSection
            title={t("landing.withIO")}
            description={t("landing.descriptionWithIO")}
            buttonLabel={t("landing.downloadIO")}
            onButtonClick={handleDownloadClick}
            backgroundImage={HeroBackground}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;
