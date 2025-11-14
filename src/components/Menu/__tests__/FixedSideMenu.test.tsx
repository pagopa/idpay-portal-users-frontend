import { render, screen, fireEvent } from '@testing-library/react';
import { FixedSideMenu } from '../FixedSideMenu';
import '@testing-library/jest-dom';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('FixedSideMenu', () => {
    const items = [
        'tos.sideMenu.element1.title',
        'tos.sideMenu.element2.title',
        'tos.sideMenu.element3.title',
    ];

    test('renders all items', () => {
        render(
            <FixedSideMenu
                selectedIndex={0}
                onItemClick={jest.fn()}
                items={items}
            />
        );

        items.forEach(item => {
            expect(screen.getByText(item)).toBeInTheDocument();
        });
    });

    test('highlights the selected item', () => {
        render(
            <FixedSideMenu
                selectedIndex={1}
                onItemClick={jest.fn()}
                items={items}
            />
        );

        const selectedItem = screen.getByText(items[1]).parentElement?.parentElement;
        expect(selectedItem).toHaveClass('Mui-selected');
    });

    test('calls onItemClick when an item is clicked', () => {
        const onItemClickMock = jest.fn();

        render(
            <FixedSideMenu
                selectedIndex={0}
                onItemClick={onItemClickMock}
                items={items}
            />
        );

        const secondItem = screen.getByText(items[1]);
        fireEvent.click(secondItem);

        expect(onItemClickMock).toHaveBeenCalledWith(1);
    });
});