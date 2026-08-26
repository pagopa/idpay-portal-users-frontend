import { render, screen, fireEvent } from '@testing-library/react';
import EmailInputBox from '../EmailInputBox';

describe('EmailInputBox', () => {
  test('renders placeholder and description', () => {
    render(
      <EmailInputBox
        value=""
        onChange={() => {}}
        placeholderLabel="Email"
        descriptionLabel="Insert Email"
      />
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/Insert Email/i)).toBeInTheDocument();
  });

  test('calls onChange when value changes', () => {
    const handleChange = jest.fn();
    render(<EmailInputBox value="" onChange={handleChange} placeholderLabel="Email" />);

    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    expect(handleChange).toHaveBeenCalledWith('test@example.com');
  });

  test('removes whitespace from pasted input', () => {
    const handleChange = jest.fn();
    render(<EmailInputBox value="" onChange={handleChange} placeholderLabel="Email" />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: ' test @example.com ' },
    });

    expect(handleChange).toHaveBeenCalledWith('test@example.com');
  });

  test('prevents spaces from being entered from the keyboard', () => {
    render(<EmailInputBox value="test" onChange={() => {}} placeholderLabel="Email" />);

    const input = screen.getByLabelText(/email/i);

    expect(fireEvent.keyDown(input, { key: ' ', code: 'Space' })).toBe(false);
  });

  test('shows error message if showSubmitError is true', () => {
    render(
      <EmailInputBox
        value=""
        onChange={() => {}}
        placeholderLabel="Email"
        showSubmitError={true}
        errorMessage="Invalid Email"
      />
    );

    expect(screen.getByText(/Invalid Email/i)).toBeInTheDocument();
  });
});