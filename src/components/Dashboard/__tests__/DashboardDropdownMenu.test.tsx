import { render, screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardDropdownMenu from '../DashboardDropdownMenu';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('DashboardDropdownMenu', () => {
    const onSectionChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the Menu button', () => {
        render(<DashboardDropdownMenu selectedSection="bonus" onSectionChange={onSectionChange} />);
        expect(screen.getByText('dashboard.menu')).toBeInTheDocument();
    });

    it('opens the drawer when Menu button is clicked', () => {
        render(<DashboardDropdownMenu selectedSection="bonus" onSectionChange={onSectionChange} />);
        fireEvent.click(screen.getByText('dashboard.menu'));
        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });

    it('calls onSectionChange when an item is clicked', () => {
        render(<DashboardDropdownMenu selectedSection="bonus" onSectionChange={onSectionChange} />);
        fireEvent.click(screen.getByText('dashboard.menu'));
        fireEvent.click(screen.getByText('dashboard.faq'));
        expect(onSectionChange).toHaveBeenCalledWith('faq');
    });

    it('closes the drawer when close icon is clicked', async () => {
        render(<DashboardDropdownMenu selectedSection="bonus" onSectionChange={onSectionChange} />);
        fireEvent.click(screen.getByText('dashboard.menu'));
        const closeBtn = screen.getAllByRole('button')[1];
        fireEvent.click(closeBtn);

        await waitForElementToBeRemoved(() => screen.queryByText('dashboard.faq'));
    });
});
