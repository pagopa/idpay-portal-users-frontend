import { getIoAppStoreUrl } from './functions';

export const getItWalletStoreUrl = (): string => {
  return getIoAppStoreUrl();
};

export const isMobileDevice = (): boolean =>
  /android|iphone|ipad|ipod/i.test(navigator.userAgent || navigator.vendor || '');

export const isAndroidDevice = (): boolean =>
  /android/i.test(navigator.userAgent || navigator.vendor || '');

export const isIosDevice = (): boolean =>
  /iphone|ipad|ipod/i.test(navigator.userAgent || navigator.vendor || '');

export const buildAndroidIntentUrl = (deepLink: string, packageName = 'it.pagopa.io.app'): string => {
  if (!deepLink) {
    return '';
  }

  const [scheme, rest] = deepLink.split('://');

  if (!scheme || !rest) {
    return deepLink;
  }

  const fallbackUrl = encodeURIComponent('https://play.google.com/store/apps/details?id=it.pagopa.io.app');

  return `intent://${rest}#Intent;scheme=${scheme};package=${packageName};S.browser_fallback_url=${fallbackUrl};end`;
};

export const navigateToUrl = (url: string): void => {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.target = '_self';
  anchor.rel = 'noreferrer';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
};

export const openUrlWithStoreFallback = (url: string, fallbackUrl: string = getItWalletStoreUrl()): (() => void) | void => {
  if (!url) {
    window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  let fallbackTimer = 0;

  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      window.clearTimeout(fallbackTimer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    }
  };

  document.addEventListener('visibilitychange', onVisibilityChange);
  fallbackTimer = window.setTimeout(() => {
    if (document.visibilityState === 'visible') {
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    }
    document.removeEventListener('visibilitychange', onVisibilityChange);
  }, 1800);

  navigateToUrl(url);

  return () => {
    window.clearTimeout(fallbackTimer);
    document.removeEventListener('visibilitychange', onVisibilityChange);
  };
};

export const openItWalletDeepLink = (deepLink: string): (() => void) | void => {
  if (!deepLink) {
    return;
  }

  if (isAndroidDevice()) {
    navigateToUrl(buildAndroidIntentUrl(deepLink));
    return;
  }

  if (isIosDevice()) {
    return openUrlWithStoreFallback(deepLink);
  }

  navigateToUrl(deepLink);
};