import { render, screen } from '@testing-library/react';
import TOS from '../TermsOfService';

jest.mock('../../../config/oneTrust', () => ({
  oneTrustConfig: {
    tosId: 'tos-id',
    tosJsonUrl: 'https://example.test/tos.json',
  },
}));

jest.mock('../../../components/OneTrustNotice/OneTrustNotice', () => ({
  OneTrustNotice: ({ noticeId, noticeUrl }: { noticeId: string; noticeUrl: string }) => (
    <div data-testid="notice" data-notice-id={noticeId} data-notice-url={noticeUrl} />
  ),
}));

describe('TOS', () => {
  it('renders the users terms notice', () => {
    render(<TOS />);
    expect(screen.getByTestId('notice')).toHaveAttribute(
      'data-notice-id',
      'tos-id'
    );
    expect(screen.getByTestId('notice')).toHaveAttribute(
      'data-notice-url',
      'https://example.test/tos.json'
    );
  });
});
