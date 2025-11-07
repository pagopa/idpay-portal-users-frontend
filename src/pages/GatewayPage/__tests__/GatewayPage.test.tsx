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
  const routes = { FEEDBACK: '/esito', TOS: '/tos', ERROR_PAGE: '/errore', DASHBOARD: '/dashboard', UPCOMING_INITIATIVE: '/iniziativa-in-arrivo' };
  return {
    __esModule: true,
    default: routes,
    FEEDBACK: routes.FEEDBACK,
    TOS: routes.TOS,
    ERROR_PAGE: routes.ERROR_PAGE,
    DASHBOARD: routes.DASHBOARD,
    UPCOMING_INITIATIVES: routes.UPCOMING_INITIATIVE,
    ROUTES: routes,
    routes,
  };
});

jest.mock('../../../api/generated/onboarding-web/OnboardingStatusDTO', () => ({
  StatusEnum: {
    ONBOARDING_OK: 'ONBOARDING_OK',
    ONBOARDING_KO: 'ONBOARDING_KO',
    REQUEST_SUBMITTED: 'REQUEST_SUBMITTED',
    ON_EVALUATION: 'ON_EVALUATION',
  },
}));

jest.mock('../../../api/generated/onboarding-web/OnboardingErrorDTO', () => ({
  CodeEnum: {
    ONBOARDING_USER_NOT_ONBOARDED: 'ONBOARDING_USER_NOT_ONBOARDED',
    ONBOARDING_INITIATIVE_NOT_STARTED: 'ONBOARDING_INITIATIVE_NOT_STARTED',
    ONBOARDING_INITIATIVE_NOT_FOUND: 'ONBOARDING_INITIATIVE_NOT_FOUND',
    ONBOARDING_INITIATIVE_STATUS_NOT_PUBLISHED: 'ONBOARDING_INITIATIVE_STATUS_NOT_PUBLISHED'
  },
}));

jest.mock('../../../pages/ErrorPage/errorStates', () => ({
  errorState: {
    UNKNOWN_ERROR: {},
    TECHNICAL_ERROR: {},
    SESSION_EXPIRED: {},
    INVALID_ACCESS_TOKEN: {},
    AGE_RESTRICTION: {},
    TOO_MANY_REQUESTS: {},
  },
}));

