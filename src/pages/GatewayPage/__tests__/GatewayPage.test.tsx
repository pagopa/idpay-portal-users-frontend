import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GatewayPage from '../GatewayPage';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock('../../../components/Overlay/Overlay', () => () => (
  <div data-testid="overlay" />
));

jest.mock('../../../routes', () => {
  const routes = { FEEDBACK: '/esito', TOS: '/tos', ERROR_PAGE: '/esito', DASHBOARD: '/dashboard' };
  return {
    __esModule: true,
    default: routes,
    FEEDBACK: routes.FEEDBACK,
    TOS: routes.TOS,
    ERROR_PAGE: routes.ERROR_PAGE,
    DASHBOARD: routes.DASHBOARD,
    ROUTES: routes,
    routes,
  };
});

jest.mock('../../../api/generated/onboarding-web/OnboardingStatusDTO', () => ({
  StatusEnum: {
    COMPLETED: 'COMPLETED',
    PENDING: 'PENDING',
    ONBOARDING_OK: 'ONBOARDING_OK',
    ONBOARDING_KO: 'ONBOARDING_KO',
  },
}));
jest.mock('../../../api/generated/onboarding-web/OnboardingErrorDTO', () => ({
  CodeEnum: {
    ONBOARDING_USER_NOT_ONBOARDED: 'ONBOARDING_USER_NOT_ONBOARDED',
  },
}));

const mockGetStatus = jest.fn();

jest.mock('../../../api/onboardingWebApiClient', () => ({
  OnboardingWebApi: {
    getStatus: (...args: any[]) => mockGetStatus(...args),
  },
}));

let mockToken: string | null | undefined = 'token-abc';
let mockLoading = false;
let mockUser: any = null;

jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    token: mockToken,
    loading: mockLoading,
    user: mockUser
  }),
}));

const mockIsStorageTokenExpired = jest.fn(() => false);
jest.mock('../../../utils/tokenManager', () => ({
  isStorageTokenExpired: () => mockIsStorageTokenExpired(),
}));

