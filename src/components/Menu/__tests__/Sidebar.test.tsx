import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../Sidebar';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

describe('Sidebar', () => {
  const mockToggleSidebar = jest.fn();
  const mockOnSectionChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders text when expanded', () => {
    render(
      <Sidebar
        collapsed={false}
        toggleSidebar={mockToggleSidebar}
        onSectionChange={mockOnSectionChange}
      />
    );

    expect(screen.getByText('dashboard.title')).toBeInTheDocument();
    expect(screen.getByText('dashboard.faq')).toBeInTheDocument();
  });

  it('renders hidden text when collapsed (opacity 0)', () => {
    render(
      <Sidebar
        collapsed={true}
        toggleSidebar={mockToggleSidebar}
        onSectionChange={mockOnSectionChange}
      />
    );

    expect(screen.queryByText('dashboard.title')).not.toBeInTheDocument();
  });

  it('calls toggleSidebar when icon button is clicked', () => {
    render(
      <Sidebar
        collapsed={false}
        toggleSidebar={mockToggleSidebar}
        onSectionChange={mockOnSectionChange}
      />
    );

    const toggleButton = screen.getAllByRole('button').pop()!;
    fireEvent.click(toggleButton);
    expect(mockToggleSidebar).toHaveBeenCalledTimes(1);
  });

  it('calls onSectionChange when a menu item is clicked', () => {
    render(
      <Sidebar
        collapsed={false}
        toggleSidebar={mockToggleSidebar}
        onSectionChange={mockOnSectionChange}
      />
    );

    const listItems = screen.getAllByRole('button');
    const bonusItem = listItems[0];
    const faqItem = listItems[1];

    fireEvent.click(bonusItem);
    expect(mockOnSectionChange).toHaveBeenCalledWith('bonus');

    fireEvent.click(faqItem);
    expect(mockOnSectionChange).toHaveBeenCalledWith('faq');
  });

  it('changes selected state when a list item is clicked', () => {
    render(
      <Sidebar
        collapsed={false}
        toggleSidebar={mockToggleSidebar}
        onSectionChange={mockOnSectionChange}
      />
    );

    const listButtons = screen.getAllByRole('button');
    const firstItem = listButtons[0];
    fireEvent.click(firstItem);
    expect(firstItem.className).toMatch(/Mui-selected/);
  });
});