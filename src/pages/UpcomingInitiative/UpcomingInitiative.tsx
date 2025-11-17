import {Box, Typography} from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import UpcomingHeroSection from "./UpcomingHeroSection.tsx";
import {handleDownloadClick} from "../../utils/functions.ts";

const UpcomingInitiative = () => {
  const { t } = useTranslation();

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
            width: { xl:'30%', lg:'30%', md: '40%', sm: '60%', xs: '75%' },
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
              mb: 4,
            }}
            gutterBottom
          >
            {t('upcomingInitiative.title')}
          </Typography>
          <Typography variant="body1" mb={3} sx={{whiteSpace: "pre-line"}}>
            {t('upcomingInitiative.preSubtitle')}
            <strong>{t('upcomingInitiative.boldSubtitle')}</strong>
            {t('upcomingInitiative.postSubtitle')}
            <strong>{t('upcomingInitiative.secondBold')}</strong>
            {t('upcomingInitiative.thirdSubtitle')}
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
