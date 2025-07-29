import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '@pagopa/mui-italia';
import { useIsMobile } from '../../hooks/useIsMobile';

export const TOSHeader = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <Box bgcolor={theme.palette.primary.dark} paddingY={"6%"} height={"auto"}
      display={"flex"} justifyContent={"center"} alignItems={"center"}
      flexDirection={"column"} paddingX={{md: "30%", sm: "20%", xs: "10%"}} mb={isMobile ? 0 : 6}
    >
      <Typography textAlign="center" variant="h4" color={theme.palette.primary.contrastText}>
        {t('bonus')}
      </Typography>
      <Typography textAlign="center" variant="body1" color={theme.palette.primary.contrastText} mt={3}>
        {t('tos.description')}
      </Typography>
    </Box>
  );
};
