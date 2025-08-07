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