import { render, screen, fireEvent } from '@testing-library/react';
import InsertEmail from '../InsertEmail';
import { MemoryRouter } from 'react-router-dom';
import ROUTES from '../../../routes';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

jest.mock('../../../hooks/useEmailStore', () => ({
  useEmailStore: () => ({
    email: '',
    confirmEmail: '',
    setEmail: jest.fn(),
    setConfirmEmail: jest.fn()
  })
}));

describe('InsertEmail page', () => {
  test('renders both email inputs and continue button', () => {
    render(
      <MemoryRouter>
        <InsertEmail />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/commons.email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/commons.confirmEmail/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /commons.continue/i })).toBeInTheDocument();
  });

  test('shows errors if emails are invalid or do not match', () => {
    render(
      <MemoryRouter>
        <InsertEmail />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/commons.email/i);
    const confirmEmailInput = screen.getByLabelText(/commons.confirmEmail/i);
    const continueButton = screen.getByRole('button', { name: /commons.continue/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(confirmEmailInput, { target: { value: 'different@email.com' } });
    fireEvent.click(continueButton);

    expect(screen.getByText(/commons.invalidEmail/i)).toBeInTheDocument();
    expect(screen.getByText(/commons.emailMismatch/i)).toBeInTheDocument();
  });

  test('navigates if email is valid and matches', () => {
    render(
      <MemoryRouter>
        <InsertEmail />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/commons.email/i);
    const confirmEmailInput = screen.getByLabelText(/commons.confirmEmail/i);
    const continueButton = screen.getByRole('button', { name: /commons.continue/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(confirmEmailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(continueButton);

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.VERIFY_REQUIREMENTS);
  });
});
