import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import FAQSection from '../FAQSection';

jest.mock('../../../utils/env', () => ({
    getBaseUrl: () => 'https://www.google.com'
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('FAQSection', () => {
    const user = userEvent.setup();

    test('renders the FAQ title', () => {
        render(<FAQSection />);
        expect(screen.getByText('FAQSection.title')).toBeInTheDocument();
    });

    test('renders all 11 accordion sections', () => {
        render(<FAQSection />);

        const accordionKeys = [
            'firstAccordion',
            'secondAccordion',
            'thirdAccordion',
            'fourthAccordion',
            'fifthAccordion',
            'sixthAccordion',
            'seventhAccordion',
            'eighthAccordion',
            'ninthAccordion',
            'tenthAccordion',
            'eleventhAccordion',
        ];

        accordionKeys.forEach((key) => {
            expect(screen.getByText(`FAQSection.${key}.title`)).toBeInTheDocument();
        });
    });

    test('expands and shows description for a single accordion', async () => {
        render(<FAQSection />);

        const firstAccordionButton = screen
            .getByText('FAQSection.firstAccordion.title')
            .closest('button');

        expect(firstAccordionButton).toBeInTheDocument();

        await user.click(firstAccordionButton!);

        await waitFor(() => {
            const desc = screen.getByText('FAQSection.firstAccordion.description');
            expect(desc).toBeVisible();
        });
    });

    test('expands multiple accordions independently', async () => {
        render(<FAQSection />);

        const keys = ['firstAccordion', 'secondAccordion', 'thirdAccordion'];

        for (const key of keys) {
            const button = screen.getByText(`FAQSection.${key}.title`).closest('button');
            expect(button).toBeInTheDocument();
            await user.click(button!);
        }

        await waitFor(() => {
            keys.forEach((key) => {
                const desc = screen.getByText(`FAQSection.${key}.description`);
                expect(desc).toBeVisible();
            });
        });
    });

    test('renders link elements in accordions that have them', async () => {
        jest.mocked(require('react-i18next')).useTranslation = () => ({
            t: (key: string) => {
                if (key === 'FAQSection.thirdAccordion.description') {
                    return 'Puoi acquistare... come previsto dal Decreto interministeriale. Puoi consultare in questa lista.';
                }
                return key;
            },
        });

        const { unmount } = render(<FAQSection />);

        const thirdAccordionButton = screen
            .getByText('FAQSection.thirdAccordion.title')
            .closest('button');
        await user.click(thirdAccordionButton!);

        await waitFor(() => {
            const links = screen.getAllByRole('link');
            expect(links.length).toBe(2);
            links.forEach((link) => {
                expect(link).toHaveAttribute('target', '_blank');
                expect(link).toHaveAttribute('rel', 'noopener noreferrer');
            });
        });

        unmount();
    });
});
