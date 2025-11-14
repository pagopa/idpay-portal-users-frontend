import { render, screen } from '@testing-library/react';
import TOS from '../TermsOfService';

jest.mock('../../../components/PrivacyAndTosLayout/PrivacyAndTosLayout', () => ({
  PrivacyAndTosLayout: ({ text }: { text: string }) => (
    <div data-testid="layout" data-text={text}></div>
  ),
}));

describe('TOS', () => {
  it('renders the PrivacyAndTosLayout component', () => {
    render(<TOS />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });
});