jest.mock('../../../pages/FeedbackPage/feedbackStates', () => ({
  feedbackStates: {
    REQUEST_SUBMITTED: {},
    ON_EVALUATION: {},
    ONBOARDING_FAMILY_UNIT_ALREADY_JOINED: {},
    ONBOARDING_WAITING_LIST: {},
    ONBOARDING_INITIATIVE_ENDED: {},
    ONBOARDING_BUDGET_EXHAUSTED: {},
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

jest.mock('../../../utils/env', () => ({
  getInitiativeId: () => '68dd003ccce8c534d1da22bc',
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
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/errore', {
          state: { status: 'SESSION_EXPIRED' },
        });
      });
    });

    test('redirects to INVALID_ACCESS_TOKEN when token is null', async () => {
      mockToken = null;
      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/errore', {
          state: { status: 'INVALID_ACCESS_TOKEN' },
        });
      });
    });

    test('redirects to INVALID_ACCESS_TOKEN when token is undefined', async () => {
      mockToken = undefined;
      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/errore', {
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
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/errore', {
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
        data: { status: 'REQUEST_SUBMITTED' },
      });

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockGetStatus).toHaveBeenCalled();
        expect(mockedUsedNavigate).not.toHaveBeenCalledWith('/errore', {
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
        data: { status: 'REQUEST_SUBMITTED' },
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
        data: { status: 'REQUEST_SUBMITTED' },
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
        data: { status: 'REQUEST_SUBMITTED' },
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
        data: { status: 'REQUEST_SUBMITTED' },
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
        data: { status: 'REQUEST_SUBMITTED' },
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
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/errore', {
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

    test('navigates to ERROR_PAGE with UNKNOWN_ERROR when status 200 with ONBOARDING_KO (unknown status)', async () => {
      mockUser = { attributes: {} };
      mockGetStatus.mockResolvedValue({
        status: 200,
        data: { status: 'ONBOARDING_KO' },
      });

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/errore', {
          state: { status: 'UNKNOWN_ERROR' },
        });
      });
    });

    test('navigates to FEEDBACK when status 200 with REQUEST_SUBMITTED (known feedback status)', async () => {
      mockUser = { attributes: {} };
      mockGetStatus.mockResolvedValue({
        status: 200,
        data: { status: 'REQUEST_SUBMITTED' },
      });

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/esito', {
          state: { status: 'REQUEST_SUBMITTED' },
        });
      });
    });

    test('navigates to FEEDBACK when status 200 with ON_EVALUATION (known feedback status)', async () => {
      mockUser = { attributes: {} };
      mockGetStatus.mockResolvedValue({
        status: 200,
        data: { status: 'ON_EVALUATION' },
      });

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/esito', {
          state: { status: 'ON_EVALUATION' },
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

    test('navigates to UNKNOWN_ERROR when status 404 with unknown error code', async () => {
      mockUser = { attributes: {} };
      mockGetStatus.mockResolvedValue({
        status: 404,
        data: { code: 'DIFFERENT_ERROR_CODE' },
      });

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/errore', {
          state: { status: 'UNKNOWN_ERROR' },
        });
      });
    });

    test('navigates to UNKNOWN_ERROR when status 404 but no error code', async () => {
      mockUser = { attributes: {} };
      mockGetStatus.mockResolvedValue({
        status: 404,
        data: { message: 'Not found' },
      });

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/errore', {
          state: { status: 'UNKNOWN_ERROR' },
        });
      });
    });
  });

  describe('API Status Responses - 400 Cases', () => {
    test('navigates to UPCOMING_INITIATIVE when status 400 with ONBOARDING_INITIATIVE_NOT_STARTED', async () => {
      mockUser = { attributes: {} };
      mockGetStatus.mockResolvedValue({
        status: 400,
        data: { code: 'ONBOARDING_INITIATIVE_NOT_STARTED' },
      });

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/iniziativa-in-arrivo');
      });
    });

    test('navigates to UPCOMING_INITIATIVE when status 400 with ONBOARDING_INITIATIVE_NOT_FOUND', async () => {
      mockUser = { attributes: {} };
      mockGetStatus.mockResolvedValue({
        status: 400,
        data: { code: 'ONBOARDING_INITIATIVE_NOT_FOUND' },
      });

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/iniziativa-in-arrivo');
      });
    });

    test('navigates to UPCOMING_INITIATIVE when status 400 with ONBOARDING_INITIATIVE_STATUS_NOT_PUBLISHED', async () => {
      mockUser = { attributes: {} };
      mockGetStatus.mockResolvedValue({
        status: 400,
        data: { code: 'ONBOARDING_INITIATIVE_STATUS_NOT_PUBLISHED' },
      });

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/iniziativa-in-arrivo');
      });
    });

    test('navigates to FEEDBACK when status 400 with known feedback status (ONBOARDING_BUDGET_EXHAUSTED)', async () => {
      mockUser = { attributes: {} };
      mockGetStatus.mockResolvedValue({
        status: 400,
        data: { code: 'ONBOARDING_BUDGET_EXHAUSTED' },
      });

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/esito', {
          state: { status: 'ONBOARDING_BUDGET_EXHAUSTED' },
        });
      });
    });

    test('navigates to UNKNOWN_ERROR when status 400 with completely unknown error code', async () => {
      mockUser = { attributes: {} };
      mockGetStatus.mockResolvedValue({
        status: 400,
        data: { code: 'SOME_RANDOM_NEW_ERROR' },
      });

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/errore', {
          state: { status: 'UNKNOWN_ERROR' },
        });
      });
    });
  });

  describe('API Status Responses - Invalid Data Cases', () => {
    test('navigates to UNKNOWN_ERROR when status 200 but missing status/code', async () => {
      mockUser = { attributes: {} };
      mockGetStatus.mockResolvedValue({
        status: 200,
        data: { invalidField: 'test' },
      });

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/errore', {
          state: { status: 'UNKNOWN_ERROR' },
        });
      });
    });

    test('navigates to UNKNOWN_ERROR when status 200 but data is null', async () => {
      mockUser = { attributes: {} };
      mockGetStatus.mockResolvedValue({
        status: 200,
        data: null,
      });

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/errore', {
          state: { status: 'UNKNOWN_ERROR' },
        });
      });
    });

    test('navigates to UNKNOWN_ERROR when status code is not a string', async () => {
      mockUser = { attributes: {} };
      mockGetStatus.mockResolvedValue({
        status: 200,
        data: { status: 123 },
      });

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/errore', {
          state: { status: 'UNKNOWN_ERROR' },
        });
      });
    });

    test('navigates to UNKNOWN_ERROR for unexpected HTTP status code', async () => {
      mockUser = { attributes: {} };
      mockGetStatus.mockResolvedValue({
        status: 418,
        data: { message: "I'm a teapot" },
      });

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/errore', {
          state: { status: 'UNKNOWN_ERROR' },
        });
      });
    });
  });

  describe('Error Handling', () => {
    test('navigates to ERROR_PAGE with UNKNOWN_ERROR when API throws generic error', async () => {
      mockUser = { attributes: {} };
      mockGetStatus.mockRejectedValue(new Error('Network error'));
      mockExtractErrorResponse.mockReturnValue(false);

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/errore', {
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
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/errore', {
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
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/errore', {
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
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/errore', {
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
        data: { status: 'REQUEST_SUBMITTED' },
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
        data: { status: 'REQUEST_SUBMITTED' },
      });

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockGetStatus).toHaveBeenCalledWith('68dd003ccce8c534d1da22bc', { "showLoader": false });
      });
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
        data: { status: 'REQUEST_SUBMITTED' },
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
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/errore', {
          state: { status: 'AGE_RESTRICTION' },
        });
      });
    });

    test('handles lowercase status codes correctly', async () => {
      mockUser = { attributes: {} };
      mockGetStatus.mockResolvedValue({
        status: 200,
        data: { status: 'request_submitted' },
      });

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/esito', {
          state: { status: 'REQUEST_SUBMITTED' },
        });
      });
    });

    test('handles status codes with extra whitespace', async () => {
      mockUser = { attributes: {} };
      mockGetStatus.mockResolvedValue({
        status: 200,
        data: { status: '  REQUEST_SUBMITTED  ' },
      });

      render(<GatewayPage />);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/esito', {
          state: { status: 'REQUEST_SUBMITTED' },
        });
      });
    });
  });
});