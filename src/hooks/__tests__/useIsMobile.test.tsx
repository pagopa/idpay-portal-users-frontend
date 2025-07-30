import { renderHook } from '@testing-library/react';
import { useIsMobile } from '../useIsMobile';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

jest.mock('@mui/material/useMediaQuery');

describe('useIsMobile', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => {
    const theme = createTheme();
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
  };

  test('returns true when screen is mobile', () => {
    (useMediaQuery as jest.Mock).mockReturnValue(true);

    const { result } = renderHook(() => useIsMobile(), { wrapper });
    expect(result.current).toBe(true);
  });

  test('returns false when screen is not mobile', () => {
    (useMediaQuery as jest.Mock).mockReturnValue(false);

    const { result } = renderHook(() => useIsMobile(), { wrapper });
    expect(result.current).toBe(false);
  });
});
