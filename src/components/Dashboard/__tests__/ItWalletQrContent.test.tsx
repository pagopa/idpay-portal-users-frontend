import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ItWalletQrContent from '../ItWalletQrContent';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  Trans: ({ i18nKey }: { i18nKey: string }) => <>{i18nKey}</>,
}));

jest.mock('react-qr-code', () => {
  return function MockQRCode({ value }: { value: string }) {
    return <div data-testid='qr-code' data-value={value} />;
  };
});

describe('ItWalletQrContent', () => {
  test('renders title, description and qr code', () => {
    render(<ItWalletQrContent deepLink='openid-credential-offer://?credential_offer=test' />);

    expect(screen.getByText('dashboard.barcodeSection.walletModalTitle')).toBeInTheDocument();
    expect(screen.getByText('dashboard.barcodeSection.walletModalDescription')).toBeInTheDocument();
    expect(screen.getByTestId('qr-code')).toHaveAttribute('data-value', 'openid-credential-offer://?credential_offer=test');
  });

  test('renders action slot before the qr code when provided', () => {
    render(
      <ItWalletQrContent
        deepLink='openid-credential-offer://?credential_offer=test'
        actionSlot={<button type='button'>Apri l'app</button>}
      />
    );

    expect(screen.getByRole('button', { name: "Apri l'app" })).toBeInTheDocument();
  });
});