import { render, waitFor } from '@testing-library/react';
import { OneTrustNotice } from '../OneTrustNotice';

const loadNotices = jest.fn();
const mockNoticeScriptUrl = 'https://example.test/otnotice.js';
const mockNoticeScriptSettings = 'test-settings';

jest.mock('../../../config/oneTrust', () => ({
  oneTrustConfig: {
    noticeScriptUrl: 'https://example.test/otnotice.js',
    noticeScriptSettings: 'test-settings',
  },
}));

describe('OneTrustNotice', () => {
  beforeEach(() => {
    document.getElementById('otprivacy-notice-script')?.remove();
    delete (window as typeof window & { OneTrust?: unknown }).OneTrust;
    loadNotices.mockClear();
  });

  it('loads the OneTrust script with its settings and renders the notice containers', () => {
    render(
      <OneTrustNotice
        noticeId="notice-id"
        noticeUrl="https://example.test/privacy-notice.json"
      />
    );

    const script = document.getElementById(
      'otprivacy-notice-script'
    ) as HTMLScriptElement;
    expect(script.src).toBe(mockNoticeScriptUrl);
    expect(script.getAttribute('settings')).toBe(mockNoticeScriptSettings);
    expect(document.querySelector('.ot-privacy-notice-language-dropdown-container')).toBeInTheDocument();
    expect(document.getElementById('otnotice-notice-id')).toBeInTheDocument();
  });

  it('loads the requested notice once OneTrust is initialized', async () => {
    (window as typeof window & { OneTrust?: unknown }).OneTrust = {
      NoticeApi: {
        Initialized: Promise.resolve(),
        LoadNotices: loadNotices,
      },
    };
    const script = document.createElement('script');
    script.id = 'otprivacy-notice-script';
    document.head.appendChild(script);

    render(
      <OneTrustNotice
        noticeId="notice-id"
        noticeUrl="https://example.test/privacy-notice.json"
      />
    );

    await waitFor(() =>
      expect(loadNotices).toHaveBeenCalledWith([
        'https://example.test/privacy-notice.json',
      ])
    );
  });
});
