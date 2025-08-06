import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../Sidebar';

describe('Sidebar', () => {
    it('shows text when expanded', () => {
        render(<Sidebar collapsed={false} toggleSidebar={jest.fn()} />);
        expect(screen.getByText('Panoramica')).toBeInTheDocument();
    });

    it('hides text when collapsed', () => {
        render(<Sidebar collapsed={true} toggleSidebar={jest.fn()} />);
        expect(screen.queryByText('Panoramica')).not.toBeInTheDocument();
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
        const listItem = screen.getByRole('button', { name: /Panoramica/i });
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
