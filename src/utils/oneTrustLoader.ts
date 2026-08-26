interface OneTrustNoticeApi {
  Initialized: Promise<void>;
  LoadNotices: (urls: string[], param: boolean) => Promise<void>;
}

interface OneTrustInstance {
  NoticeApi: OneTrustNoticeApi;
}

declare global {
  interface Window {
    OneTrust?: OneTrustInstance;
  }
}

let cookieInitialized = false;
let cookieInitializationPromise: Promise<void> | null = null;

const fixOneTrustLinks = () => {
  const basePath = (import.meta.env.BASE_URL || '/utente/').replace(/\/+$/, '');
  const appBaseUrl = `${window.location.origin}${basePath}`;

  const cookiePolicyLinks = document.querySelectorAll('.ot-cookie-policy-link, .privacy-notice-link');

  cookiePolicyLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    try {
      const path = new URL(href, window.location.origin).pathname.replace(/\/+$/, '');
      const route = path.endsWith('/privacy-policy')
        ? '/privacy-policy'
        : path.endsWith('/terms-of-service')
          ? '/terms-of-service'
          : undefined;

      if (route) {
        link.setAttribute('href', `${appBaseUrl}${route}`);
        link.removeAttribute('target');
        link.removeAttribute('rel');
      }
    } catch { }
  });
};

export const initializeCookieOneTrust = (): Promise<void> => {
  if (cookieInitialized) {
    return Promise.resolve();
  }

  if (cookieInitializationPromise) {
    return cookieInitializationPromise;
  }

  cookieInitializationPromise = new Promise((resolve, reject) => {
    const cookieScript = document.createElement('script');
    cookieScript.src = `${import.meta.env.VITE_COOKIE_ONE_TRUST_BASE_URL}scripttemplates/otSDKStub.js`;
    cookieScript.type = 'text/javascript';
    cookieScript.setAttribute('data-domain-script', import.meta.env.VITE_COOKIE_ONE_TRUST_DOMAIN_ID);

    cookieScript.onload = () => {
      cookieInitialized = true;

      setTimeout(() => {
        fixOneTrustLinks();
        const observer = new MutationObserver(() => {
          fixOneTrustLinks();
        });

        const bannerContainer = document.querySelector('#onetrust-consent-sdk');
        if (bannerContainer) {
          observer.observe(bannerContainer, {
            childList: true,
            subtree: true
          });
        }
      }, 1000);
      resolve();
    };
    cookieScript.onerror = () => reject(new Error('Failed to load OneTrust SDK'));
    document.head.appendChild(cookieScript);
  });
  return cookieInitializationPromise;
};
