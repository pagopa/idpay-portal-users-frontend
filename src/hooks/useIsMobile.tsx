import { useMediaQuery, useTheme } from '@mui/material';
import type { Breakpoint, Theme } from '@mui/material/styles';

export const useIsMobile = (size?: Breakpoint | number): boolean => {
  const theme = useTheme<Theme>();
  const isMobile = useMediaQuery(theme.breakpoints.down(size ?? 'sm'));
  return isMobile;
};