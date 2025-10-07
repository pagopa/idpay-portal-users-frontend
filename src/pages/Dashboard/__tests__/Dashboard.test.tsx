import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../Dashboard';
import { VoucherStatusEnum } from '../../../api/generated/onboarding-web/InitiativeDTO';

const mockedUsedNavigate = jest.fn();

jest.mock('../../../components/Dashboard/DetailBonusCard', () => {
  return function MockDetailBonusCard({ bonusData, fiscalNumber }: any) {
    return (
      <div data-testid="detail-bonus-card">
        <span data-testid="bonus-amount">{bonusData.amountCents}</span>
        <span data-testid="fiscal-number">{fiscalNumber}</span>
        <span data-testid="voucher-status">{bonusData.voucherStatus}</span>
      </div>
    );
  };
});

jest.mock('../../../components/Dashboard/BarcodeCard', () => {
  return function MockBarcodeCard({ trxCode }: any) {
    return trxCode ? <div data-testid="barcode-card" data-trx-code={trxCode} /> : null;
  };
});

jest.mock('../../../components/Dashboard/OperationsCard', () => {
  return function MockOperationsCard() {
    return <div data-testid="operations-card" />;
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

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
const mockGetTimeline = jest.fn();

jest.mock('../../../api/onboardingWebApiClient', () => ({
  OnboardingWebApi: {
    getBarCode: (...args: any[]) => mockGetBarCode(...args),
    getBonusDetail: (...args: any[]) => mockGetBonusDetail(...args),
    timeline: (...args: any[]) => mockGetTimeline(...args),
  },
}));

let mockToken: string | null | undefined = 'token-abc';
let mockLoading = false;
let mockUser: any = {
  attributes: {
    fiscalNumber: ['RSSLNZ85T10H501Z']
  }
};

jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    token: mockToken,
    loading: mockLoading,
    user: mockUser
  }),
}));