describe('GatewayPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockToken = 'token-abc';
    mockLoading = false;
    mockUser = null;
    mockIsStorageTokenExpired.mockReturnValue(false);
  });

  test('does not execute logic when loading is true', () => {
    mockLoading = true;
    render(<GatewayPage />);
    
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
    expect(mockGetStatus).not.toHaveBeenCalled();
  });

  test('redirects to SESSION_EXPIRED when storage token is expired', async () => {
    mockIsStorageTokenExpired.mockReturnValue(true);
    mockUser = { attributes: {} };
    render(<GatewayPage />);

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/esito', {
        state: { status: 'SESSION_EXPIRED' },
      });
    });
  });

  test('redirects to INVALID_ACCESS_TOKEN when token is null', async () => {
    mockToken = null;
    render(<GatewayPage />);

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/esito', {
        state: { status: 'INVALID_ACCESS_TOKEN' },
      });
    });
  });

  test('redirects to INVALID_ACCESS_TOKEN when token is undefined', async () => {
    mockToken = undefined;
    render(<GatewayPage />);

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/esito', {
        state: { status: 'INVALID_ACCESS_TOKEN' },
      });
    });
  });

  test('redirects to AGE_RESTRICTION when user is under 18', async () => {
    const today = new Date();
    const underageDate = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());

    mockUser = {
      attributes: {
        dateOfBirth: [underageDate.toISOString().split('T')[0]]
      }
    };

    render(<GatewayPage />);

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/esito', {
        state: { status: 'AGE_RESTRICTION' },
      });
    });
  });

  test('does not redirect when user is 18 or older', async () => {
    const today = new Date();
    const adultDate = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());

    mockUser = {
      attributes: {
        dateOfBirth: [adultDate.toISOString().split('T')[0]]
      }
    };

    mockGetStatus.mockResolvedValue({
      status: 200,
      data: { status: 'COMPLETED' },
    });

    render(<GatewayPage />);

    await waitFor(() => {
      expect(mockGetStatus).toHaveBeenCalled();
    });
  });

  test('continues when user has no dateOfBirth', async () => {
    mockUser = {
      attributes: {}
    };

    mockGetStatus.mockResolvedValue({
      status: 200,
      data: { status: 'COMPLETED' },
    });

    render(<GatewayPage />);

    await waitFor(() => {
      expect(mockGetStatus).toHaveBeenCalled();
    });
  });

  test('continues when user dateOfBirth is not an array', async () => {
    mockUser = {
      attributes: {
        dateOfBirth: 'not-an-array'
      }
    };

    mockGetStatus.mockResolvedValue({
      status: 200,
      data: { status: 'COMPLETED' },
    });

    render(<GatewayPage />);

    await waitFor(() => {
      expect(mockGetStatus).toHaveBeenCalled();
    });
  });

  test('continues when user dateOfBirth array is empty', async () => {
    mockUser = {
      attributes: {
        dateOfBirth: []
      }
    };

    mockGetStatus.mockResolvedValue({
      status: 200,
      data: { status: 'COMPLETED' },
    });

    render(<GatewayPage />);

    await waitFor(() => {
      expect(mockGetStatus).toHaveBeenCalled();
    });
  });

  test('navigates to FEEDBACK when status 200 with valid status payload', async () => {
    mockUser = { attributes: {} };
    mockGetStatus.mockResolvedValue({
      status: 200,
      data: { status: 'COMPLETED' },
    });

    render(<GatewayPage />);

    await waitFor(() => {
      expect(mockGetStatus).toHaveBeenCalled();
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/esito', {
        state: { status: 'COMPLETED' },
      });
    });
  });

  test('navigates to TOS when 404 with ONBOARDING_USER_NOT_ONBOARDED', async () => {
    mockUser = { attributes: {} };
    mockGetStatus.mockResolvedValue({
      status: 404,
      data: { code: 'ONBOARDING_USER_NOT_ONBOARDED' },
    });

    render(<GatewayPage />);

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/tos');
    });
  });

  test('does not navigate when status 200 but invalid data structure', async () => {
    mockUser = { attributes: {} };
    mockGetStatus.mockResolvedValue({
      status: 200,
      data: { invalidField: 'test' },
    });

    render(<GatewayPage />);

    await waitFor(() => {
      expect(mockGetStatus).toHaveBeenCalled();
      expect(mockedUsedNavigate).not.toHaveBeenCalled();
    });
  });

  test('does not navigate when status 200 but data is null', async () => {
    mockUser = { attributes: {} };
    mockGetStatus.mockResolvedValue({
      status: 200,
      data: null,
    });

    render(<GatewayPage />);

    await waitFor(() => {
      expect(mockGetStatus).toHaveBeenCalled();
      expect(mockedUsedNavigate).not.toHaveBeenCalled();
    });
  });

  test('does not navigate when status 200 but status field has invalid value', async () => {
    mockUser = { attributes: {} };
    mockGetStatus.mockResolvedValue({
      status: 200,
      data: { status: 'INVALID_STATUS' },
    });

    render(<GatewayPage />);

    await waitFor(() => {
      expect(mockGetStatus).toHaveBeenCalled();
      expect(mockedUsedNavigate).not.toHaveBeenCalled();
    });
  });

  test('does not navigate when status 404 but wrong error code', async () => {
    mockUser = { attributes: {} };
    mockGetStatus.mockResolvedValue({
      status: 404,
      data: { code: 'DIFFERENT_ERROR_CODE' },
    });

    render(<GatewayPage />);

    await waitFor(() => {
      expect(mockGetStatus).toHaveBeenCalled();
      expect(mockedUsedNavigate).not.toHaveBeenCalled();
    });
  });

  test('does not navigate when status 404 but no error code', async () => {
    mockUser = { attributes: {} };
    mockGetStatus.mockResolvedValue({
      status: 404,
      data: { message: 'Not found' },
    });

    render(<GatewayPage />);

    await waitFor(() => {
      expect(mockGetStatus).toHaveBeenCalled();
      expect(mockedUsedNavigate).not.toHaveBeenCalled();
    });
  });

  test('does not navigate for unexpected status', async () => {
    mockUser = { attributes: {} };
    mockGetStatus.mockResolvedValue({
      status: 418,
      data: { message: "I'm a teapot" },
    });

    render(<GatewayPage />);

    await waitFor(() => {
      expect(mockedUsedNavigate).not.toHaveBeenCalled();
    });
  });

  test('navigates to ERROR_PAGE with UNKNOWN_ERROR when API throws', async () => {
    mockGetStatus.mockRejectedValue(new Error('Network error'));

    render(<GatewayPage />);

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/esito', {
        state: { status: 'UNKNOWN_ERROR' },
      });
    });
  });

  test('renders overlay while processing', () => {
    mockUser = { attributes: {} };
    mockGetStatus.mockResolvedValue({
      status: 200,
      data: { status: 'COMPLETED' },
    });

    render(<GatewayPage />);
    expect(screen.getByTestId('overlay')).toBeInTheDocument();
  });
  test('allows access when user is exactly 18 years old', async () => {
    const today = new Date();
    const exactlyEighteenDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    mockUser = {
      attributes: {
        dateOfBirth: [exactlyEighteenDate.toISOString().split('T')[0]]
      }
    };

    mockGetStatus.mockResolvedValue({
      status: 200,
      data: { status: 'COMPLETED' },
    });

    render(<GatewayPage />);

    await waitFor(() => {
      expect(mockGetStatus).toHaveBeenCalled();
      expect(mockedUsedNavigate).not.toHaveBeenCalledWith('/esito', {
        state: { status: 'AGE_RESTRICTION' },
      });
    });
  });

  test('redirects to UNKNOWN_ERROR when user is null (final else)', async () => {
    mockToken = 'token-abc';
    mockIsStorageTokenExpired.mockReturnValue(false);

    render(<GatewayPage />);

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/esito', {
        state: { status: 'UNKNOWN_ERROR' },
      });
    });
  });

  test('navigates to DASHBOARD when status 200 and code is ONBOARDING_OK', async () => {
    mockUser = { attributes: {} };
    mockGetStatus.mockResolvedValue({
      status: 200,
      data: { code: 'ONBOARDING_OK' },
    });

    render(<GatewayPage />);

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
  test('navigates to ERROR_PAGE with UNKNOWN_ERROR when status 200 and code is ONBOARDING_KO', async () => {
    mockUser = { attributes: {} };
    mockGetStatus.mockResolvedValue({
      status: 200,
      data: { code: 'ONBOARDING_KO' },
    });

    render(<GatewayPage />);

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/esito', {
        state: { status: 'UNKNOWN_ERROR' },
      });
    });
  });
});