import { render, screen } from '@testing-library/react';
import PrivacyPolicy from '../PrivacyPolicy';

jest.mock('../../../components/OneTrustNotice/OneTrustNotice', () => ({
  OneTrustNotice: ({ noticeId }: { noticeId: string }) => (
    <div data-testid="notice" data-notice-id={noticeId} />
  ),
}));

describe('PrivacyPolicy', () => {
  it('renders the users privacy notice', () => {
    render(<PrivacyPolicy />);
    expect(screen.getByTestId('notice')).toHaveAttribute(
      'data-notice-id',
      'afaba862-cf80-48de-9d82-26314e3c1bf6'
    );
  });
});
