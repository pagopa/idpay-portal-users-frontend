import {Box, Typography} from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import UpcomingHeroSection from "./UpcomingHeroSection.tsx";

const UpcomingInitiative = () => {
  const { t } = useTranslation();

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
        backgroundColor: theme.palette.common.white,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          margin: '0 auto',
          minHeight: {md: "80vh"},
          overflow: 'hidden',
          justifyContent: "center",
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            flex: 1,
            width: { md: '25%', sm: '75%', xs: '75%' },
            py: {md: 12, sm: 8, xs: 8},
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              width: '100%',
              textAlign: 'center',
            }}
            gutterBottom
          >
            {t('upcomingInitiative.title')}
          </Typography>
          <Typography variant="body1" mb={3}>
            {t('upcomingInitiative.preSubtitle')}
            <strong>{t('upcomingInitiative.boldSubtitle')}</strong>
            {t('upcomingInitiative.postSubtitle')}
          </Typography>
        </Box>

          <UpcomingHeroSection
            title={t("upcomingInitiative.withIO")}
            subtitle={t("upcomingInitiative.descriptionWithIO")}
            buttonLabel={t("upcomingInitiative.downloadIO")}
            onButtonClick={handleDownloadClick}
          />
      </Box>
    </Box>
  );
};

export default UpcomingInitiative;
