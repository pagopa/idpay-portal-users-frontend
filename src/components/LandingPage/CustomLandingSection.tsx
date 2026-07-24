import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { LanguageOutlined } from '@mui/icons-material';
import { theme } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';
import { getInitiative } from '../../utils/env';

const CustomLandingSection = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isBonusTest = getInitiative() === 'bonustest'; //TEST

  const handleContinue = () => {
  if (isAuthenticated) {
    navigate(ROUTES.TOS);
    return;
  }
  login();
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
        {isBonusTest
          ? t('landing.requestBonusTest')
          : isMobile
            ? t('landing.requestBonusMobile')
            : t('landing.requestBonus')}
      </Typography>
      <Typography variant="body1" mb={3}>
        {t('landing.loginMethods')}
      </Typography>

      <Card raised>
        <CardContent>
          <Button
            startIcon={<LanguageOutlined />}
            variant="contained"
            sx={{
              backgroundColor: theme.palette.primary.main,
              textTransform: 'none',
              px: 4,
              py: 1.5,
              borderRadius: 2,
              whiteSpace: 'nowrap',
              minWidth: isMobile ? 220 : 180,
              boxShadow: theme.shadows[3],
            }}
            onClick={handleContinue}
          >
            {t('landing.continueOnWeb')}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CustomLandingSection;
