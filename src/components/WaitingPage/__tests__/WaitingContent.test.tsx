import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import WaitingContent from '../WaitingContent';

const mockNavigate = jest.fn();
const mockSave = jest.fn();

jest.useFakeTimers();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) =>
      k === 'common.click-day.firstDescription' ? 'FIRST LINE\nSECOND LINE' : 'SECOND',
  }),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('../../../routes', () => ({
  __esModule: true,
  default: {
    FEEDBACK: '/feedback',
    ERROR_PAGE: '/error',
  },
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

jest.mock('../../../utils/env', () => ({
  getInitiativeId: () => '68dd003ccce8c534d1da22bc',
}));

import { isSuccessStatus, extractErrorResponse } from '../../../utils/api';

const basePayload = {
  initiativeId: '68dd003ccce8c534d1da22bc',
  confirmedTos: false,
  pdndAccept: true,
  selfDeclarationList: [
    { _type: 'multi_consent', code: 'isee', value: 'ISEE123' },
    { _type: 'boolean', code: '1', value: true },
  ],
  userMail: 'user@test.it',
  userMailConfirmation: 'user@test.it',
};

const flush = async (ms = 0) => {
  jest.advanceTimersByTime(ms);
  await Promise.resolve();
  await Promise.resolve();
};

describe('WaitingContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('navigates to ERROR_PAGE immediately when payload is missing', async () => {
    render(<WaitingContent payload={undefined as any} />);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/error');
    });
  });

  test('202 success -> navigates to FEEDBACK after 5s', async () => {
    (isSuccessStatus as jest.Mock).mockImplementation((s: number) => s >= 200 && s < 300);
    mockSave.mockResolvedValueOnce({ status: 202 });

    render(<WaitingContent payload={basePayload} />);

    await flush(5000);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/feedback', {
        state: { status: 'REQUEST_SUBMITTED' },
      });
    });
  });

  test('400 non-success -> navigates to ERROR_PAGE after 5s', async () => {
    (isSuccessStatus as jest.Mock).mockImplementation((s: number) => s >= 200 && s < 300);
    mockSave.mockResolvedValueOnce({ status: 400 });

    render(<WaitingContent payload={basePayload} />);

    await flush(5000);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/error', {
        state: { status: 'TECHNICAL_ERROR' },
      });
    });
  });

  test('thrown error with extract 202 -> navigates to FEEDBACK', async () => {
    mockSave.mockRejectedValueOnce(new Error('boom'));
    (extractErrorResponse as jest.Mock).mockReturnValueOnce({ status: 202 });
    (isSuccessStatus as jest.Mock).mockImplementation((s: number) => s >= 200 && s < 300);

    render(<WaitingContent payload={basePayload} />);

    await flush(5000);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/feedback', {
        state: { status: 'REQUEST_SUBMITTED' },
      });
    });
  });

  test('429 flow -> shows second description, retries after 10s, then navigates', async () => {
    mockSave.mockRejectedValueOnce(new Error('429-first'));
    (extractErrorResponse as jest.Mock).mockReturnValueOnce({ status: 429 });
    (isSuccessStatus as jest.Mock).mockImplementation((s: number) => s >= 200 && s < 300);

    render(<WaitingContent payload={basePayload} />);

    await flush(5000);

    expect(await screen.findByText('SECOND')).toBeInTheDocument();
    expect(mockSave).toHaveBeenCalledTimes(1);

    mockSave.mockRejectedValueOnce(new Error('429-second'));
    (extractErrorResponse as jest.Mock).mockReturnValueOnce({ status: 429 });

    await flush(10000);

    expect(mockSave).toHaveBeenCalledTimes(2);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/error', {
        state: { status: 'TOO_MANY_REQUESTS' },
      });
    });
  });
});
