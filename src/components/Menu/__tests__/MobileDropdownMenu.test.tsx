import { render, screen, fireEvent } from '@testing-library/react';
import { MobileDropdownMenu } from '../MobileDropdownMenu';
import '@testing-library/jest-dom';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('MobileDropdownMenu', () => {
    const items = [
        'tos.sideMenu.element1.title',
        'tos.sideMenu.element2.title',
        'tos.sideMenu.element3.title',
    ];

    test('renders menu button and not the dropdown initially', () => {
        render(
            <MobileDropdownMenu
                selectedIndex={0}
                onItemClick={jest.fn()}
                items={items}
            />
        );

        expect(screen.getByText('Menu')).toBeInTheDocument();
        expect(screen.queryByTestId('menu-list')).not.toBeInTheDocument();
    });

    test('opens dropdown when Menu is clicked', () => {
        render(
            <MobileDropdownMenu
                selectedIndex={0}
                onItemClick={jest.fn()}
                items={items}
            />
        );

        fireEvent.click(screen.getByText('Menu'));
        expect(screen.getByTestId('menu-list')).toBeInTheDocument();
        expect(screen.getByText(items[0])).toBeInTheDocument();
    });

    test('closes dropdown when Close icon is clicked', () => {
        render(
            <MobileDropdownMenu
                selectedIndex={0}
                onItemClick={jest.fn()}
                items={items}
            />
        );

        fireEvent.click(screen.getByText('Menu'));

        const closeButton = screen.getByTestId('CloseIcon').closest('button');
        fireEvent.click(closeButton!);

        expect(screen.queryByTestId('menu-list')).not.toBeInTheDocument();
    });

    test('calls onItemClick and closes menu when item is clicked', () => {
        const onItemClickMock = jest.fn();

        render(
            <MobileDropdownMenu
                selectedIndex={1}
                onItemClick={onItemClickMock}
                items={items}
            />
        );

        fireEvent.click(screen.getByText('Menu'));
        const secondItem = screen.getByText(items[1]);
        fireEvent.click(secondItem);

        expect(onItemClickMock).toHaveBeenCalledWith(1);
        expect(screen.queryByTestId('menu-list')).not.toBeInTheDocument();
    });

    test('applies selected style to the selected index', () => {
        render(
            <MobileDropdownMenu
                selectedIndex={2}
                onItemClick={jest.fn()}
                items={items}
            />
        );

        fireEvent.click(screen.getByText('Menu'));

        const selectedItem = screen.getByTestId('menu-item-2');
        expect(selectedItem).toHaveClass('Mui-selected');
    });
});