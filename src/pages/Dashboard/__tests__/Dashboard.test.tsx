import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Dashboard from '../Dashboard';
import { VoucherStatusEnum } from '../../../api/generated/onboarding-web/InitiativeDTO';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../../../utils/env', () => ({
  getInitiativeId: () => '68dd003ccce8c534d1da22bc',
  getBaseUrl: () => 'https://www.google.com'
}));

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock('../../../components/Menu/Sidebar', () => ({
  __esModule: true,
  default: ({ onSectionChange, toggleSidebar }: any) => (
    <div data-testid="sidebar">
      <button data-testid="faq-btn" onClick={() => onSectionChange('faq')}>
        FAQ
      </button>
      <button data-testid="toggle-btn" onClick={toggleSidebar}>
        Toggle
      </button>
    </div>
  ),
}));

jest.mock('../../../components/Dashboard/DashboardDropdownMenu', () => ({
  __esModule: true,
  default: ({ onSectionChange }: any) => (
    <div data-testid="dropdown-menu">
      <button data-testid="faq-btn-mobile" onClick={() => onSectionChange('faq')}>
        FAQ Mobile
      </button>
    </div>
  ),
}));

jest.mock('../../../components/Overlay/Overlay', () => () => (
  <div data-testid="overlay" />
));

jest.mock('../../../components/Dashboard/YourBonus', () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="your-bonus" data-trx-code={props.trxCode} data-show-barcode={props.showBarcode ? 'true' : 'false'}>
      YourBonus
    </div>
  ),
}));

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

let mockUser = { attributes: { fiscalNumber: ['RSSLNZ85T10H501Z'] } };
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
  }),
}));

jest.mock('../../../hooks/useIsMobile', () => ({
  useIsMobile: jest.fn(() => false),
}));

describe('Dashboard Integration (API & Navigation)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
            operationId: 'onb-1',
            operationType: 'ONBOARDING',
            operationDate: '2025-09-01T08:00:00.000Z',
          },
        ],
      },
    });
  });

  test('calls APIs and shows YourBonus when data loaded', async () => {
    const mockBonusData = {
      voucherStatus: VoucherStatusEnum.ACTIVE,
      amountCents: 10000,
      voucherStartDate: '2025-09-24',
      voucherEndDate: '2025-10-24',
    };

    mockGetBonusDetail.mockResolvedValue({ status: 200, data: mockBonusData });
    mockGetBarCode.mockResolvedValue({ status: 200, data: { trxCode: 'abc123' } });

    render(<Dashboard />);

    expect(screen.getByTestId('overlay')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockGetBonusDetail).toHaveBeenCalled();
      expect(mockGetBarCode).toHaveBeenCalled();
      expect(mockGetTimeline).toHaveBeenCalled();
    });

    expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    expect(screen.getByTestId('your-bonus')).toHaveAttribute('data-trx-code', 'abc123');
  });

  test('does NOT call getBarCode when voucherStatus is USED', async () => {
    mockGetBonusDetail.mockResolvedValue({
      status: 200,
      data: { voucherStatus: VoucherStatusEnum.USED, amountCents: 5000 },
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(mockGetBonusDetail).toHaveBeenCalled();
    });

    expect(mockGetBarCode).not.toHaveBeenCalled();
    expect(screen.getByTestId('your-bonus')).toHaveAttribute('data-show-barcode', 'false');
  });

  test('navigates to ERROR_PAGE when bonusData is null', async () => {
    mockGetBonusDetail.mockResolvedValue({ status: 200, data: null });

    render(<Dashboard />);

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/error', {
        state: { status: 'UNKNOWN_ERROR' },
      });
    });
  });

  test('navigates to ERROR_PAGE on API error', async () => {
    mockGetBonusDetail.mockRejectedValue(new Error('fail'));

    render(<Dashboard />);

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/error', {
        state: { status: 'UNKNOWN_ERROR' },
      });
    });
  });

  test('renders FAQ section when section changed (desktop sidebar)', async () => {
    const mockBonusData = {
      voucherStatus: VoucherStatusEnum.ACTIVE,
      amountCents: 10000,
    };

    mockGetBonusDetail.mockResolvedValue({ status: 200, data: mockBonusData });
    mockGetBarCode.mockResolvedValue({ status: 200, data: { trxCode: 'xyz' } });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('faq-btn'));

    expect(screen.getByText('FAQSection.title')).toBeInTheDocument();
  });

  test('toggles sidebar collapsed state', async () => {
    const mockBonusData = {
      voucherStatus: VoucherStatusEnum.ACTIVE,
      amountCents: 10000,
    };

    mockGetBonusDetail.mockResolvedValue({ status: 200, data: mockBonusData });
    mockGetBarCode.mockResolvedValue({ status: 200, data: { trxCode: 'xyz' } });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });

    const toggleButton = screen.getByTestId('toggle-btn');
    await userEvent.click(toggleButton);
    expect(toggleButton).toBeInTheDocument();
  });
});
