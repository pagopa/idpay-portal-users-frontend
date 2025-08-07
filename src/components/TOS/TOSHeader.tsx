import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '@pagopa/mui-italia';
import { useIsMobile } from '../../hooks/useIsMobile';

export const TOSHeader = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <Box bgcolor={theme.palette.primary.dark} py={7} height={"auto"}
      display={"flex"} justifyContent={"center"} alignItems={"center"}
      flexDirection={"column"} px={{md: "30%", sm: "20%", xs: "10%"}} mb={isMobile ? 4 : 6}
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
