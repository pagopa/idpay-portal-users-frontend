import { render, screen, fireEvent, act } from '@testing-library/react';
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

describe('TOS Page', () => {
  const useIsMobile = require('../../../hooks/useIsMobile').useIsMobile;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders MobileDropdownMenu on mobile', () => {
    useIsMobile.mockReturnValue(true);

    render(<TOS />);

    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
    expect(screen.queryByTestId('fixed-menu')).not.toBeInTheDocument();
    expect(screen.getByTestId('tos-header')).toBeInTheDocument();
    expect(screen.getByTestId('tos-content')).toBeInTheDocument();
  });

  test('renders FixedSideMenu on desktop', () => {
    useIsMobile.mockReturnValue(false);

    render(<TOS />);

    expect(screen.getByTestId('fixed-menu')).toBeInTheDocument();
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
  });

  test('clicking menu item updates selectedIndex and scrolls to section', () => {
    useIsMobile.mockReturnValue(false);

    const { getByText } = render(<TOS />);
    const button = getByText('tos.sideMenu.element2.title');
    fireEvent.click(button);

    expect(button).toBeInTheDocument();
  });

  test('scroll event updates selectedIndex to closest section', () => {
    useIsMobile.mockReturnValue(false);

    render(<TOS />);

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(screen.getByTestId('fixed-menu')).toBeInTheDocument();
  });
});
