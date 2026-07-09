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
  const linkMap: Record<string, string> = {
    '/utente/privacy-policy': '/utente/',
    '/utente/terms-of-service': '/utente/'
  };

  const cookiePolicyLinks = document.querySelectorAll('.ot-cookie-policy-link, .privacy-notice-link');

  cookiePolicyLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    try {
      const url = new URL(href);
      const path = url.pathname;

      const fixedHref = linkMap[path] || path;

      link.setAttribute('href', fixedHref);
      link.removeAttribute('target');
      link.removeAttribute('rel');
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