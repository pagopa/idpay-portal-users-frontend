import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomLandingSection from '../CustomLandingSection';
import ROUTES from '../../../routes';

const mockNavigate = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'landing.requestBonus': 'Request Bonus Desktop',
        'landing.requestBonusMobile': 'Request Bonus Mobile',
        'landing.loginMethods': 'Use SPID, CIE, or IT Wallet',
        'landing.continueWithSpidCie': 'Continue with SPID or CIE',
        'landing.continueWithItWallet': 'Continue with IT Wallet',
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock('../../../hooks/useIsMobile', () => ({
  useIsMobile: jest.fn(),
}));

jest.mock('../../../utils/env', () => ({
  isItWalletEnabled: () => true
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

jest.mock('../../../contexts/AuthContext', () => {
  const mod: any = {
    authState: {
      isAuthenticated: false,
    },
    loginMock: jest.fn(),
  };
  mod.useAuth = () => ({
    login: mod.loginMock,
    isAuthenticated: mod.authState.isAuthenticated,
  });
  return mod;
});


describe('CustomLandingSection', () => {
  const AuthCtxMock = require('../../../contexts/AuthContext');
  const { useIsMobile } = require('../../../hooks/useIsMobile');

  beforeEach(() => {
    AuthCtxMock.loginMock.mockClear();
    AuthCtxMock.authState.isAuthenticated = false;
    mockNavigate.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders desktop version of title and button', () => {
    useIsMobile.mockReturnValue(false);

    render(<CustomLandingSection />);

    expect(screen.getByText('Request Bonus Desktop')).toBeInTheDocument();
    expect(screen.getByText('Use SPID, CIE, or IT Wallet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue with SPID or CIE' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue with IT Wallet' })).toBeInTheDocument();
  });

  it('renders mobile version of title when isMobile is true', () => {
    useIsMobile.mockReturnValue(true);

    render(<CustomLandingSection />);

    expect(screen.getByText('Request Bonus Mobile')).toBeInTheDocument();
  });

  it('calls SPID/CIE login on button click', async () => {
    useIsMobile.mockReturnValue(false);

    render(<CustomLandingSection />);
    await userEvent.click(screen.getByRole('button', { name: 'Continue with SPID or CIE' }));

    expect(AuthCtxMock.loginMock).toHaveBeenCalledTimes(1);
    expect(AuthCtxMock.loginMock).toHaveBeenCalledWith('spid-cie');
  });

  it('calls IT Wallet login on button click', async () => {
    useIsMobile.mockReturnValue(false);

    render(<CustomLandingSection />);
    await userEvent.click(screen.getByRole('button', { name: 'Continue with IT Wallet' }));

    expect(AuthCtxMock.loginMock).toHaveBeenCalledTimes(1);
    expect(AuthCtxMock.loginMock).toHaveBeenCalledWith('it-wallet');
  });

  it('routes authenticated users to TOS instead of triggering login', async () => {
    useIsMobile.mockReturnValue(false);
    AuthCtxMock.authState.isAuthenticated = true;

    render(<CustomLandingSection />);
    await userEvent.click(screen.getByRole('button', { name: 'Continue with IT Wallet' }));

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.TOS);
    expect(AuthCtxMock.loginMock).not.toHaveBeenCalled();
  });
});
