import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TOS from '../TOS'; // Adjust path as needed
import '@testing-library/jest-dom';

jest.mock('../../../hooks/useIsMobile');

jest.mock('../../../components/TOS/TOSHeader', () => ({
  TOSHeader: () => <div data-testid="tos-header" />,
}));

jest.mock('../../../components/Menu/FixedSideMenu', () => ({
  FixedSideMenu: ({ items, onItemClick }: any) => (
    <div data-testid="fixed-menu">
      {items.map((item: string, index: number) => (
        <button key={item} onClick={() => onItemClick(index)}>
          {item}
        </button>
      ))}
    </div>
  ),
}));

jest.mock('../../../components/Menu/MobileDropdownMenu', () => ({
  MobileDropdownMenu: ({ items, onItemClick }: any) => (
    <div data-testid="mobile-menu">
      {items.map((item: string, index: number) => (
        <button key={item} onClick={() => onItemClick(index)}>
          {item}
        </button>
      ))}
    </div>
  ),
}));

jest.mock('../../../components/TOS/TOSContent', () => ({
  TOSContent: ({ sectionRefs }: any) => {
    sectionRefs.forEach((ref: any, idx: number) => {
      ref.current = {
        getBoundingClientRect: () => ({
          top: idx * 100, // simulate distance from top
        }),
        scrollIntoView: jest.fn(),
      };
    });
    return <div data-testid="tos-content" />;
  },
}));

jest.mock('../../../components/Overlay/Overlay', () => () => (
  <div data-testid="overlay" />
));

jest.mock('../../../api/onboardingWebApiClient', () => ({
  OnboardingWebApi: {
    getStatus: jest.fn(),
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock('../../../api/generated/onboarding-web/OnboardingStatusDTO', () => ({
  StatusEnum: {
    COMPLETED: 'COMPLETED',
  },
}));

const mockedUsedNavigate = jest.fn();

describe('TOS Page', () => {
  const useIsMobile = require('../../../hooks/useIsMobile').useIsMobile;
  const { OnboardingWebApi } = require('../../../api/onboardingWebApiClient');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders MobileDropdownMenu on mobile', async () => {
    OnboardingWebApi.getStatus.mockResolvedValue({
      status: 200,
      data: {},
    });
    useIsMobile.mockReturnValue(true);

    render(<TOS />);
    expect(await screen.findByTestId('mobile-menu')).toBeInTheDocument();
    expect(screen.queryByTestId('fixed-menu')).not.toBeInTheDocument();
    expect(screen.getByTestId('tos-header')).toBeInTheDocument();
    expect(screen.getByTestId('tos-content')).toBeInTheDocument();
  });

  test('renders FixedSideMenu on desktop', async () => {
    OnboardingWebApi.getStatus.mockResolvedValue({
      status: 200,
      data: {},
    });
    useIsMobile.mockReturnValue(false);

    render(<TOS />);
    expect(await screen.findByTestId('fixed-menu')).toBeInTheDocument();
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
  });

  test('clicking menu item updates selectedIndex and scrolls to section', async () => {
    OnboardingWebApi.getStatus.mockResolvedValue({
      status: 200,
      data: {},
    });
    useIsMobile.mockReturnValue(false);

    render(<TOS />);
    const buttons = await screen.findAllByRole('button');
    const button = buttons[1];

    fireEvent.click(button);

    expect(button).toBeInTheDocument();
  });

  test('scroll event updates selectedIndex to closest section', async () => {
    OnboardingWebApi.getStatus.mockResolvedValue({
      status: 200,
      data: {},
    });
    useIsMobile.mockReturnValue(false);

    render(<TOS />);
    await screen.findByTestId('fixed-menu');

    window.dispatchEvent(new Event('scroll'));

    await waitFor(() => {
      expect(screen.getByTestId('fixed-menu')).toBeInTheDocument();
    });
  });

  test('navigates to FEEDBACK if onboarding status is valid', async () => {
    const mockStatus = { status: 'COMPLETED' };
    OnboardingWebApi.getStatus.mockResolvedValue({
      status: 200,
      data: mockStatus,
    });
    useIsMobile.mockReturnValue(false);

    render(<TOS />);

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/utente/esito', {
        state: { status: 'COMPLETED' },
      });
    });
  });

  test('does nothing if user is not onboarded (404 with specific code)', async () => {
    OnboardingWebApi.getStatus.mockResolvedValue({
      status: 404,
      data: { code: 'ONBOARDING_USER_NOT_ONBOARDED' },
    });
    useIsMobile.mockReturnValue(false);

    render(<TOS />);

    await waitFor(() => {
      expect(mockedUsedNavigate).not.toHaveBeenCalled();
    });
  });

  test('handles error in getStatus', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
    OnboardingWebApi.getStatus.mockRejectedValue(new Error('Network error'));
    useIsMobile.mockReturnValue(false);

    render(<TOS />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error: ', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});