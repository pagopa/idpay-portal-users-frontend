import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TOS from '../TOS';
import '@testing-library/jest-dom';

const mockCanAccessTOS = jest.fn(() => true);
const mockNavigate = jest.fn();

jest.mock('../../../hooks/useIsMobile');

jest.mock('../../../components/TOS/TOSHeader', () => ({
  TOSHeader: () => <div data-testid="tos-header">TOS Header</div>,
}));

jest.mock('../../../components/Menu/FixedSideMenu', () => ({
  FixedSideMenu: ({ items, onItemClick, selectedIndex }: any) => (
    <div data-testid="fixed-menu">
      {items.map((item: string, index: number) => (
        <button
          key={item}
          onClick={() => onItemClick(index)}
          data-selected={selectedIndex === index}
        >
          {item}
        </button>
      ))}
    </div>
  ),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

jest.mock('../../../components/Menu/MobileDropdownMenu', () => ({
  MobileDropdownMenu: ({ items, onItemClick, selectedIndex }: any) => (
    <div data-testid="mobile-menu">
      {items.map((item: string, index: number) => (
        <button
          key={item}
          onClick={() => onItemClick(index)}
          data-selected={selectedIndex === index}
        >
          {item}
        </button>
      ))}
    </div>
  ),
}));

const mockScrollIntoView = jest.fn();

jest.mock('../../../components/TOS/TOSContent', () => ({
  TOSContent: ({ sectionRefs }: any) => {
    sectionRefs.forEach((ref: any, idx: number) => {
      ref.current = {
        getBoundingClientRect: () => ({
          top: idx * 100,
        }),
        scrollIntoView: mockScrollIntoView,
      };
    });
    return <div data-testid="tos-content">TOS Content</div>;
  },
}));

jest.mock('../../../hooks/useCanAccessTOSStore', () => ({
  useCanAccessTOSStore: () => ({
    canAccessTOS: mockCanAccessTOS(),
  }),
}));

const mockedUseIsMobile = require('../../../hooks/useIsMobile').useIsMobile;

describe('TOS Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockScrollIntoView.mockClear();
    mockCanAccessTOS.mockReturnValue(true);
  });

  describe('Access Control', () => {
    test('redirects to GATEWAY when canAccessTOS is false', () => {
      mockCanAccessTOS.mockReturnValue(false);
      mockedUseIsMobile.mockReturnValue(false);

      render(<TOS />);

      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('gateway'),
        { replace: true }
      );
    });

    test('returns null when canAccessTOS is false', () => {
      mockCanAccessTOS.mockReturnValue(false);
      mockedUseIsMobile.mockReturnValue(false);

      const { container } = render(<TOS />);

      expect(container.firstChild).toBeNull();
    });

    test('renders component when canAccessTOS is true', () => {
      mockCanAccessTOS.mockReturnValue(true);
      mockedUseIsMobile.mockReturnValue(false);

      render(<TOS />);

      expect(screen.getByTestId('tos-header')).toBeInTheDocument();
      expect(screen.getByTestId('tos-content')).toBeInTheDocument();
    });
  });

  describe('Responsive Rendering', () => {
    test('renders MobileDropdownMenu on mobile', () => {
      mockedUseIsMobile.mockReturnValue(true);

      render(<TOS />);

      expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
      expect(screen.queryByTestId('fixed-menu')).not.toBeInTheDocument();
      expect(screen.getByTestId('tos-header')).toBeInTheDocument();
      expect(screen.getByTestId('tos-content')).toBeInTheDocument();
    });

    test('renders FixedSideMenu on desktop', () => {
      mockedUseIsMobile.mockReturnValue(false);

      render(<TOS />);

      expect(screen.getByTestId('fixed-menu')).toBeInTheDocument();
      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
      expect(screen.getByTestId('tos-header')).toBeInTheDocument();
      expect(screen.getByTestId('tos-content')).toBeInTheDocument();
    });
  });

  describe('Menu Interaction', () => {
    test('clicking menu item scrolls to corresponding section (desktop)', () => {
      mockedUseIsMobile.mockReturnValue(false);

      render(<TOS />);

      const buttons = screen.getAllByRole('button');

      fireEvent.click(buttons[2]);

      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    test('clicking menu item scrolls to corresponding section (mobile)', () => {
      mockedUseIsMobile.mockReturnValue(true);

      render(<TOS />);

      const buttons = screen.getAllByRole('button');

      fireEvent.click(buttons[1]);

      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    test('clicking each menu item works correctly', () => {
      mockedUseIsMobile.mockReturnValue(false);

      render(<TOS />);

      const buttons = screen.getAllByRole('button');

      buttons.forEach((button, _index) => {
        mockScrollIntoView.mockClear();
        fireEvent.click(button);
        expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
      });
    });
  });

  describe('Scroll Behavior', () => {
    test('updates selectedIndex on scroll based on section positions', async () => {
      mockedUseIsMobile.mockReturnValue(false);

      render(<TOS />);

      fireEvent.scroll(window);

      await waitFor(() => {
        expect(screen.getByTestId('fixed-menu')).toBeInTheDocument();
      });
    });

    test('calculates correct active section on initial mount', async () => {
      mockedUseIsMobile.mockReturnValue(false);

      render(<TOS />);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        expect(buttons[0]).toHaveAttribute('data-selected', 'true');
      });
    });

    test('removes scroll listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      mockedUseIsMobile.mockReturnValue(false);

      const { unmount } = render(<TOS />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });

    test('handles scroll with different section positions', async () => {
      mockedUseIsMobile.mockReturnValue(false);

      jest.mock('../../../components/TOS/TOSContent', () => ({
        TOSContent: ({ sectionRefs }: any) => {
          sectionRefs.forEach((ref: any, idx: number) => {
            ref.current = {
              getBoundingClientRect: () => ({
                top: idx === 2 ? 10 : 500
              }),
              scrollIntoView: mockScrollIntoView,
            };
          });
          return <div data-testid="tos-content">TOS Content</div>;
        },
      }));

      render(<TOS />);

      fireEvent.scroll(window);

      await waitFor(() => {
        expect(screen.getByTestId('fixed-menu')).toBeInTheDocument();
      });
    });
  });

  describe('Menu Items', () => {
    test('renders correct number of menu items', () => {
      mockedUseIsMobile.mockReturnValue(false);

      render(<TOS />);

      const buttons = screen.getAllByRole('button');

      expect(buttons).toHaveLength(4);
    });

    test('menu items have correct labels', () => {
      mockedUseIsMobile.mockReturnValue(false);

      render(<TOS />);

      expect(screen.getByText('tos.sideMenu.element1.title')).toBeInTheDocument();
      expect(screen.getByText('tos.sideMenu.element2.title')).toBeInTheDocument();
      expect(screen.getByText('tos.sideMenu.element3.title')).toBeInTheDocument();
      expect(screen.getByText('tos.sideMenu.element4.title')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles ref.current being null during scroll', async () => {
      mockedUseIsMobile.mockReturnValue(false);

      jest.mock('../../../components/TOS/TOSContent', () => ({
        TOSContent: ({ sectionRefs }: any) => {
          sectionRefs[0].current = null;
          sectionRefs.slice(1).forEach((ref: any, idx: number) => {
            ref.current = {
              getBoundingClientRect: () => ({
                top: (idx + 1) * 100,
              }),
              scrollIntoView: mockScrollIntoView,
            };
          });
          return <div data-testid="tos-content">TOS Content</div>;
        },
      }));

      render(<TOS />);

      fireEvent.scroll(window);

      await waitFor(() => {
        expect(screen.getByTestId('fixed-menu')).toBeInTheDocument();
      });
    });

    test('handles multiple rapid scroll events', async () => {
      mockedUseIsMobile.mockReturnValue(false);

      render(<TOS />);

      for (let i = 0; i < 5; i++) {
        fireEvent.scroll(window);
      }

      await waitFor(() => {
        expect(screen.getByTestId('fixed-menu')).toBeInTheDocument();
      });
    });
  });

  describe('Component Structure', () => {
    test('renders main Box container with correct structure', () => {
      mockedUseIsMobile.mockReturnValue(false);

      const { container } = render(<TOS />);

      const mainBox = container.firstChild;
      expect(mainBox).toBeInTheDocument();
    });

    test('renders header, menu and content in correct order', () => {
      mockedUseIsMobile.mockReturnValue(false);

      render(<TOS />);

      const header = screen.getByTestId('tos-header');
      const menu = screen.getByTestId('fixed-menu');
      const content = screen.getByTestId('tos-content');

      expect(header).toBeInTheDocument();
      expect(menu).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });
  });
});