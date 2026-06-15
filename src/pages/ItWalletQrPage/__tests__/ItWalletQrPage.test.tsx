import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ItWalletQrPage from '../ItWalletQrPage';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  Trans: ({ i18nKey }: { i18nKey: string }) => <>{i18nKey}</>,
}));

jest.mock('../../../utils/env', () => ({
  getItWalletDeepLink: jest.fn(),
}));

jest.mock('../../../utils/itWallet', () => ({
  getItWalletStoreUrl: jest.fn(() => 'https://apps.apple.com/it/app/io/id1501681835'),
  navigateToUrl: jest.fn(),
}));

jest.mock('../../../components/Dashboard/ItWalletQrContent', () => {
  return function MockItWalletQrContent() {
    return <div data-testid='it-wallet-qr-content' />;
  };
});

jest.mock('react-qr-code', () => {
  return function MockQRCode() {
    return <div data-testid='qr-code' />;
  };
});

describe('ItWalletQrPage', () => {
  const originalUserAgent = window.navigator.userAgent;

  const setUserAgent = (ua: string) => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: ua,
      configurable: true,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setUserAgent(originalUserAgent);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  afterAll(() => {
    setUserAgent(originalUserAgent);
  });

  test('renders the desktop content without auto-opening the app', () => {
    const { getItWalletDeepLink } = jest.requireMock('../../../utils/env');
    const { navigateToUrl } = jest.requireMock('../../../utils/itWallet');
    getItWalletDeepLink.mockReturnValue('openid-credential-offer://?credential_offer=test');
    setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36');
    jest.useFakeTimers();

    render(<ItWalletQrPage />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(250);
    });

    expect(screen.getByTestId('it-wallet-qr-content')).toBeInTheDocument();
    expect(navigateToUrl).not.toHaveBeenCalled();
  });

  test('on mobile it shows the open app CTA after the initial loader', () => {
    const { getItWalletDeepLink } = jest.requireMock('../../../utils/env');
    const { navigateToUrl } = jest.requireMock('../../../utils/itWallet');
    getItWalletDeepLink.mockReturnValue('openid-credential-offer://?credential_offer=test');
    setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 Version/16.0 Mobile/15E148 Safari/604.1');
    jest.useFakeTimers();

    render(<ItWalletQrPage />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(250);
    });

    expect(screen.getByRole('button', { name: "Apri l'app" })).toBeInTheDocument();
    expect(navigateToUrl).not.toHaveBeenCalled();
  });

  test('on mobile it opens the deep link and falls back to the store after 2 seconds', async () => {
    const { getItWalletDeepLink } = jest.requireMock('../../../utils/env');
    const { navigateToUrl } = jest.requireMock('../../../utils/itWallet');
    getItWalletDeepLink.mockReturnValue('openid-credential-offer://?credential_offer=test');
    setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 Version/16.0 Mobile/15E148 Safari/604.1');

    jest.useFakeTimers();

    render(<ItWalletQrPage />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(250);
    });

    const button = screen.getByRole('button', { name: "Apri l'app" });
    fireEvent.click(button);

    expect(navigateToUrl).toHaveBeenCalledWith('openid-credential-offer://?credential_offer=test');
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    expect(navigateToUrl).toHaveBeenLastCalledWith('https://apps.apple.com/it/app/io/id1501681835');
  });
});