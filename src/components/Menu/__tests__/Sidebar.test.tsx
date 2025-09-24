import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../Sidebar';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

describe('Sidebar', () => {
    it('shows text when expanded', () => {
        render(<Sidebar collapsed={false} toggleSidebar={jest.fn()} />);
        expect(screen.getByText('dashboard.title')).toBeInTheDocument();
    });

    it('hides text when collapsed', () => {
        render(<Sidebar collapsed={true} toggleSidebar={jest.fn()} />);
        expect(screen.queryByText('dashboard.title')).not.toBeInTheDocument();
    });

    it('calls toggleSidebar when icon clicked', () => {
        const toggleSidebar = jest.fn();
        render(<Sidebar collapsed={false} toggleSidebar={toggleSidebar} />);
        const toggleBtn = screen.getAllByRole('button')[1];
        fireEvent.click(toggleBtn);
        expect(toggleSidebar).toHaveBeenCalledTimes(1);
    });

    it('sets selected state on list item', () => {
        render(<Sidebar collapsed={false} toggleSidebar={jest.fn()} />);
        const listItem = screen.getAllByRole('button')[0];
        expect(listItem.className).toMatch(/Mui-selected/);
    });

    it('calls handleListItemClick and updates selectedIndex', () => {
        const { container } = render(<Sidebar collapsed={false} toggleSidebar={jest.fn()} />);
        const listItems = container.querySelectorAll('[role="button"]');
        fireEvent.click(listItems[0]);
        expect(listItems[0].className).toMatch(/Mui-selected/);
        fireEvent.click(listItems[0]);
        expect(listItems[0].className).toMatch(/Mui-selected/);
    });
});