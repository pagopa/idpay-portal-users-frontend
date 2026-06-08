import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { type ReactNode } from 'react';
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
  getItWalletStoreUrl: jest.fn(() => 'https://apps.apple.com'),
  navigateToUrl: jest.fn(),
}));

jest.mock('../../../components/Dashboard/ItWalletQrContent', () => {
  return function MockItWalletQrContent({ actionSlot }: { actionSlot?: ReactNode }) {
    return (
      <div>
        <div data-testid='it-wallet-qr-content' />
        {actionSlot}
      </div>
    );
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

  test('does not auto-open anything on mount', async () => {
    const { getItWalletDeepLink } = jest.requireMock('../../../utils/env');
    const { navigateToUrl } = jest.requireMock('../../../utils/itWallet');
    getItWalletDeepLink.mockReturnValue('openid4vp://test');
    setUserAgent('Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/126.0 Mobile Safari/537.36');

    render(<ItWalletQrPage />);

    expect(await screen.findByRole('button', { name: 'dashboard.barcodeSection.walletAccessOpenApp' })).toBeInTheDocument();

    expect(navigateToUrl).toHaveBeenCalledWith('openid4vp://test');
  });

  test('does not auto-open on desktop', async () => {
    const { getItWalletDeepLink } = jest.requireMock('../../../utils/env');
    const { navigateToUrl } = jest.requireMock('../../../utils/itWallet');
    getItWalletDeepLink.mockReturnValue('openid4vp://test');
    setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36');

    render(<ItWalletQrPage />);

    expect(await screen.findByTestId('it-wallet-qr-content')).toBeInTheDocument();
    expect(navigateToUrl).not.toHaveBeenCalled();
  });

  test('opens the store from the CTA when no deep link is available', async () => {
    const { getItWalletDeepLink } = jest.requireMock('../../../utils/env');
    const { getItWalletStoreUrl, navigateToUrl } = jest.requireMock('../../../utils/itWallet');
    getItWalletDeepLink.mockReturnValue('');
    setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 Version/16.0 Mobile/15E148 Safari/604.1');

    render(<ItWalletQrPage />);

    const button = await screen.findByRole('button', { name: 'dashboard.barcodeSection.walletAccessOpenApp' });
    fireEvent.click(button);

    expect(getItWalletStoreUrl).toHaveBeenCalled();
    expect(navigateToUrl).toHaveBeenCalledWith('https://apps.apple.com');
  });

  test('shows an initial loader on mount and keeps the CTA clickable', async () => {
    const { getItWalletDeepLink } = jest.requireMock('../../../utils/env');
    const { navigateToUrl } = jest.requireMock('../../../utils/itWallet');
    getItWalletDeepLink.mockReturnValue('');
    setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 Version/16.0 Mobile/15E148 Safari/604.1');

    jest.useFakeTimers();
    render(<ItWalletQrPage />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();

    const button = await screen.findByRole('button', { name: 'dashboard.barcodeSection.walletAccessOpenApp' });
    fireEvent.click(button);

    expect(navigateToUrl).toHaveBeenCalledTimes(1);
    expect(button).toBeEnabled();
  });
});