import { render, screen } from '@testing-library/react';
import CustomLandingSection from '../CustomLandingSection';

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

describe('CustomLandingSection', () => {
  const originalOpen = window.open;

  beforeEach(() => {
    window.open = jest.fn();
  });

  afterEach(() => {
    window.open = originalOpen;
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
});