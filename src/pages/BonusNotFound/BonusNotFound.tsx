import { Box, Card, CardActions, CardContent, Typography } from '@mui/material';
import { ButtonNaked, theme } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';

const BonusNotFound = () => {
  const { t } = useTranslation();

  return (
    <Box
      minHeight="100%"
      bgcolor={theme.palette.background.default}
      px={3}
      pt={{ xs: 6, md: 10 }}
      pb={{ xs: 8, md: 10 }}
      textAlign="center"
    >
      <Typography component="h1" variant="h3" mb={2}
        sx={{
          maxWidth: { xs: 312, sm: 'none' },
          mx: 'auto',
          [theme.breakpoints.down('sm')]: { fontSize: 38, lineHeight: '58px', letterSpacing: 0 },
        }}>
        {t('common.bonusNotFound.title')}
      </Typography>
      <Typography variant="body1" sx={{ typography: { xs: 'body2', sm: 'body1' } }}>
        {t('common.bonusNotFound.description')}
      </Typography>

      <Card
        component="article"
        aria-labelledby="bonus-decoder-title"
        raised
        sx={{
          maxWidth: { xs: 312, sm: 600 },
          mx: 'auto',
          mt: { xs: 4, sm: 8 },
          borderRadius: 3,
          textAlign: 'left',
        }}
      >
        <CardContent>
          <Typography id="bonus-decoder-title" component="h2" variant="h6" mb={2} fontWeight={theme.typography.fontWeightBold}>
            {t('common.bonusNotFound.bonusDecoder.title')}
          </Typography>
          <Typography variant="body2">
            {t('common.bonusNotFound.bonusDecoder.description')}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <ButtonNaked href="/bonusdecoder/utente" color="primary" size="medium"
            sx={{ fontWeight: theme.typography.fontWeightBold, lineHeight: '21px', letterSpacing: 0.3, minHeight: 0 }}>
            {t('common.bonusNotFound.goToBonus')}
          </ButtonNaked>
        </CardActions>
      </Card>
    </Box>
  );
};

export default BonusNotFound;