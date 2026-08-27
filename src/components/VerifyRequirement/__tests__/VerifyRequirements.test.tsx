import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VerifyRequirementForm from '../VerifyRequirementForm';

const mockNavigate = jest.fn();
const mockSave = jest.fn();
const mockTosAccepted = jest.fn(() => true);
const mockTranslationExists = jest.fn((_key: string) => true);

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { exists: (key: string) => mockTranslationExists(key) },
  }),
}));

jest.mock('../../../utils/env', () => ({
  getInitiativeId: () => '68dd003ccce8c534d1da22bc',
}));

jest.mock('../HeaderForm', () => () => <div data-testid="header-form" />);
jest.mock('../FamilyForm', () => () => <div data-testid="family-form" />);
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
  __esModule: true,
  default: {
    INSERT_EMAIL: '/insert-email',
    FEEDBACK: '/feedback',
    WAITING_PAGE: '/waiting-page',
    ERROR_PAGE: '/error',
    GATEWAY: '/gateway'
  },
}));

jest.mock('../../../hooks/useEmailStore', () => ({
  useEmailStore: () => ({ email: 'user@test.it', confirmEmail: 'user@test.it' }),
}));
jest.mock('../../../hooks/useVerifyRequirementStore', () => ({
  useVerifyRequirementStore: () => ({
    isee: '',
    selfDeclaration: false,
    setIsee: jest.fn(),
    setSelfDeclaration: jest.fn(),
  }),
}));
jest.mock('../../../hooks/useTOSCheckboxStore', () => ({
  useTOSCheckboxStore: () => ({ tosAccepted: false }),
}));

jest.mock('../../../api/onboardingWebApiClient', () => ({
  commonHeaders: { headers: { 'X-Test': '1' } },
  OnboardingWebApi: {
    save: (...args: any[]) => mockSave(...args),
  },
}));

jest.mock('../../../utils/api', () => ({
  isSuccessStatus: jest.fn(),
  extractErrorResponse: jest.fn(),
}));


jest.mock('../../../hooks/useTOSCheckboxStore', () => ({
  useTOSCheckboxStore: () => ({
    tosAccepted: mockTosAccepted(),
  }),
}));

import { isSuccessStatus, extractErrorResponse } from '../../../utils/api';

describe('VerifyRequirementForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTranslationExists.mockReturnValue(true);
  });

  test('renders and back navigates to insert email', () => {
    render(<VerifyRequirementForm />);
    expect(screen.getByTestId('header-form')).toBeInTheDocument();
    expect(screen.getByTestId('family-form')).toBeInTheDocument();
    expect(screen.getByTestId('self-declaration')).toBeInTheDocument();
    expect(screen.getByTestId('isee-form')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'commons.back' }));
    expect(mockNavigate).toHaveBeenCalledWith('/insert-email');
  });

  test('does NOT submit when invalid (empty isee & switch=false)', () => {
    render(<VerifyRequirementForm />);
    fireEvent.click(screen.getByRole('button', { name: 'verifyRequirements.submit' }));
    expect(mockSave).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('omits optional requirements when their copy is missing', async () => {
    mockTranslationExists.mockReturnValue(false);
    (isSuccessStatus as jest.Mock).mockImplementation((s: number) => s >= 200 && s < 300);
    mockSave.mockResolvedValueOnce({ status: 202 });

    render(<VerifyRequirementForm />);

    expect(screen.queryByTestId('isee-form')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'verifyRequirements.submit' }));

    await waitFor(() => expect(mockSave).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({ selfDeclarationList: [] }),
      })
    ));
  });

  test('success (202) -> FEEDBACK', async () => {
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

  test('non-success (400) -> ERROR_PAGE', async () => {
    (isSuccessStatus as jest.Mock).mockImplementation((s: number) => s >= 200 && s < 300);
    mockSave.mockResolvedValueOnce({ status: 400 });

    render(<VerifyRequirementForm />);
    fireEvent.change(screen.getByTestId('isee-form'), { target: { value: 'ISEE_BAD' } });
    fireEvent.click(screen.getByTestId('self-declaration'));
    fireEvent.click(screen.getByRole('button', { name: 'verifyRequirements.submit' }));

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/error', {
        state: { status: 'TECHNICAL_ERROR' },
      })
    );
  });

  test('thrown error + extract 202 -> FEEDBACK', async () => {
    mockSave.mockRejectedValueOnce(new Error('boom'));
    (extractErrorResponse as jest.Mock).mockReturnValueOnce({ status: 202 });
    (isSuccessStatus as jest.Mock).mockImplementation((s: number) => s >= 200 && s < 300);

    render(<VerifyRequirementForm />);
    fireEvent.change(screen.getByTestId('isee-form'), { target: { value: 'ISEE_OK' } });
    fireEvent.click(screen.getByTestId('self-declaration'));
    fireEvent.click(screen.getByRole('button', { name: 'verifyRequirements.submit' }));

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/feedback', {
        state: { status: 'REQUEST_SUBMITTED' },
      })
    );
  });

  test('thrown error + extract 429 -> WAITING_PAGE with original payload', async () => {
    mockSave.mockRejectedValueOnce(new Error('boom'));
    (extractErrorResponse as jest.Mock).mockReturnValueOnce({ status: 429 });
    (isSuccessStatus as jest.Mock).mockImplementation((s: number) => s >= 200 && s < 300);

    render(<VerifyRequirementForm />);
    fireEvent.change(screen.getByTestId('isee-form'), { target: { value: 'ISEE777' } });
    fireEvent.click(screen.getByTestId('self-declaration'));
    fireEvent.click(screen.getByRole('button', { name: 'verifyRequirements.submit' }));

    await waitFor(() => {
      expect(mockSave).toHaveBeenCalled();
      const callArg = mockSave.mock.calls[0][0];
      expect(mockNavigate).toHaveBeenCalledWith('/waiting-page', { state: callArg.body });
    });
  });

  test('redirects to GATEWAY when TOS not accepted', () => {
  mockTosAccepted.mockReturnValueOnce(false);
  
  render(<VerifyRequirementForm />);
  
  expect(mockNavigate).toHaveBeenCalledWith('/gateway', { replace: true });
});
});
