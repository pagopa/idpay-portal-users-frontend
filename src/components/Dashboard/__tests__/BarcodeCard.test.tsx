import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BarcodeCard from '../BarcodeCard';

jest.mock('../../../utils/env', () => ({
  getInitiativeId: () => '68dd003ccce8c534d1da22bc',
  getBaseUrl: () => 'https://www.google.com'
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
  beforeEach(() => {
    jest.clearAllMocks();
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