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
  const routes = { FEEDBACK: '/esito', TOS: '/tos', ERROR_PAGE: '/esito' };
  return {
    __esModule: true,
    default: routes, 
    FEEDBACK: routes.FEEDBACK,
    TOS: routes.TOS,
    ERROR_PAGE: routes.ERROR_PAGE,
    ROUTES: routes,
    routes,
  };
});

jest.mock('../../../api/generated/onboarding-web/OnboardingStatusDTO', () => ({
  StatusEnum: {
    COMPLETED: 'COMPLETED',
    PENDING: 'PENDING',
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
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({ token: mockToken }),
}));

describe('GatewayPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockToken = 'token-abc';
  });

  test('redirects to FEEDBACK INVALID_ACCESS_TOKEN when token is null', async () => {
    mockToken = null;
    render(<GatewayPage />);

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/esito', {
        state: { status: 'INVALID_ACCESS_TOKEN' },
      });
    });
  });

  test('redirects to FEEDBACK INVALID_ACCESS_TOKEN when token is undefined', async () => {
    mockToken = undefined;
    render(<GatewayPage />);

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/esito', {
        state: { status: 'INVALID_ACCESS_TOKEN' },
      });
    });
  });

  test('navigates to FEEDBACK when status 200 with valid status payload', async () => {
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
    mockGetStatus.mockResolvedValue({
      status: 404,
      data: { code: 'ONBOARDING_USER_NOT_ONBOARDED' },
    });

    render(<GatewayPage />);

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/tos');
    });
  });

  test('does not navigate for unexpected status', async () => {
    mockGetStatus.mockResolvedValue({
      status: 418,
      data: { message: "I'm a teapot" },
    });

    render(<GatewayPage />);

    await waitFor(() => {
      expect(mockedUsedNavigate).not.toHaveBeenCalled();
    });
  });

  test('logs error and does not navigate when API throws', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    mockGetStatus.mockRejectedValue(new Error('Network error'));

    render(<GatewayPage />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error: ', expect.any(Error));
      expect(mockedUsedNavigate).not.toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  test('renders overlay while processing', () => {
    mockGetStatus.mockResolvedValue({
      status: 200,
      data: { status: 'COMPLETED' },
    });

    render(<GatewayPage />);
    expect(screen.getByTestId('overlay')).toBeInTheDocument();
  });
});