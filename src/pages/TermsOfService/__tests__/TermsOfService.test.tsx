import { render, screen } from '@testing-library/react';
import TOS from '../TermsOfService';

jest.mock('../../../components/OneTrustNotice/OneTrustNotice', () => ({
  OneTrustNotice: ({ noticeId }: { noticeId: string }) => (
    <div data-testid="notice" data-notice-id={noticeId} />
  ),
}));

describe('TOS', () => {
  it('renders the users terms notice', () => {
    render(<TOS />);
    expect(screen.getByTestId('notice')).toHaveAttribute(
      'data-notice-id',
      '570a78af-0f77-4459-8f72-b7e5f714336d'
    );
  });
});
