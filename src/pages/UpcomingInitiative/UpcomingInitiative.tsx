import {Box, Typography} from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import UpcomingHeroSection from "./UpcomingHeroSection.tsx";
import {handleDownloadClick} from "../../utils/functions.ts";
import { useIsMobile } from '../../hooks/useIsMobile.tsx';

const UpcomingInitiative = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile(400);

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
            maxWidth: 'fit-content',
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
            <strong>{t(isMobile ? 'upcomingInitiative.secondBold' : 'upcomingInitiative.secondBoldBreak')}</strong>
            {t(isMobile? 'upcomingInitiative.thirdSubtitle' : 'upcomingInitiative.thirdSubtitleMidBreak')}
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
