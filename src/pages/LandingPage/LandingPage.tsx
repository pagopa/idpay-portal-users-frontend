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
import {handleDownloadClick} from "../../utils/functions.ts";

const LandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(ROUTES.GATEWAY);
    }
  }, [loading, isAuthenticated]);

  return (
    <Box
      sx={{
        height: '100%',
        overflowX: 'clip',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          flex: 1,
          overflow: 'hidden',
        }}
      >
        <CustomLandingSection />
        
        <Box
          sx={{
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
