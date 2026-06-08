import { getItWalletStoreUrl, openUrlWithStoreFallback } from '../itWallet';

describe('getItWalletStoreUrl', () => {
  const originalUserAgent = window.navigator.userAgent;
  const originalMsStream = (navigator as any).msStream;

  const setUserAgent = (ua: string) => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: ua,
      configurable: true,
    });
  };

  beforeEach(() => {
    Object.defineProperty(window.navigator, 'vendor', {
      value: '',
      configurable: true,
    });
  });

  afterEach(() => {
    setUserAgent(originalUserAgent);
    Object.defineProperty(navigator, 'msStream', {
      value: originalMsStream,
      configurable: true,
    });
  });

  test('returns App Store url on iOS', () => {
    setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)');
    Object.defineProperty(navigator, 'msStream', {
      value: undefined,
      configurable: true,
    });
    Object.defineProperty(navigator, 'platform', {
      value: 'iPhone',
      configurable: true,
    });
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 1,
      configurable: true,
    });

    expect(getItWalletStoreUrl()).toBe('https://apps.apple.com/it/app/io/id1501681835');
  });

  test('returns App Store url on iPadOS desktop-like user agent', () => {
    setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.0 Safari/605.1.15');
    Object.defineProperty(navigator, 'platform', {
      value: 'MacIntel',
      configurable: true,
    });
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 5,
      configurable: true,
    });

    expect(getItWalletStoreUrl()).toBe('https://apps.apple.com/it/app/io/id1501681835');
  });

  test('returns Play Store url on Android and other devices', () => {
    setUserAgent('Mozilla/5.0 (Linux; Android 14; Pixel 8)');

    expect(getItWalletStoreUrl()).toBe('https://play.google.com/store/apps/details?id=it.pagopa.io.app');
  });
});

describe('openUrlWithStoreFallback', () => {
  const originalWindowOpen = window.open;

  beforeEach(() => {
    window.open = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    window.open = originalWindowOpen;
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('opens the fallback store url with window.open when the deep link is missing', () => {
    openUrlWithStoreFallback('', 'https://apps.apple.com/it/app/io/id1501681835');

    expect(window.open).toHaveBeenCalledWith(
      'https://apps.apple.com/it/app/io/id1501681835',
      '_blank',
      'noopener,noreferrer'
    );
  });

  test('opens the fallback store url with window.open when the timeout expires', () => {
    openUrlWithStoreFallback('openid4vp://test', 'https://apps.apple.com/it/app/io/id1501681835');

    jest.advanceTimersByTime(1800);

    expect(window.open).toHaveBeenCalledWith(
      'https://apps.apple.com/it/app/io/id1501681835',
      '_blank',
      'noopener,noreferrer'
    );
  });
});