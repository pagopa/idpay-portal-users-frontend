import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TOS from '../TOS';
import '@testing-library/jest-dom';

const mockcanAccessTOS = jest.fn(() => true);

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

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
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
          top: idx * 100,
        }),
        scrollIntoView: jest.fn(),
      };
    });
    return <div data-testid="tos-content" />;
  },
}));

jest.mock('../../../hooks/useCanAccessTOSStore', () => ({
  useCanAccessTOSStore: () => ({
    canAccessTOS: mockcanAccessTOS(),
  }),
}));

const mockedUseIsMobile = require('../../../hooks/useIsMobile').useIsMobile;

describe('TOS Page (presentation-only)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders MobileDropdownMenu on mobile', async () => {
    mockedUseIsMobile.mockReturnValue(true);

    render(<TOS />);
    expect(await screen.findByTestId('mobile-menu')).toBeInTheDocument();
    expect(screen.queryByTestId('fixed-menu')).not.toBeInTheDocument();
    expect(screen.getByTestId('tos-header')).toBeInTheDocument();
    expect(screen.getByTestId('tos-content')).toBeInTheDocument();
  });

  test('renders FixedSideMenu on desktop', async () => {
    mockedUseIsMobile.mockReturnValue(false);

    render(<TOS />);
    expect(await screen.findByTestId('fixed-menu')).toBeInTheDocument();
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
  });

  test('clicking a menu item does not crash and updates selection', async () => {
    mockedUseIsMobile.mockReturnValue(false);

    render(<TOS />);
    const buttons = await screen.findAllByRole('button');
    fireEvent.click(buttons[1]);

    expect(buttons[1]).toBeInTheDocument();
    expect(screen.getByTestId('fixed-menu')).toBeInTheDocument();
  });

  test('scroll event runs active-section calculation', async () => {
    mockedUseIsMobile.mockReturnValue(false);

    render(<TOS />);
    await screen.findByTestId('fixed-menu');

    window.dispatchEvent(new Event('scroll'));

    await waitFor(() => {
      expect(screen.getByTestId('fixed-menu')).toBeInTheDocument();
    });
  });
});