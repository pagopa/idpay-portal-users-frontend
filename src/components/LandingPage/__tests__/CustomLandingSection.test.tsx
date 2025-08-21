import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomLandingSection from '../CustomLandingSection';
import ROUTES from '../../../routes';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'landing.requestBonus': 'Request Bonus Desktop',
        'landing.requestBonusMobile': 'Request Bonus Mobile',
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

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe('CustomLandingSection', () => {
  afterEach(() => {
    mockedNavigate.mockClear();
    jest.clearAllMocks();
  });

  it('renders desktop version of title and button', () => {
    require('../../../hooks/useIsMobile').useIsMobile.mockReturnValue(false);

    render(<CustomLandingSection />);

    expect(screen.getByText('Request Bonus Desktop')).toBeInTheDocument();
    expect(screen.getByText('Use SPID or CIE')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue on Web' })).toBeInTheDocument();
  });

  it('renders mobile version of title when isMobile is true', () => {
    require('../../../hooks/useIsMobile').useIsMobile.mockReturnValue(true);

    render(<CustomLandingSection />);

    expect(screen.getByText('Request Bonus Mobile')).toBeInTheDocument();
  });

  it('navigates to TOS on button click', async () => {
    require('../../../hooks/useIsMobile').useIsMobile.mockReturnValue(false);

    render(<CustomLandingSection />);
    await userEvent.click(screen.getByRole('button', { name: 'Continue on Web' }));

    expect(mockedNavigate).toHaveBeenCalledWith(ROUTES.TOS);
  });
});