import { render, screen } from '@testing-library/react';
import PrivacyPolicy from '../PrivacyPolicy';

jest.mock('../../../config/oneTrust', () => ({
  oneTrustConfig: {
    privacyPolicyId: 'privacy-policy-id',
    privacyPolicyJsonUrl: 'https://example.test/privacy-policy.json',
  },
}));

jest.mock('../../../components/OneTrustNotice/OneTrustNotice', () => ({
  OneTrustNotice: ({ noticeId, noticeUrl }: { noticeId: string; noticeUrl: string }) => (
    <div data-testid="notice" data-notice-id={noticeId} data-notice-url={noticeUrl} />
  ),
}));

describe('PrivacyPolicy', () => {
  it('renders the users privacy notice', () => {
    render(<PrivacyPolicy />);
    expect(screen.getByTestId('notice')).toHaveAttribute(
      'data-notice-id',
      'privacy-policy-id'
    );
    expect(screen.getByTestId('notice')).toHaveAttribute(
      'data-notice-url',
      'https://example.test/privacy-policy.json'
    );
  });
});
