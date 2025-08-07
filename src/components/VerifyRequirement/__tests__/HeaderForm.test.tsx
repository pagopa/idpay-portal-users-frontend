import { render, screen } from '@testing-library/react';
import HeaderForm from '../HeaderForm';
import '@testing-library/jest-dom';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('HeaderForm', () => {
  test('renders the back button with the correct text', () => {
    render(<HeaderForm />);

    expect(screen.getByRole('button', { name: 'verifyRequirements.exit' })).toBeInTheDocument();
  });

  test('renders the main title', () => {
    render(<HeaderForm />);

    expect(screen.getByText('verifyRequirements.title')).toBeInTheDocument();
  });

  test('renders the description text', () => {
    render(<HeaderForm />);

    expect(screen.getByText('verifyRequirements.description')).toBeInTheDocument();
  });
});
