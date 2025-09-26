import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BarcodeCard from '../BarcodeCard';

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

  test('does not render when trxCode is empty string', () => {
    const { container } = render(<BarcodeCard trxCode="" />);
    
    expect(container.firstChild).toBeNull();
    expect(screen.queryByTestId('barcode')).not.toBeInTheDocument();
  });

  test('does not render when trxCode is falsy', () => {
    const { container } = render(<BarcodeCard trxCode={undefined as any} />);
    
    expect(container.firstChild).toBeNull();
    expect(screen.queryByTestId('barcode')).not.toBeInTheDocument();
  });

  test('download button is disabled', () => {
    const trxCode = '2lezemi4';
    
    render(<BarcodeCard trxCode={trxCode} />);

    const downloadButton = screen.getByRole('button', { name: /dashboard.barcodeSection.downloadBarcode/i });
    expect(downloadButton).toBeDisabled();
  });

  test('show merchants button opens new window', () => {
    const trxCode = '2lezemi4';
    
    render(<BarcodeCard trxCode={trxCode} />);

    const showMerchantsButton = screen.getByRole('button', { name: /dashboard.barcodeSection.showMerchants/i });
    fireEvent.click(showMerchantsButton);

    expect(mockWindowOpen).toHaveBeenCalledWith('https://google.com', '_blank');
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