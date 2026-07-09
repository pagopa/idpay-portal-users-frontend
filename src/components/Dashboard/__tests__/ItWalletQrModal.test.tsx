import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ItWalletQrModal from '../ItWalletQrModal';

jest.mock('../ItWalletQrContent', () => {
  return function MockItWalletQrContent({ deepLink }: { deepLink: string }) {
    return <div data-testid='it-wallet-qr-content' data-deeplink={deepLink} />;
  };
});

describe('ItWalletQrModal', () => {
  test('renders content when open', () => {
    render(<ItWalletQrModal open onClose={jest.fn()} deepLink='openid-credential-offer://?credential_offer=test' />);

    expect(screen.getByTestId('it-wallet-qr-content')).toHaveAttribute('data-deeplink', 'openid-credential-offer://?credential_offer=test');
  });

  test('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<ItWalletQrModal open onClose={onClose} deepLink='openid-credential-offer://?credential_offer=test' />);

    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});