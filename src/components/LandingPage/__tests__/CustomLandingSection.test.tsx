import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomLandingSection from '../CustomLandingSection';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'landing.requestBonus': 'Request Bonus Desktop',
        'landing.loginMethods': 'Use SPID or CIE',
        'landing.continueOnWeb': 'Continue on Web',
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock('../../../hooks/useIsMobile', () => ({
  useIsMobile: jest.fn(),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => jest.fn()
  };
});

jest.mock('../../../contexts/AuthContext', () => {
  const mod: any = {};
  mod.loginMock = jest.fn();
  mod.useAuth = () => ({ login: mod.loginMock });
  return mod;
});


describe('CustomLandingSection', () => {
  const AuthCtxMock = require('../../../contexts/AuthContext');
  const { useIsMobile } = require('../../../hooks/useIsMobile');

  beforeEach(() => {
    AuthCtxMock.loginMock.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders desktop version of title and button', () => {
    useIsMobile.mockReturnValue(false);

    render(<CustomLandingSection />);

    expect(screen.getByText('Request Bonus Desktop')).toBeInTheDocument();
    expect(screen.getByText('Use SPID or CIE')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue on Web' })).toBeInTheDocument();
  });

  it('calls login on button click', async () => {
    useIsMobile.mockReturnValue(false);

    render(<CustomLandingSection />);
    await userEvent.click(screen.getByRole('button', { name: 'Continue on Web' }));

    expect(AuthCtxMock.loginMock).toHaveBeenCalledTimes(1);
  });
});
