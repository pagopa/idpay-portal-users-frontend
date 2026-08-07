import { useEffect } from 'react';
import { PrivacyAndTosLayout } from '../PrivacyAndTosLayout/PrivacyAndTosLayout';

const SCRIPT_ID = 'otprivacy-notice-script';
const SCRIPT_URL =
  'https://privacyportalde-cdn.onetrust.com/privacy-notice-scripts/otnotice-1.0.min.js';
const SCRIPT_SETTINGS =
  'eyJjYWxsYmFja1VybCI6Imh0dHBzOi8vcHJpdmFjeXBvcnRhbC1kZS5vbmV0cnVzdC5jb20vcmVxdWVzdC92MS9wcml2YWN5Tm90aWNlcy9zdGF0cy92aWV3cyIsImNvbnRlbnRBcGlVcmwiOiJodHRwczovL3ByaXZhY3lwb3J0YWwtZGUub25ldHJ1c3QuY29tL3JlcXVlc3QvdjEvZW50ZXJwcmlzZXBvbGljeS9kaWdpdGFscG9saWN5L2NvbnRlbnQiLCJtZXRhZGF0YUFwaVVybCI6Imh0dHBzOi8vcHJpdmFjeXBvcnRhbC1kZS5vbmV0cnVzdC5jb20vcmVxdWVzdC92MS9lbnRlcnByaXNlcG9saWN5L2RpZ2l0YWxwb2xpY3kvbWV0YS1kYXRhIn0=';

type OneTrustApi = {
  NoticeApi: {
    Initialized: Promise<void>;
    LoadNotices: (notices: Array<string>) => void;
  };
};

type Props = {
  noticeId: string;
};

export const OneTrustNotice = ({ noticeId }: Props) => {
  useEffect(() => {
    let active = true;
    const noticeUrl = `https://privacyportalde-cdn.onetrust.com/storage-container/77f17844-04c3-4969-a11d-462ee77acbe1/privacy-notices/${noticeId}/published/privacynotice.json`;

    const loadNotice = () => {
      const oneTrust = (window as typeof window & { OneTrust?: OneTrustApi })
        .OneTrust;

      oneTrust?.NoticeApi.Initialized.then(() => {
        if (active) {
          oneTrust.NoticeApi.LoadNotices([noticeUrl]);
        }
      });
    };

    const existingScript = document.getElementById(SCRIPT_ID);
    if (existingScript) {
      if ((window as typeof window & { OneTrust?: OneTrustApi }).OneTrust) {
        loadNotice();
      } else {
        existingScript.addEventListener('load', loadNotice);
      }
    } else {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = SCRIPT_URL;
      script.type = 'text/javascript';
      script.charset = 'UTF-8';
      script.setAttribute('settings', SCRIPT_SETTINGS);
      script.addEventListener('load', loadNotice);
      document.head.appendChild(script);
    }

    return () => {
      active = false;
      document
        .getElementById(SCRIPT_ID)
        ?.removeEventListener('load', loadNotice);
    };
  }, [noticeId]);

  return (
    <PrivacyAndTosLayout>
      <div className="ot-privacy-notice-language-dropdown-container" />
      <div id={`otnotice-${noticeId}`} className="otnotice" />
    </PrivacyAndTosLayout>
  );
};
