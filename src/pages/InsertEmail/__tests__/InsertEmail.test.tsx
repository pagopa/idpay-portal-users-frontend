import { render, screen, fireEvent } from '@testing-library/react';
import InsertEmail from '../InsertEmail';
import { MemoryRouter } from 'react-router-dom';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

const mockConsoleLog = jest.fn();
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(mockConsoleLog);
});

afterEach(() => {
  mockConsoleLog.mockClear();
});

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

  test('submits if email is valid and matches', () => {
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

    expect(mockConsoleLog).toHaveBeenCalledWith('valid email:', 'test@example.com');
  });
});