describe('Dashboard Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUser = {
      attributes: {
        fiscalNumber: ['RSSLNZ85T10H501Z']
      }
    };
    mockGetTimeline.mockResolvedValue({
      status: 200,
      data: {
        operationList: [
          {
            operationId: 'txn-2',
            operationType: 'TRANSACTION',
            operationDate: '2025-10-10T11:30:00.000Z',
            businessName: 'Shop Bravo',
            accruedCents: 50,
          },
          {
            operationId: 'txn-1',
            operationType: 'TRANSACTION',
            operationDate: '2025-10-10T10:00:00.000Z',
            businessName: 'Shop Alpha',
            accruedCents: 30,
          },
          {
            operationId: 'onb-1',
            operationType: 'ONBOARDING',
            operationDate: '2025-09-01T08:00:00.000Z',
          },
        ],
      },
    });
  });

  test('fetches detail and calls getBarCode only when voucherStatus is ACTIVE; renders all components', async () => {
    const mockBonusData = {
      voucherStatus: VoucherStatusEnum.ACTIVE,
      voucherStartDate: '2025-09-24',
      voucherEndDate: '2025-10-24',
      amountCents: 10000,
    };

    mockGetBonusDetail.mockResolvedValue({
      status: 200,
      data: mockBonusData,
    });

    mockGetBarCode.mockResolvedValue({
      status: 200,
      data: { trxCode: '2lezemi4' },
    });
    

    render(<Dashboard />);

    expect(screen.getByTestId('overlay')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockGetBonusDetail).toHaveBeenCalledWith('68dd003ccce8c534d1da22bc');
    });

    await waitFor(() => {
      expect(mockGetBarCode).toHaveBeenCalledWith('68dd003ccce8c534d1da22bc');
    });

    await waitFor(() => {
      expect(mockGetTimeline).toHaveBeenCalledWith('68dd003ccce8c534d1da22bc');
    });

    await waitFor(() => {
      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('detail-bonus-card')).toBeInTheDocument();
    expect(screen.getByTestId('barcode-card')).toBeInTheDocument();
    expect(screen.getByTestId('operations-card')).toBeInTheDocument();
    expect(screen.getByTestId('bonus-amount')).toHaveTextContent('10000');
    expect(screen.getByTestId('fiscal-number')).toHaveTextContent('RSSLNZ85T10H501Z');
    expect(screen.getByTestId('voucher-status')).toHaveTextContent('ACTIVE');
    expect(screen.getByTestId('barcode-card')).toHaveAttribute('data-trx-code', '2lezemi4');

    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });

  test('fetches detail and calls getBarCode only when voucherStatus is EXPIRING', async () => {
    const mockBonusData = {
      voucherStatus: VoucherStatusEnum.EXPIRING,
      voucherStartDate: '2025-09-24',
      voucherEndDate: '2025-10-24',
      amountCents: 5000,
    };

    mockGetBonusDetail.mockResolvedValue({
      status: 200,
      data: mockBonusData,
    });

    mockGetBarCode.mockResolvedValue({
      status: 200,
      data: { trxCode: 'expiring123' },
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(mockGetBonusDetail).toHaveBeenCalledWith('68dd003ccce8c534d1da22bc');
    });

    await waitFor(() => {
      expect(mockGetBarCode).toHaveBeenCalledWith('68dd003ccce8c534d1da22bc');
    });

    await waitFor(() => {
      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('barcode-card')).toBeInTheDocument();
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });

  test('does NOT call getBarCode when voucherStatus is USED; hides barcode component', async () => {
    const mockBonusData = {
      voucherStatus: VoucherStatusEnum.USED,
      voucherStartDate: '2025-09-24',
      voucherEndDate: '2025-10-24',
      amountCents: 10000,
    };

    mockGetBonusDetail.mockResolvedValue({
      status: 200,
      data: mockBonusData,
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(mockGetBonusDetail).toHaveBeenCalledWith('68dd003ccce8c534d1da22bc');
    });

    expect(mockGetBarCode).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('detail-bonus-card')).toBeInTheDocument();
    expect(screen.getByTestId('operations-card')).toBeInTheDocument();
    expect(screen.queryByTestId('barcode-card')).not.toBeInTheDocument();

    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });

  test('does NOT call getBarCode when voucherStatus is EXPIRED; hides barcode component', async () => {
    const mockBonusData = {
      voucherStatus: VoucherStatusEnum.EXPIRED,
      voucherStartDate: '2025-09-24',
      voucherEndDate: '2025-10-24',
      amountCents: 10000,
    };

    mockGetBonusDetail.mockResolvedValue({
      status: 200,
      data: mockBonusData,
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(mockGetBonusDetail).toHaveBeenCalledWith('68dd003ccce8c534d1da22bc');
    });

    expect(mockGetBarCode).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('detail-bonus-card')).toBeInTheDocument();
    expect(screen.getByTestId('operations-card')).toBeInTheDocument();
    expect(screen.queryByTestId('barcode-card')).not.toBeInTheDocument();

    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });

  test('navigates to ERROR_PAGE with UNKNOWN_ERROR when detail API throws', async () => {
    mockGetBonusDetail.mockRejectedValue(new Error('API Error'));

    render(<Dashboard />);

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/esito', {
        state: { status: 'UNKNOWN_ERROR' },
      });
    });

    expect(mockGetBarCode).not.toHaveBeenCalled();
  });

  test('navigates to ERROR_PAGE when bonusData is null after loading', async () => {
    mockGetBonusDetail.mockResolvedValue({
      status: 200,
      data: null,
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/esito', {
        state: { status: 'UNKNOWN_ERROR' },
      });
    });
  });

  test('renders overlay while loading', () => {
    const mockBonusData = {
      voucherStatus: VoucherStatusEnum.ACTIVE,
      voucherStartDate: '2025-09-24',
      voucherEndDate: '2025-10-24',
      amountCents: 10000,
    };

    mockGetBonusDetail.mockResolvedValue({
      status: 200,
      data: mockBonusData,
    });

    mockGetBarCode.mockResolvedValue({
      status: 200,
      data: { trxCode: 'foo' },
    });

    render(<Dashboard />);
    expect(screen.getByTestId('overlay')).toBeInTheDocument();
  });

  test('renders dashboard title and description', async () => {
    const mockBonusData = {
      voucherStatus: VoucherStatusEnum.ACTIVE,
      voucherStartDate: '2025-09-24',
      voucherEndDate: '2025-10-24',
      amountCents: 10000,
    };

    mockGetBonusDetail.mockResolvedValue({
      status: 200,
      data: mockBonusData,
    });

    mockGetBarCode.mockResolvedValue({
      status: 200,
      data: { trxCode: 'test123' },
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });

    expect(screen.getByText('dashboard.title')).toBeInTheDocument();
    expect(screen.getByText('dashboard.description')).toBeInTheDocument();
  });

  test('passes correct fiscal number to DetailBonusCard', async () => {
    const mockBonusData = {
      voucherStatus: VoucherStatusEnum.ACTIVE,
      voucherStartDate: '2025-09-24',
      voucherEndDate: '2025-10-24',
      amountCents: 10000,
    };

    mockGetBonusDetail.mockResolvedValue({
      status: 200,
      data: mockBonusData,
    });

    mockGetBarCode.mockResolvedValue({
      status: 200,
      data: { trxCode: 'test123' },
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('fiscal-number')).toHaveTextContent('RSSLNZ85T10H501Z');
  });

  test('passes default fiscal number when user has no fiscal number', async () => {
    mockUser = { attributes: {} };

    const mockBonusData = {
      voucherStatus: VoucherStatusEnum.ACTIVE,
      voucherStartDate: '2025-09-24',
      voucherEndDate: '2025-10-24',
      amountCents: 10000,
    };

    mockGetBonusDetail.mockResolvedValue({
      status: 200,
      data: mockBonusData,
    });

    mockGetBarCode.mockResolvedValue({
      status: 200,
      data: { trxCode: 'test123' },
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('fiscal-number')).toHaveTextContent('-');
  });

  test('shows barcode when trxCode is available and status is ACTIVE', async () => {
    const trxCode = '2lezemi4';
    const mockBonusData = {
      voucherStatus: VoucherStatusEnum.ACTIVE,
      voucherStartDate: '2025-09-24',
      voucherEndDate: '2025-10-24',
      amountCents: 10000,
    };

    mockGetBonusDetail.mockResolvedValue({
      status: 200,
      data: mockBonusData,
    });

    mockGetBarCode.mockResolvedValue({
      status: 200,
      data: { trxCode },
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('barcode-card')).toBeInTheDocument();
    expect(screen.getByTestId('barcode-card')).toHaveAttribute('data-trx-code', trxCode);
  });

  test('hides barcode when trxCode is not available', async () => {
    const mockBonusData = {
      voucherStatus: VoucherStatusEnum.ACTIVE,
      voucherStartDate: '2025-09-24',
      voucherEndDate: '2025-10-24',
      amountCents: 10000,
    };

    mockGetBonusDetail.mockResolvedValue({
      status: 200,
      data: mockBonusData,
    });

    mockGetBarCode.mockResolvedValue({
      status: 200,
      data: { trxCode: '' }
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });

    expect(screen.queryByTestId('barcode-card')).not.toBeInTheDocument();
  });
});