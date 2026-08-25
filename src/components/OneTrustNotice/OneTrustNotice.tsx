import { useEffect } from 'react';
import { oneTrustConfig } from '../../config/oneTrust';
import { PrivacyAndTosLayout } from '../PrivacyAndTosLayout/PrivacyAndTosLayout';

const SCRIPT_ID = 'otprivacy-notice-script';

type OneTrustApi = {
  NoticeApi: {
    Initialized: Promise<void>;
    LoadNotices: (notices: Array<string>) => void;
  };
};

type Props = {
  noticeId: string;
  noticeUrl: string;
};

export const OneTrustNotice = ({ noticeId, noticeUrl }: Props) => {
  useEffect(() => {
    let active = true;

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
      script.src = oneTrustConfig.noticeScriptUrl;
      script.type = 'text/javascript';
      script.charset = 'UTF-8';
      script.setAttribute('settings', oneTrustConfig.noticeScriptSettings);
      script.addEventListener('load', loadNotice);
      document.head.appendChild(script);
    }

    return () => {
      active = false;
      document
        .getElementById(SCRIPT_ID)
        ?.removeEventListener('load', loadNotice);
    };
  }, [noticeId, noticeUrl]);

  return (
    <PrivacyAndTosLayout>
      <div className="ot-privacy-notice-language-dropdown-container" />
      <div id={`otnotice-${noticeId}`} className="otnotice" />
    </PrivacyAndTosLayout>
  );
};
