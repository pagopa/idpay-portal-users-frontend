import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';

const mockedNavigate = jest.fn();
let mockFiscalCode: string | undefined = 'CZZCLL82M03X000A';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
  useParams: () => ({ fiscalCode: mockFiscalCode }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../../../utils/env', () => ({
  getInitiativeId: () => '68dd003ccce8c534d1da22bc',
}));

jest.mock('../../../utils/formatUtils', () => ({
  formatDateTime: (date: string) => `formatted-${date}`,
}));

const mockTimeline = jest.fn();

jest.mock('../../../api/itWalletPaymentApiClient', () => ({
  ItWalletPaymentApi: {
    timeline: (...args: any[]) => mockTimeline(...args),
  },
}));

import ItWalletTimelinePage from '../ItWalletTimelinePage';

describe('ItWalletTimelinePage', () => {
  let intersectionCallback: IntersectionObserverCallback;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFiscalCode = 'CZZCLL82M03X000A';

    global.IntersectionObserver = jest.fn((callback) => {
      intersectionCallback = callback;

      return {
        observe: jest.fn(),
        disconnect: jest.fn(),
        unobserve: jest.fn(),
        takeRecords: jest.fn(),
      };
    }) as any;
  });

  test('loads next page when loader intersects', async () => {
    mockTimeline
      .mockResolvedValueOnce({
        data: {
          totalPages: 2,
          operationList: [
            {
              operationId: 'txn-1',
              operationType: 'TRANSACTION',
              operationDate: '2025-10-10T11:30:00.000Z',
              businessName: 'Shop Bravo',
              accruedCents: 50,
            },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          totalPages: 2,
          operationList: [
            {
              operationId: 'txn-2',
              operationType: 'TRANSACTION',
              operationDate: '2025-10-11T11:30:00.000Z',
              businessName: 'Shop Charlie',
              accruedCents: 100,
            },
          ],
        },
      });

    render(<ItWalletTimelinePage />);

    await waitFor(() => {
      expect(screen.getByText('Shop Bravo')).toBeInTheDocument();
    });

    await act(async () => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    await waitFor(() => {
      expect(mockTimeline).toHaveBeenCalledWith(
        '68dd003ccce8c534d1da22bc',
        'CZZCLL82M03X000A',
        1,
        10
      );
    });

    expect(screen.getByText('Shop Bravo')).toBeInTheDocument();
    expect(screen.getByText('Shop Charlie')).toBeInTheDocument();
  });

  test('navigates to ERROR_PAGE on API error', async () => {
    mockTimeline.mockRejectedValue(new Error('fail'));

    render(<ItWalletTimelinePage />);

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/error', {
        state: { status: 'UNKNOWN_ERROR_RETRYABLE' },
      });
    });
  });

  test('does not call API when fiscalCode is missing', async () => {
    mockFiscalCode = undefined;

    render(<ItWalletTimelinePage />);

    await waitFor(() => {
      expect(mockTimeline).not.toHaveBeenCalled();
    });
  });

  test('renders operationType when businessName is missing', async () => {
    mockTimeline.mockResolvedValue({
      data: {
        totalPages: 1,
        operationList: [
          {
            operationId: 'onb-1',
            operationType: 'dashboard.operationsSection.onboardingInitiative',
            operationDate: '2025-09-01T08:00:00.000Z',
          },
        ],
      },
    });

    render(<ItWalletTimelinePage />);

    await waitFor(() => {
      expect(
        screen.getByText('dashboard.operationsSection.onboardingInitiative')
      ).toBeInTheDocument();
    });
  });
});