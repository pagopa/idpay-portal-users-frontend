import { getIoAppStoreUrl } from './functions';

export const getItWalletStoreUrl = (): string => {
  return getIoAppStoreUrl();
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