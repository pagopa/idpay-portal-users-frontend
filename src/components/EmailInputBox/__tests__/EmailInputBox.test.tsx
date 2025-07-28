import { render, screen, fireEvent } from '@testing-library/react';
import EmailInputBox from '../EmailInputBox';

describe('EmailInputBox', () => {
  test('renders placeholder and description', () => {
    render(
      <EmailInputBox
        placeholderLabel="Email"
        descriptionLabel="Inserisci la tua email"
      />
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/inserisci la tua email/i)).toBeInTheDocument();
  });

  test('calls onChange with valid email', () => {
    const handleChange = jest.fn();

    render(<EmailInputBox placeholderLabel="Email" onChange={handleChange} />);

    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    expect(handleChange).toHaveBeenCalledWith('test@example.com', true);
  });

  test('calls onChange with invalid email', () => {
    const handleChange = jest.fn();

    render(<EmailInputBox placeholderLabel="Email" onChange={handleChange} />);

    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, { target: { value: 'not-an-email' } });

    expect(handleChange).toHaveBeenCalledWith('not-an-email', false);
  });

  test('shows error message if showSubmitError is true', () => {
    render(
      <EmailInputBox
        placeholderLabel="Email"
        showSubmitError={true}
        errorMessage="Invalid Email"
      />
    );

    expect(screen.getByText(/Invalid Email/i)).toBeInTheDocument();
  });
});
