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
import { isItWalletEnabled } from '../../utils/env';

const CustomLandingSection = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const showItWalletButton = isItWalletEnabled();

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
    px: 2,
    py: 1.5,
    borderRadius: 2,
    whiteSpace: 'nowrap',
    minWidth: isMobile ? 240 : 280,
    boxShadow: theme.shadows[3],
    justifyContent: 'flex-start',
  };

  const buttonIconSx = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    flexShrink: 0,
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isMobile ? 'center' : 'flex-start',
          textAlign: isMobile ? 'center' : 'left',
          maxWidth: '100%',
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          {isMobile ? t('landing.requestBonusMobile') : t('landing.requestBonus')}
        </Typography>
        <Typography variant="body1" mb={3}>
          {t('landing.loginMethods')}
        </Typography>

        <Card raised sx={{ alignSelf: 'center', mt: 3 }}>
          <CardContent>
            <Stack spacing={2}>
              <Button
                size='large'
                startIcon={
                  <Box component="span" sx={buttonIconSx}>
                    <LanguageOutlined sx={{ width: 30, height: 30 }} />
                  </Box>
                }
                variant="contained"
                fullWidth
                sx={buttonSx}
                onClick={() => handleContinue('spid-cie')}
              >
                <Box component="span" fontWeight={500}>
                  {t('landing.continueWithSpidCie')}
                </Box>
              </Button>
              {showItWalletButton && (
                <Button
                  size='large'
                  startIcon={
                    <Box component="span" sx={buttonIconSx}>
                      <Box
                        component="img"
                        src={itWalletIcon}
                        alt=""
                        sx={{ width: 25, height: 25, objectFit: 'contain' }}
                      />
                    </Box>
                  }
                  variant="contained"
                  fullWidth
                  sx={buttonSx}
                  onClick={() => handleContinue('it-wallet')}
                >
                  <Box component="span" fontWeight={500}>
                    {t('landing.continueWithItWallet')}
                  </Box>
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default CustomLandingSection;
