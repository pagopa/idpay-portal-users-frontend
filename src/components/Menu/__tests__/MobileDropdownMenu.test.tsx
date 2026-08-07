import { render, screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import { MobileDropdownMenu } from '../MobileDropdownMenu';
import '@testing-library/jest-dom';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('MobileDropdownMenu (Drawer-based)', () => {
  const items = [
    'tos.sideMenu.element1.title',
    'tos.sideMenu.element2.title',
    'tos.sideMenu.element3.title',
  ];

  test('renders menu button and not the drawer initially', () => {
    render(<MobileDropdownMenu selectedIndex={0} onItemClick={jest.fn()} items={items} />);

    expect(screen.getByText('common.dashboard.menu')).toBeInTheDocument();
    expect(screen.queryByTestId('menu-list')).not.toBeInTheDocument();
  });

  test('opens drawer when Menu is clicked', () => {
    render(<MobileDropdownMenu selectedIndex={0} onItemClick={jest.fn()} items={items} />);

    fireEvent.click(screen.getByText('common.dashboard.menu'));
    expect(screen.getByTestId('menu-list')).toBeInTheDocument();
    expect(screen.getByText(items[0])).toBeInTheDocument();
  });

  test('closes drawer when Close icon is clicked', async () => {
    render(<MobileDropdownMenu selectedIndex={0} onItemClick={jest.fn()} items={items} />);

    fireEvent.click(screen.getByText('common.dashboard.menu'));

    const closeButton = screen.getByRole('button', { name: '' });
    fireEvent.click(closeButton);

    await waitForElementToBeRemoved(() => screen.queryByTestId('menu-list'));
  });

  test('calls onItemClick and closes drawer when item is clicked', async () => {
    const onItemClickMock = jest.fn();

    render(<MobileDropdownMenu selectedIndex={1} onItemClick={onItemClickMock} items={items} />);

    fireEvent.click(screen.getByText('common.dashboard.menu'));
    fireEvent.click(screen.getByText(items[1]));

    expect(onItemClickMock).toHaveBeenCalledWith(1);
    await waitForElementToBeRemoved(() => screen.queryByTestId('menu-list'));
  });

  test('applies selected style to the selected index', () => {
    render(<MobileDropdownMenu selectedIndex={2} onItemClick={jest.fn()} items={items} />);

    fireEvent.click(screen.getByText('common.dashboard.menu'));

    const selectedItem = screen.getByTestId('menu-item-2');
    expect(selectedItem).toHaveClass('Mui-selected');
  });
});
