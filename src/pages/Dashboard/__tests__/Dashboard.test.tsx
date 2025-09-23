import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../Dashboard';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock('../../../components/Overlay/Overlay', () => () => (
  <div data-testid="overlay" />
));

jest.mock('../../../routes', () => {
  const routes = { ERROR_PAGE: '/esito', DASHBOARD: '/dashboard' };
  return {
    __esModule: true,
    default: routes,
    ERROR_PAGE: routes.ERROR_PAGE,
    DASHBOARD: routes.DASHBOARD,
    ROUTES: routes,
    routes,
  };
});

const mockGetBarCode = jest.fn();

jest.mock('../../../api/onboardingWebApiClient', () => ({
  OnboardingWebApi: {
    getBarCode: (...args: any[]) => mockGetBarCode(...args),
  },
}));

describe('Dashboard logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('calls getBarCode with initiativeId and hides loader on success', async () => {
    mockGetBarCode.mockResolvedValue({
      status: 200,
      data: { trxCode: '2lezemi4' },
    });

    render(<Dashboard />);

    expect(screen.getByTestId('overlay')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockGetBarCode).toHaveBeenCalledWith('68c4449d0d8426093743d00e');
    });

    await waitFor(() => {
      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });

    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });

  test('navigates to ERROR_PAGE with UNKNOWN_ERROR when API throws', async () => {
    mockGetBarCode.mockRejectedValue(new Error('boom'));

    render(<Dashboard />);

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/esito', {
        state: { status: 'UNKNOWN_ERROR' },
      });
    });

    await waitFor(() => {
      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });
  });

  test('renders overlay while loading', () => {
    mockGetBarCode.mockResolvedValue({
      status: 200,
      data: { trxCode: 'foo' },
    });

    render(<Dashboard />);
    expect(screen.getByTestId('overlay')).toBeInTheDocument();
  });
});