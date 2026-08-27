import { render, screen, fireEvent } from '@testing-library/react';
import InsertEmail from '../InsertEmail';
import { MemoryRouter } from 'react-router-dom';
import ROUTES from '../../../routes';
import '@testing-library/jest-dom';

const mockTosAccepted = jest.fn(() => true);
const mockNavigate = jest.fn();
const mockSetEmail = jest.fn();
const mockSetConfirmEmail = jest.fn();
const mockEmail = jest.fn(() => '');
const mockConfirmEmail = jest.fn(() => '');

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

jest.mock('../../../hooks/useTOSCheckboxStore', () => ({
  useTOSCheckboxStore: () => ({
    tosAccepted: mockTosAccepted(),
  }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

jest.mock('../../../hooks/useEmailStore', () => ({
  useEmailStore: () => ({
    email: mockEmail(),
    confirmEmail: mockConfirmEmail(),
    setEmail: mockSetEmail,
    setConfirmEmail: mockSetConfirmEmail
  })
}));

jest.mock('../../../utils/validateEmail', () => ({
  normalizeEmail: (email: string) => email.trim().replace(/\s/g, '').toLowerCase(),
  isValidEmail: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}));

jest.mock('../../../components/EmailInputBox/EmailInputBox', () => ({
  __esModule: true,
  default: ({ value, onChange, placeholderLabel, showSubmitError, errorMessage }: any) => (
    <div>
      <label htmlFor={placeholderLabel}>{placeholderLabel}</label>
      <input
        id={placeholderLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholderLabel}
      />
      {showSubmitError && <span role="alert">{errorMessage}</span>}
    </div>
  ),
}));

describe('InsertEmail Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTosAccepted.mockReturnValue(true);
    mockEmail.mockReturnValue('');
    mockConfirmEmail.mockReturnValue('');
  });

  describe('Access Control', () => {
    test('redirects to GATEWAY when tosAccepted is false', () => {
      mockTosAccepted.mockReturnValue(false);

      render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.GATEWAY, { replace: true });
    });

    test('returns null when tosAccepted is false', () => {
      mockTosAccepted.mockReturnValue(false);

      const { container } = render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      expect(container.firstChild).toBeNull();
    });

    test('renders component when tosAccepted is true', () => {
      mockTosAccepted.mockReturnValue(true);

      render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      expect(screen.getByText('insertEmail.title')).toBeInTheDocument();
    });
  });

  describe('Component Rendering', () => {
    test('renders title and description', () => {
      render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      expect(screen.getByText('insertEmail.title')).toBeInTheDocument();
      expect(screen.getByText('insertEmail.description')).toBeInTheDocument();
    });

    test('renders both email inputs', () => {
      render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      expect(screen.getByLabelText('commons.email')).toBeInTheDocument();
      expect(screen.getByLabelText('commons.confirmEmail')).toBeInTheDocument();
    });

    test('renders back and continue buttons', () => {
      render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      expect(screen.getByRole('button', { name: 'commons.back' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'commons.continue' })).toBeInTheDocument();
    });
  });

  describe('Email Input Handling', () => {
    test('updates email input when typing', () => {
      render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      const emailInput = screen.getByLabelText('commons.email');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      expect(emailInput).toHaveValue('test@example.com');
    });

    test('updates confirm email input when typing', () => {
      render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      const confirmEmailInput = screen.getByLabelText('commons.confirmEmail');

      fireEvent.change(confirmEmailInput, { target: { value: 'test@example.com' } });

      expect(confirmEmailInput).toHaveValue('test@example.com');
    });

    test('clears errors when typing in email field', () => {
      render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      const emailInput = screen.getByLabelText('commons.email');
      const continueButton = screen.getByRole('button', { name: 'commons.continue' });


      fireEvent.click(continueButton);


      fireEvent.change(emailInput, { target: { value: 'test' } });


      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    test('clears errors when typing in confirm email field', () => {
      render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      const confirmEmailInput = screen.getByLabelText('commons.confirmEmail');
      const continueButton = screen.getByRole('button', { name: 'commons.continue' });


      fireEvent.click(continueButton);


      fireEvent.change(confirmEmailInput, { target: { value: 'test' } });

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    test('shows invalid email error when email is invalid', () => {
      render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      const emailInput = screen.getByLabelText('commons.email');
      const continueButton = screen.getByRole('button', { name: 'commons.continue' });

      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.click(continueButton);

      expect(screen.getByText('commons.invalidEmail')).toBeInTheDocument();
    });

    test('shows email mismatch error when emails do not match', () => {
      render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      const emailInput = screen.getByLabelText('commons.email');
      const confirmEmailInput = screen.getByLabelText('commons.confirmEmail');
      const continueButton = screen.getByRole('button', { name: 'commons.continue' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(confirmEmailInput, { target: { value: 'different@example.com' } });
      fireEvent.click(continueButton);

      expect(screen.getByText('commons.emailMismatch')).toBeInTheDocument();
    });

    test('shows required field error when confirm email is empty', () => {
      render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      const emailInput = screen.getByLabelText('commons.email');
      const continueButton = screen.getByRole('button', { name: 'commons.continue' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(continueButton);

      expect(screen.getByText('commons.requiredField')).toBeInTheDocument();
    });

    test('shows both errors when email is invalid and emails do not match', () => {
      render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      const emailInput = screen.getByLabelText('commons.email');
      const confirmEmailInput = screen.getByLabelText('commons.confirmEmail');
      const continueButton = screen.getByRole('button', { name: 'commons.continue' });

      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.change(confirmEmailInput, { target: { value: 'different@email.com' } });
      fireEvent.click(continueButton);

      expect(screen.getByText('commons.invalidEmail')).toBeInTheDocument();
      expect(screen.getByText('commons.emailMismatch')).toBeInTheDocument();
    });

    test('does not show errors when both emails are valid and match', () => {
      render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      const emailInput = screen.getByLabelText('commons.email');
      const confirmEmailInput = screen.getByLabelText('commons.confirmEmail');
      const continueButton = screen.getByRole('button', { name: 'commons.continue' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(confirmEmailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(continueButton);

      expect(screen.queryByText('commons.invalidEmail')).not.toBeInTheDocument();
      expect(screen.queryByText('commons.emailMismatch')).not.toBeInTheDocument();
    });
  });

  describe('Navigation - Continue Button', () => {
    test('navigates to VERIFY_REQUIREMENTS when form is valid', () => {
      render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      const emailInput = screen.getByLabelText('commons.email');
      const confirmEmailInput = screen.getByLabelText('commons.confirmEmail');
      const continueButton = screen.getByRole('button', { name: 'commons.continue' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(confirmEmailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(continueButton);

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.VERIFY_REQUIREMENTS);
    });

    test('saves emails to store before navigating', () => {
      render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      const emailInput = screen.getByLabelText('commons.email');
      const confirmEmailInput = screen.getByLabelText('commons.confirmEmail');
      const continueButton = screen.getByRole('button', { name: 'commons.continue' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(confirmEmailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(continueButton);

      expect(mockSetEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockSetConfirmEmail).toHaveBeenCalledWith('test@example.com');
    });

    test('accepts different casing and stores both emails in lowercase', () => {
      render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      const emailInput = screen.getByLabelText('commons.email');
      const confirmEmailInput = screen.getByLabelText('commons.confirmEmail');

      fireEvent.change(emailInput, { target: { value: '  Test @Test.com  ' } });
      fireEvent.change(confirmEmailInput, { target: { value: ' test@ test.com ' } });
      fireEvent.click(screen.getByRole('button', { name: 'commons.continue' }));

      expect(emailInput).toHaveValue('test@test.com');
      expect(confirmEmailInput).toHaveValue('test@test.com');
      expect(mockSetEmail).toHaveBeenCalledWith('test@test.com');
      expect(mockSetConfirmEmail).toHaveBeenCalledWith('test@test.com');
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.VERIFY_REQUIREMENTS);
    });

    test('does not navigate when form is invalid', () => {
      render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      const continueButton = screen.getByRole('button', { name: 'commons.continue' });

      fireEvent.click(continueButton);

      expect(mockNavigate).not.toHaveBeenCalledWith(ROUTES.VERIFY_REQUIREMENTS);
    });

    test('sets showErrors to true when form is invalid', () => {
      render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      const emailInput = screen.getByLabelText('commons.email');
      const continueButton = screen.getByRole('button', { name: 'commons.continue' });

      fireEvent.change(emailInput, { target: { value: 'invalid' } });
      fireEvent.click(continueButton);

      expect(screen.getByText('commons.invalidEmail')).toBeInTheDocument();
    });
  });

  describe('Navigation - Back Button', () => {
    test('navigates to TOS when back button is clicked', () => {
      render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      const backButton = screen.getByRole('button', { name: 'commons.back' });

      fireEvent.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.TOS);
    });

    test('saves current email inputs before navigating back', () => {
      render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      const emailInput = screen.getByLabelText('commons.email');
      const confirmEmailInput = screen.getByLabelText('commons.confirmEmail');
      const backButton = screen.getByRole('button', { name: 'commons.back' });

      fireEvent.change(emailInput, { target: { value: 'partial@email.com' } });
      fireEvent.change(confirmEmailInput, { target: { value: 'partial' } });
      fireEvent.click(backButton);

      expect(mockSetEmail).toHaveBeenCalledWith('partial@email.com');
      expect(mockSetConfirmEmail).toHaveBeenCalledWith('partial');
    });
  });

  describe('UseEffect and State Initialization', () => {
    test('initializes inputs with stored email values', () => {
      mockEmail.mockReturnValue('stored@example.com');
      mockConfirmEmail.mockReturnValue('stored@example.com');

      render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      const emailInput = screen.getByLabelText('commons.email');
      const confirmEmailInput = screen.getByLabelText('commons.confirmEmail');

      expect(emailInput).toHaveValue('stored@example.com');
      expect(confirmEmailInput).toHaveValue('stored@example.com');
    });

    test('updates inputs when store values change', () => {
      mockEmail.mockReturnValue('initial@example.com');
      mockConfirmEmail.mockReturnValue('initial@example.com');

      const { rerender } = render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      mockEmail.mockReturnValue('updated@example.com');
      mockConfirmEmail.mockReturnValue('updated@example.com');

      rerender(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      const emailInput = screen.getByLabelText('commons.email');
      const confirmEmailInput = screen.getByLabelText('commons.confirmEmail');

      expect(emailInput).toHaveValue('updated@example.com');
      expect(confirmEmailInput).toHaveValue('updated@example.com');
    });

    test('does not redirect when tosAccepted is true in useEffect', () => {
      mockTosAccepted.mockReturnValue(true);
      mockNavigate.mockClear();

      render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    test('handles empty email inputs on continue', () => {
      render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      const continueButton = screen.getByRole('button', { name: 'commons.continue' });

      fireEvent.click(continueButton);

      expect(mockNavigate).not.toHaveBeenCalledWith(ROUTES.VERIFY_REQUIREMENTS);
    });

    test('handles only email filled, confirm email empty', () => {
      render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      const emailInput = screen.getByLabelText('commons.email');
      const continueButton = screen.getByRole('button', { name: 'commons.continue' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(continueButton);

      expect(screen.getByText('commons.requiredField')).toBeInTheDocument();
    });

    test('removes spaces from email input', () => {
      render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      const emailInput = screen.getByLabelText('commons.email');

      fireEvent.change(emailInput, { target: { value: 'test @example.com' } });

      expect(emailInput).toHaveValue('test@example.com');
      expect(screen.queryByText('commons.invalidEmail')).not.toBeInTheDocument();
    });

    test('handles very long email addresses', () => {
      render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      const longEmail = 'verylongemailaddress123456789@verylongdomainname123456789.com';
      const emailInput = screen.getByLabelText('commons.email');
      const confirmEmailInput = screen.getByLabelText('commons.confirmEmail');
      const continueButton = screen.getByRole('button', { name: 'commons.continue' });

      fireEvent.change(emailInput, { target: { value: longEmail } });
      fireEvent.change(confirmEmailInput, { target: { value: longEmail } });
      fireEvent.click(continueButton);

      expect(mockSetEmail).toHaveBeenCalledWith(longEmail);
    });
  });

  describe('Error Message Logic', () => {
    test('shows correct error for empty confirm email', () => {
      render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      const emailInput = screen.getByLabelText('commons.email');
      const continueButton = screen.getByRole('button', { name: 'commons.continue' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(continueButton);

      expect(screen.getByText('commons.requiredField')).toBeInTheDocument();
    });

    test('shows emailMismatch when both fields have values but differ', () => {
      render(
        <MemoryRouter>
          <InsertEmail />
        </MemoryRouter>
      );

      const emailInput = screen.getByLabelText('commons.email');
      const confirmEmailInput = screen.getByLabelText('commons.confirmEmail');
      const continueButton = screen.getByRole('button', { name: 'commons.continue' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(confirmEmailInput, { target: { value: 'different@example.com' } });
      fireEvent.click(continueButton);

      expect(screen.getByText('commons.emailMismatch')).toBeInTheDocument();
      expect(screen.queryByText('commons.requiredField')).not.toBeInTheDocument();
    });
  });
});