import { Box, Typography, Button, Card, CardContent, Stack } from '@mui/material';
import { LanguageOutlined } from '@mui/icons-material';
import { theme } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';
import type { LoginMethod } from '../../types/auth';
import itWalletIcon from '../../assets/it-wallet-icon.svg';

const CustomLandingSection = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleContinue = (method: LoginMethod) => {
    if (isAuthenticated) {
      navigate(ROUTES.TOS);
      return;
    }

    login(method);
  };

  const buttonSx = {
    backgroundColor: theme.palette.primary.main,
    textTransform: 'none',
    px: 4,
    py: 1.5,
    borderRadius: 2,
    whiteSpace: 'nowrap',
    minWidth: isMobile ? 240 : 280,
    boxShadow: theme.shadows[3],
  };

  return (
    <Box
      sx={{
        flex: 1,
        px: {md: 16, sm: 8, xs: 8},
        py: {md: 16, sm: 8, xs: 8},
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: "center",
        textAlign: 'center',
      }}
    >
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        {isMobile ? t('landing.requestBonusMobile') : t('landing.requestBonus')}
      </Typography>
      <Typography variant="body1" mb={3}>
        {t('landing.loginMethods')}
      </Typography>

      <Card raised>
        <CardContent>
          <Stack spacing={2}>
            <Button
              startIcon={<LanguageOutlined />}
              variant="contained"
              fullWidth
              sx={buttonSx}
              onClick={() => handleContinue('spid-cie')}
            >
              {t('landing.continueWithSpidCie')}
            </Button>
            <Button
              startIcon={<Box component="img" src={itWalletIcon} alt="" sx={{ width: 20, height: 20 }} />}
              variant="contained"
              fullWidth
              sx={buttonSx}
              onClick={() => handleContinue('it-wallet')}
            >
              {t('landing.continueWithItWallet')}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CustomLandingSection;
