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
const mockGetBonusDetail = jest.fn();

jest.mock('../../../api/onboardingWebApiClient', () => ({
  OnboardingWebApi: {
    getBarCode: (...args: any[]) => mockGetBarCode(...args),
    getBonusDetail: (...args: any[]) => mockGetBonusDetail(...args),
  },
}));

describe('Dashboard logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetches detail and calls getBarCode only when voucherStatus is ACTIVE/EXPIRING; hides loader on success', async () => {
    mockGetBonusDetail.mockResolvedValue({
      status: 200,
      data: {
        voucherStatus: 'ACTIVE',
        voucherStartDate: '2025-09-24',
        voucherEndDate: '2025-09-24',
        accruedCents: 10000,
        refundedCents: 0,
      },
    });
    mockGetBarCode.mockResolvedValue({
      status: 200,
      data: { trxCode: '2lezemi4' },
    });

    render(<Dashboard />);

    expect(screen.getByTestId('overlay')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockGetBonusDetail).toHaveBeenCalledWith('68c4449d0d8426093743d00e');
    });

    await waitFor(() => {
      expect(mockGetBarCode).toHaveBeenCalledWith('68c4449d0d8426093743d00e');
    });

    await waitFor(() => {
      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });

    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });

  test('does NOT call getBarCode when voucherStatus is not ACTIVE/EXPIRING; hides loader', async () => {
    mockGetBonusDetail.mockResolvedValue({
      status: 200,
      data: {
        voucherStatus: 'USED',
        voucherStartDate: '2025-09-24',
        voucherEndDate: '2025-09-24',
        accruedCents: 10000,
        refundedCents: 5000,
      },
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(mockGetBonusDetail).toHaveBeenCalledWith('68c4449d0d8426093743d00e');
    });

    expect(mockGetBarCode).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });

    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });

  test('navigates to ERROR_PAGE with UNKNOWN_ERROR when detail API throws (overlay remains)', async () => {
    mockGetBonusDetail.mockRejectedValue(new Error('boom'));

    render(<Dashboard />);

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/esito', {
        state: { status: 'UNKNOWN_ERROR' },
      });
    });

    expect(screen.getByTestId('overlay')).toBeInTheDocument();

    expect(mockGetBarCode).not.toHaveBeenCalled();
  });

  test('renders overlay while loading', () => {
    mockGetBonusDetail.mockResolvedValue({
      status: 200,
      data: {
        voucherStatus: 'ACTIVE',
        voucherStartDate: '2025-09-24',
        voucherEndDate: '2025-09-24',
        accruedCents: 10000,
        refundedCents: 0,
      },
    });
    mockGetBarCode.mockResolvedValue({
      status: 200,
      data: { trxCode: 'foo' },
    });

    render(<Dashboard />);
    expect(screen.getByTestId('overlay')).toBeInTheDocument();
  });
});