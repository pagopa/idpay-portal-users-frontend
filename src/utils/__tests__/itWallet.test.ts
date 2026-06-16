import { buildAndroidIntentUrl, getItWalletStoreUrl, openItWalletDeepLink, openUrlWithStoreFallback } from '../itWallet';

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

describe('buildAndroidIntentUrl', () => {
  test('builds the intent url for Android from the deep link', () => {
    expect(buildAndroidIntentUrl('openid-credential-offer://?credential_offer=test')).toBe(
      'intent://?credential_offer=test#Intent;scheme=openid-credential-offer;package=it.pagopa.io.app;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dit.pagopa.io.app;end'
    );
  });

  test('returns the original deep link when the format is malformed', () => {
    expect(buildAndroidIntentUrl('invalid-link')).toBe('invalid-link');
    expect(buildAndroidIntentUrl('')).toBe('');
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
    openUrlWithStoreFallback('openid-credential-offer://?credential_offer=test', 'https://apps.apple.com/it/app/io/id1501681835');

    jest.advanceTimersByTime(1800);

    expect(window.open).toHaveBeenCalledWith(
      'https://apps.apple.com/it/app/io/id1501681835',
      '_blank',
      'noopener,noreferrer'
    );
  });
});

describe('openItWalletDeepLink', () => {
  const originalUserAgent = window.navigator.userAgent;
  const originalWindowOpen = window.open;

  const setUserAgent = (ua: string) => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: ua,
      configurable: true,
    });
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    setUserAgent(originalUserAgent);
    window.open = originalWindowOpen;
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  test('uses the Android intent url on Android', () => {
    setUserAgent('Mozilla/5.0 (Linux; Android 14; Pixel 8)');

    const anchor = {
      href: '',
      target: '',
      rel: '',
      click: jest.fn(),
      remove: jest.fn(),
    } as unknown as HTMLAnchorElement;

    jest.spyOn(document, 'createElement').mockReturnValue(anchor as any);
    jest.spyOn(document.body, 'appendChild').mockImplementation(() => anchor as any);

    openItWalletDeepLink('openid-credential-offer://?credential_offer=test');

    expect(anchor.href).toBe(
      'intent://?credential_offer=test#Intent;scheme=openid-credential-offer;package=it.pagopa.io.app;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dit.pagopa.io.app;end'
    );
    expect(anchor.click).toHaveBeenCalled();
  });

  test('uses the iOS fallback flow on iPhone', () => {
    setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)');

    const anchor = {
      href: '',
      target: '',
      rel: '',
      click: jest.fn(),
      remove: jest.fn(),
    } as unknown as HTMLAnchorElement;

    jest.spyOn(document, 'createElement').mockReturnValue(anchor as any);
    jest.spyOn(document.body, 'appendChild').mockImplementation(() => anchor as any);
    window.open = jest.fn();

    openItWalletDeepLink('openid-credential-offer://?credential_offer=test');

    expect(anchor.href).toBe('openid-credential-offer://?credential_offer=test');
    expect(anchor.click).toHaveBeenCalled();

    jest.advanceTimersByTime(1800);

    expect(window.open).toHaveBeenCalledWith(
      'https://apps.apple.com/it/app/io/id1501681835',
      '_blank',
      'noopener,noreferrer'
    );
  });
});