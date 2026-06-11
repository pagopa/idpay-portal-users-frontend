import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BarcodeCard from '../BarcodeCard';

jest.mock('../../../utils/env', () => ({
  getInitiativeId: () => '68dd003ccce8c534d1da22bc',
  getBaseUrl: () => 'https://www.google.com',
  isItWalletEnabled: jest.fn(() => true),
  getItWalletDeepLink: () => 'openid-credential-offer://?credential_offer=test'
}));

jest.mock('../../../utils/itWallet', () => ({
  openUrlWithStoreFallback: jest.fn(),
}));

jest.mock('react-barcode', () => {
  return function MockBarcode({ value }: { value: string }) {
    return <div data-testid="barcode" data-value={value}>Mock Barcode: {value}</div>;
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

const mockWindowOpen = jest.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
});
const mockDownloadPDF = jest.fn();
jest.mock('../../../api/onboardingWebApiClient', () => ({
  OnboardingWebApi: {
    downloadPDF: (...args: any[]) => mockDownloadPDF(...args),
  },
}));

const mockDownloadFileFromBase64 = jest.fn();
jest.mock('../../../commons/decode', () => ({
  downloadFileFromBase64: (...args: any[]) => mockDownloadFileFromBase64(...args),
}));

jest.mock('../ItWalletQrModal', () => {
  return function MockItWalletQrModal({ open, deepLink }: { open: boolean; deepLink: string }) {
    return open ? <div data-testid="wallet-modal">{deepLink}</div> : null;
  };
});

describe('BarcodeCard – download flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('download button triggers API and file download (success)', async () => {
    const trxCode = '2lezemi4';
    mockDownloadPDF.mockResolvedValue({
      status: 200,
      data: { data: 'BASE64PDF==' },
    });

    render(<BarcodeCard trxCode={trxCode} />);

    const btn = screen.getByRole('button', { name: /dashboard.barcodeSection.downloadBarcode/i });
    expect(btn).toBeEnabled();

    fireEvent.click(btn);

    await waitFor(() => expect(btn).toBeDisabled());

    expect(mockDownloadPDF).toHaveBeenCalledWith(expect.any(String), trxCode);

    await waitFor(() =>
      expect(mockDownloadFileFromBase64).toHaveBeenCalledWith(
        'BASE64PDF==',
        `barcode_${trxCode}.pdf`
      )
    );

    await waitFor(() => expect(btn).toBeEnabled());
  });

  test('download button re-enables and no file download on API error', async () => {
    const trxCode = 'ERR123';
    mockDownloadPDF.mockRejectedValue(new Error('boom'));

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<BarcodeCard trxCode={trxCode} />);

    const btn = screen.getByRole('button', { name: /dashboard.barcodeSection.downloadBarcode/i });
    fireEvent.click(btn);

    await waitFor(() => expect(btn).toBeDisabled());
    await waitFor(() => expect(mockDownloadFileFromBase64).not.toHaveBeenCalled());
    await waitFor(() => expect(btn).toBeEnabled());

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});

describe('BarcodeCard', () => {
  const originalUserAgent = window.navigator.userAgent;

  const setUserAgent = (ua: string) => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: ua,
      configurable: true,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setUserAgent(originalUserAgent);
  });

  afterAll(() => {
    setUserAgent(originalUserAgent);
  });

  test('renders barcode when trxCode is provided', () => {
    const trxCode = '2lezemi4';

    render(<BarcodeCard trxCode={trxCode} />);

    expect(screen.getByTestId('barcode')).toBeInTheDocument();
    expect(screen.getByTestId('barcode')).toHaveAttribute('data-value', trxCode);
    expect(screen.getByText(`Mock Barcode: ${trxCode}`)).toBeInTheDocument();
  });

  test('renders barcode description and buttons when trxCode is provided', () => {
    const trxCode = '2lezemi4';

    render(<BarcodeCard trxCode={trxCode} />);

    expect(screen.getByText('dashboard.barcodeSection.barcodeDescription')).toBeInTheDocument();
    expect(screen.getByText('dashboard.barcodeSection.downloadBarcode')).toBeInTheDocument();
    expect(screen.getByText('dashboard.barcodeSection.showMerchants')).toBeInTheDocument();
  });

  test('download button is enabled initially', () => {
    const trxCode = '2lezemi4';
    render(<BarcodeCard trxCode={trxCode} />);
    const downloadButton = screen.getByRole('button', { name: /dashboard.barcodeSection.downloadBarcode/i });
    expect(downloadButton).toBeEnabled();
  });

  test('show merchants button opens new window', () => {
    const trxCode = '2lezemi4';

    render(<BarcodeCard trxCode={trxCode} />);

    const showMerchantsButton = screen.getByRole('button', { name: /dashboard.barcodeSection.showMerchants/i });
    fireEvent.click(showMerchantsButton);

    expect(mockWindowOpen).toHaveBeenCalledWith('https://www.google.com/lista-punti-vendita', '_blank');
  });

  test('desktop add to wallet opens the modal', () => {
    const trxCode = '2lezemi4';
    setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36');

    render(<BarcodeCard trxCode={trxCode} />);

    const addToWalletButton = screen.getByRole('button', { name: /dashboard.barcodeSection.addToWallet/i });
    fireEvent.click(addToWalletButton);

    expect(screen.getByTestId('wallet-modal')).toHaveTextContent('openid-credential-offer://?credential_offer=test');
  });

  test('add to wallet on mobile opens the deep link with fallback', () => {
    const { openUrlWithStoreFallback } = jest.requireMock('../../../utils/itWallet');
    const trxCode = '2lezemi4';
    setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 Version/16.0 Mobile/15E148 Safari/604.1');

    render(<BarcodeCard trxCode={trxCode} />);

    const addToWalletButton = screen.getByRole('button', { name: /dashboard.barcodeSection.addToWallet/i });
    fireEvent.click(addToWalletButton);

    expect(openUrlWithStoreFallback).toHaveBeenCalledWith('openid-credential-offer://?credential_offer=test');
  });

  test('does not render add to wallet button when it wallet is disabled', () => {
    const { isItWalletEnabled } = jest.requireMock('../../../utils/env');
    isItWalletEnabled.mockReturnValue(false);

    render(<BarcodeCard trxCode='2lezemi4' />);

    expect(screen.queryByRole('button', { name: /dashboard.barcodeSection.addToWallet/i })).not.toBeInTheDocument();
  });

  test('renders preparing state when trxCode is missing', () => {
    render(<BarcodeCard trxCode='' />);

    expect(screen.getByText('Stiamo preparando il tuo barcode.')).toBeInTheDocument();
    expect(screen.getByText('Puoi provare ad aggiornarne lo stato tra qualche istante.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /dashboard.barcodeSection.addToWallet/i })).not.toBeInTheDocument();
  });

  test('renders with different trxCode values', () => {
    const trxCode1 = 'expiring123';
    const { rerender } = render(<BarcodeCard trxCode={trxCode1} />);

    expect(screen.getByTestId('barcode')).toHaveAttribute('data-value', trxCode1);

    const trxCode2 = 'test456';
    rerender(<BarcodeCard trxCode={trxCode2} />);

    expect(screen.getByTestId('barcode')).toHaveAttribute('data-value', trxCode2);
  });

  test('barcode component receives correct props', () => {
    const trxCode = '2lezemi4';

    render(<BarcodeCard trxCode={trxCode} />);

    const barcodeElement = screen.getByTestId('barcode');
    expect(barcodeElement).toHaveAttribute('data-value', trxCode);
  });
});