import { render, screen } from '@testing-library/react';
import PrivacyPolicy from '../PrivacyPolicy';

jest.mock('../../../components/PrivacyAndTosLayout/PrivacyAndTosLayout', () => ({
  PrivacyAndTosLayout: ({ text }: { text: string }) => (
    <div data-testid="layout" data-text={text}></div>
  ),
}));

describe('PrivacyPolicy', () => {
  it('renders the PrivacyAndTosLayout component', () => {
    render(<PrivacyPolicy />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });
});