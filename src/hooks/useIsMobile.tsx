import { useMediaQuery, useTheme } from '@mui/material';
import type { Theme } from '@mui/material/styles';

export const useIsMobile = (): boolean => {
  const theme = useTheme<Theme>();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return isMobile;
};