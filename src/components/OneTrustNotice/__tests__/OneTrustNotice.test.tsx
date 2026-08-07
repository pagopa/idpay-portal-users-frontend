import { render, waitFor } from '@testing-library/react';
import { OneTrustNotice } from '../OneTrustNotice';

const loadNotices = jest.fn();

describe('OneTrustNotice', () => {
  beforeEach(() => {
    document.getElementById('otprivacy-notice-script')?.remove();
    delete (window as typeof window & { OneTrust?: unknown }).OneTrust;
    loadNotices.mockClear();
  });

  it('loads the OneTrust script with its settings and renders the notice containers', () => {
    render(<OneTrustNotice noticeId="notice-id" />);

    const script = document.getElementById(
      'otprivacy-notice-script'
    ) as HTMLScriptElement;
    expect(script.src).toBe(
      'https://privacyportalde-cdn.onetrust.com/privacy-notice-scripts/otnotice-1.0.min.js'
    );
    expect(script.getAttribute('settings')).toBeTruthy();
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

    render(<OneTrustNotice noticeId="notice-id" />);

    await waitFor(() =>
      expect(loadNotices).toHaveBeenCalledWith([
        'https://privacyportalde-cdn.onetrust.com/storage-container/77f17844-04c3-4969-a11d-462ee77acbe1/privacy-notices/notice-id/published/privacynotice.json',
      ])
    );
  });
});
