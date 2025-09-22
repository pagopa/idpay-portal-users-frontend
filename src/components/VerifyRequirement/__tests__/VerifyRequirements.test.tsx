import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VerifyRequirementForm from '../VerifyRequirementForm';
import '@testing-library/jest-dom';

const mockNavigate = jest.fn();
const mockSave = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../FamilyForm', () => () => <div data-testid="family-form" />);
jest.mock('../HeaderForm', () => () => <div data-testid="header-form" />);

jest.mock('../SelfDeclaration', () => (props: any) => (
  <button data-testid="self-declaration" onClick={() => props.setSwitchValue(true)}>
    {props.switchValue ? 'true' : 'false'}
  </button>
));

jest.mock('../IseeForm', () => (props: any) => (
  <input
    data-testid="isee-form"
    value={props.iseeValue}
    onChange={(e) => props.setIseeValue(e.target.value)}
  />
));

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('../../../routes', () => ({
  INSERT_EMAIL: '/insert-email',
  FEEDBACK: '/feedback',
}));

jest.mock('../../../hooks/useEmailStore', () => ({
  useEmailStore: () => ({ email: 'user@test.it', confirmEmail: 'user@test.it' }),
}));

jest.mock('../../../api/onboardingWebApiClient', () => ({
  commonHeaders: { headers: { 'X-Test': '1' } },
  OnboardingWebApi: {
    save: (...args: any[]) => mockSave(...args),
  },
}));

jest.mock('../../../utils/api', () => {
  return {
    isSuccessStatus: jest.fn(),
    extractErrorResponse: jest.fn(),
  };
});

import { isSuccessStatus, extractErrorResponse } from '../../../utils/api';

describe('VerifyRequirementForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all sections and buttons', () => {
    render(<VerifyRequirementForm />);

    expect(screen.getByTestId('header-form')).toBeInTheDocument();
    expect(screen.getByTestId('family-form')).toBeInTheDocument();
    expect(screen.getByTestId('self-declaration')).toBeInTheDocument();
    expect(screen.getByTestId('isee-form')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'commons.back' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'verifyRequirements.submit' })).toBeInTheDocument();
  });

  test('initial props to SelfDeclaration and IseeForm', () => {
    render(<VerifyRequirementForm />);
    expect(screen.getByTestId('self-declaration')).toHaveTextContent('false');
    expect(screen.getByTestId('isee-form')).toHaveValue('');
  });

  test('back button navigates to insert email', () => {
    render(<VerifyRequirementForm />);
    fireEvent.click(screen.getByRole('button', { name: 'commons.back' }));
    expect(mockNavigate).toHaveBeenCalledWith('/insert-email');
  });

  test('does NOT submit when form invalid', async () => {
    render(<VerifyRequirementForm />);

    fireEvent.click(screen.getByRole('button', { name: 'verifyRequirements.submit' }));
    expect(mockSave).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('submits and navigates on 202 success path', async () => {
    (isSuccessStatus as jest.Mock).mockImplementation((s: number) => s >= 200 && s < 300);
    mockSave.mockResolvedValueOnce({ status: 202 });

    render(<VerifyRequirementForm />);
    fireEvent.change(screen.getByTestId('isee-form'), { target: { value: 'ISEE123' } });
    fireEvent.click(screen.getByTestId('self-declaration'));
    fireEvent.click(screen.getByRole('button', { name: 'verifyRequirements.submit' }));

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/feedback', {
        state: { status: 'REQUEST_SUBMITTED' },
      })
    );
  });

  test('passes expected payload to save', async () => {
    (isSuccessStatus as jest.Mock).mockReturnValue(true);
    mockSave.mockResolvedValueOnce({ status: 202 });

    render(<VerifyRequirementForm />);
    fireEvent.change(screen.getByTestId('isee-form'), { target: { value: 'ISEE999' } });
    fireEvent.click(screen.getByTestId('self-declaration'));
    fireEvent.click(screen.getByRole('button', { name: 'verifyRequirements.submit' }));

    await waitFor(() => expect(mockSave).toHaveBeenCalled());

    const callArg = mockSave.mock.calls[0][0];
    expect(callArg.body.userMail).toBe('user@test.it');
    expect(callArg.body.userMailConfirmation).toBe('user@test.it');
    expect(callArg.body.initiativeId).toBe('68c4449d0d8426093743d00e');
  });

  test('handles non-success API status', async () => {
    (isSuccessStatus as jest.Mock).mockImplementation((s: number) => s >= 200 && s < 300);
    mockSave.mockResolvedValueOnce({ status: 400 });

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<VerifyRequirementForm />);
    fireEvent.change(screen.getByTestId('isee-form'), { target: { value: 'ISEE123' } });
    fireEvent.click(screen.getByTestId('self-declaration'));
    fireEvent.click(screen.getByRole('button', { name: 'verifyRequirements.submit' }));

    await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled());
    errorSpy.mockRestore();
  });

  test('handles thrown error with extractErrorResponse -> 202', async () => {
    mockSave.mockRejectedValueOnce(new Error('boom'));
    (extractErrorResponse as jest.Mock).mockReturnValueOnce({ status: 202 });
    (isSuccessStatus as jest.Mock).mockImplementation((s: number) => s >= 200 && s < 300);

    render(<VerifyRequirementForm />);
    fireEvent.change(screen.getByTestId('isee-form'), { target: { value: 'ISEE123' } });
    fireEvent.click(screen.getByTestId('self-declaration'));
    fireEvent.click(screen.getByRole('button', { name: 'verifyRequirements.submit' }));

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/feedback', {
        state: { status: 'REQUEST_SUBMITTED' },
      })
    );
  });

  test('handles thrown error with non-success extractErrorResponse', async () => {
    mockSave.mockRejectedValueOnce(new Error('boom'));
    (extractErrorResponse as jest.Mock).mockReturnValueOnce({ status: 500 });
    (isSuccessStatus as jest.Mock).mockImplementation((s: number) => s >= 200 && s < 300);

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<VerifyRequirementForm />);
    fireEvent.change(screen.getByTestId('isee-form'), { target: { value: 'ISEE123' } });
    fireEvent.click(screen.getByTestId('self-declaration'));
    fireEvent.click(screen.getByRole('button', { name: 'verifyRequirements.submit' }));

    await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled());
    errorSpy.mockRestore();
  });
});
