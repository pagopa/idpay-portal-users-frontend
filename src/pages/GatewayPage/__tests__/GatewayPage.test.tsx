import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GatewayPage from '../GatewayPage';

const mockedUsedNavigate = jest.fn();
const mockSetCanAccessTOS = jest.fn();

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

jest.mock('../../../hooks/useCanAccessTOSStore', () => ({
  useCanAccessTOSStore: () => ({
    setCanAccessTOS: mockSetCanAccessTOS,
  }),
}));

const mockExtractErrorResponse = jest.fn();
jest.mock('../../../utils/api', () => ({
  extractErrorResponse: (error: any) => mockExtractErrorResponse(error),
}));

describe('GatewayPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockToken = 'token-abc';
    mockLoading = false;
    mockUser = null;
    mockIsStorageTokenExpired.mockReturnValue(false);
    mockExtractErrorResponse.mockReturnValue(false);
  });

  describe('Loading State', () => {
    test('does not execute logic when loading is true', () => {
      mockLoading = true;
      render(<GatewayPage />);

      expect(mockedUsedNavigate).not.toHaveBeenCalled();
      expect(mockGetStatus).not.toHaveBeenCalled();
    });

    test('renders overlay while loading', () => {
      mockLoading = true;
      render(<GatewayPage />);

      expect(screen.getByTestId('overlay')).toBeInTheDocument();
    });
  });

  describe('Token Validation', () => {
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
  });

  describe('Age Restriction', () => {
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

    test('continues when user has no attributes', async () => {
      mockUser = {};

      mockGetStatus.mockResolvedValue({
        status: 200,
        data: { status: 'COMPLETED' },
      });

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockGetStatus).toHaveBeenCalled();
      });
    });
  });

  describe('User Validation', () => {
    test('redirects to UNKNOWN_ERROR when user is null (final else)', async () => {
      mockToken = 'token-abc';
      mockIsStorageTokenExpired.mockReturnValue(false);
      mockUser = null;

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/esito', {
          state: { status: 'UNKNOWN_ERROR' },
        });
      });
    });
  });

  describe('API Status Responses - Success Cases', () => {
    test('navigates to DASHBOARD when status 200 with ONBOARDING_OK status', async () => {
      mockUser = { attributes: {} };
      mockGetStatus.mockResolvedValue({
        status: 200,
        data: { status: 'ONBOARDING_OK' },
      });

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    test('navigates to DASHBOARD when status 200 with ONBOARDING_OK code', async () => {
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

    test('navigates to ERROR_PAGE with UNKNOWN_ERROR when status 200 with ONBOARDING_KO status', async () => {
      mockUser = { attributes: {} };
      mockGetStatus.mockResolvedValue({
        status: 200,
        data: { status: 'ONBOARDING_KO' },
      });

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/esito', {
          state: { status: 'UNKNOWN_ERROR' },
        });
      });
    });

    test('navigates to ERROR_PAGE with UNKNOWN_ERROR when status 200 with ONBOARDING_KO code', async () => {
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

    test('navigates to FEEDBACK when status 200 with other valid status', async () => {
      mockUser = { attributes: {} };
      mockGetStatus.mockResolvedValue({
        status: 200,
        data: { status: 'COMPLETED' },
      });

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/esito', {
          state: { status: 'COMPLETED' },
        });
      });
    });

    test('navigates to FEEDBACK when status 200 with PENDING status', async () => {
      mockUser = { attributes: {} };
      mockGetStatus.mockResolvedValue({
        status: 200,
        data: { status: 'PENDING' },
      });

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/esito', {
          state: { status: 'PENDING' },
        });
      });
    });
  });

  describe('API Status Responses - 404 Cases', () => {
    test('navigates to TOS when 404 with ONBOARDING_USER_NOT_ONBOARDED', async () => {
      mockUser = { attributes: {} };
      mockGetStatus.mockResolvedValue({
        status: 404,
        data: { code: 'ONBOARDING_USER_NOT_ONBOARDED' },
      });

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockSetCanAccessTOS).toHaveBeenCalledWith(true);
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/tos');
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
      });

      expect(mockedUsedNavigate).not.toHaveBeenCalled();
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
      });

      expect(mockedUsedNavigate).not.toHaveBeenCalled();
    });
  });

  describe('API Status Responses - Invalid Data Cases', () => {
    test('does not navigate when status 200 but invalid data structure', async () => {
      mockUser = { attributes: {} };
      mockGetStatus.mockResolvedValue({
        status: 200,
        data: { invalidField: 'test' },
      });

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockGetStatus).toHaveBeenCalled();
      });

      expect(mockedUsedNavigate).not.toHaveBeenCalled();
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
      });

      expect(mockedUsedNavigate).not.toHaveBeenCalled();
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
      });

      expect(mockedUsedNavigate).not.toHaveBeenCalled();
    });

    test('does not navigate for unexpected status code', async () => {
      mockUser = { attributes: {} };
      mockGetStatus.mockResolvedValue({
        status: 418,
        data: { message: "I'm a teapot" },
      });

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockGetStatus).toHaveBeenCalled();
      });

      expect(mockedUsedNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    test('navigates to ERROR_PAGE with UNKNOWN_ERROR when API throws generic error', async () => {
      mockUser = { attributes: {} };
      mockGetStatus.mockRejectedValue(new Error('Network error'));
      mockExtractErrorResponse.mockReturnValue(false);

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/esito', {
          state: { status: 'UNKNOWN_ERROR' },
        });
      });
    });

    test('navigates to ERROR_PAGE with TOO_MANY_REQUESTS when API returns 429', async () => {
      mockUser = { attributes: {} };
      const error429 = { status: 429, message: 'Too many requests' };
      mockGetStatus.mockRejectedValue(error429);
      mockExtractErrorResponse.mockReturnValue(true);

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/esito', {
          state: { status: 'TOO_MANY_REQUESTS' },
        });
      });
    });

    test('navigates to ERROR_PAGE with UNKNOWN_ERROR when extractErrorResponse returns true but status is not 429', async () => {
      mockUser = { attributes: {} };
      const error500 = { status: 500, message: 'Internal server error' };
      mockGetStatus.mockRejectedValue(error500);
      mockExtractErrorResponse.mockReturnValue(true);

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/esito', {
          state: { status: 'UNKNOWN_ERROR' },
        });
      });
    });

    test('handles error without status property', async () => {
      mockUser = { attributes: {} };
      const errorWithoutStatus = { message: 'Error without status' };
      mockGetStatus.mockRejectedValue(errorWithoutStatus);
      mockExtractErrorResponse.mockReturnValue(true);

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/esito', {
          state: { status: 'UNKNOWN_ERROR' },
        });
      });
    });
  });

  describe('Component Rendering', () => {
    test('renders overlay while processing', () => {
      mockUser = { attributes: {} };
      mockGetStatus.mockResolvedValue({
        status: 200,
        data: { status: 'COMPLETED' },
      });

      render(<GatewayPage />);
      expect(screen.getByTestId('overlay')).toBeInTheDocument();
    });

    test('renders main Box container', () => {
      mockUser = { attributes: {} };
      const { container } = render(<GatewayPage />);

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Initiative ID', () => {
    test('calls getStatus with correct initiative ID', async () => {
      mockUser = { attributes: {} };
      mockGetStatus.mockResolvedValue({
        status: 200,
        data: { status: 'COMPLETED' },
      });

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockGetStatus).toHaveBeenCalledWith('68dd003ccce8c534d1da22bc');
      });
    });
  });

  describe('Type Guards', () => {
    test('correctly identifies ErrorDTO with code field', async () => {
      mockUser = { attributes: {} };
      mockGetStatus.mockResolvedValue({
        status: 200,
        data: { code: 'SOME_ERROR_CODE' },
      });

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockGetStatus).toHaveBeenCalled();
      });

      expect(mockedUsedNavigate).toHaveBeenCalledWith('/esito', {
        state: { status: 'SOME_ERROR_CODE' },
      });
    });

    test('handles data object without code or status fields', async () => {
      mockUser = { attributes: {} };
      mockGetStatus.mockResolvedValue({
        status: 200,
        data: { someOtherField: 'value' },
      });

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockGetStatus).toHaveBeenCalled();
      });

      expect(mockedUsedNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    test('handles dateOfBirth with invalid date format', async () => {
      mockUser = {
        attributes: {
          dateOfBirth: ['invalid-date-format']
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

    test('handles user born exactly 18 years ago minus one day', async () => {
      const today = new Date();
      const eighteenYearsAgoMinusOneDay = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate() + 1
      );

      mockUser = {
        attributes: {
          dateOfBirth: [eighteenYearsAgoMinusOneDay.toISOString().split('T')[0]]
        }
      };

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/esito', {
          state: { status: 'AGE_RESTRICTION' },
        });
      });
    });
  });
});