import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { LanguageOutlined } from '@mui/icons-material';
import { theme } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useAuth } from '../../contexts/AuthContext';

const CustomLandingSection = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { login } = useAuth();

  const handleContinue = () => {
    login();
  };

  return (
    <Box
      sx={{
        flex: 1,
        px: {md: 24, sm: 8, xs: 8},
        py: {md: 16, sm: 8, xs: 8},
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
          <Button
            startIcon={<LanguageOutlined />}
            variant="contained"
            sx={{
              backgroundColor: theme.palette.primary.main,
              textTransform: 'none',
              px: 4,
              py: 1.5,
              borderRadius: 2,
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
