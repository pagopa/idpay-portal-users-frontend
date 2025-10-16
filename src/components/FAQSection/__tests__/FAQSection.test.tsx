import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import FAQSection from '../FAQSection';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key
    })
}));

describe('FAQSection', () => {
    test('renders the FAQ title', () => {
        render(<FAQSection />);

        expect(screen.getByText('FAQSection.title')).toBeInTheDocument();
    });

    test('renders all three accordion sections', () => {
        render(<FAQSection />);

        expect(screen.getByText('FAQSection.firstAccordion.title')).toBeInTheDocument();
        expect(screen.getByText('FAQSection.secondAccordion.title')).toBeInTheDocument();
        expect(screen.getByText('FAQSection.thirdAccordion.title')).toBeInTheDocument();
    });

    test('expands first accordion when clicked', async () => {
        const user = userEvent.setup();
        render(<FAQSection />);

        const firstAccordionButton = screen.getByText('FAQSection.firstAccordion.title').closest('button');

        expect(firstAccordionButton).toBeInTheDocument();

        await user.click(firstAccordionButton!);

        await waitFor(() => {
            const firstDescription = screen.getByText('FAQSection.firstAccordion.description');
            expect(firstDescription).toBeVisible();
        });
    });

    test('expands second accordion when clicked', async () => {
        const user = userEvent.setup();
        render(<FAQSection />);

        const secondAccordionButton = screen.getByText('FAQSection.secondAccordion.title').closest('button');

        expect(secondAccordionButton).toBeInTheDocument();

        await user.click(secondAccordionButton!);

        await waitFor(() => {
            const secondDescription = screen.getByText('FAQSection.secondAccordion.description');
            expect(secondDescription).toBeVisible();
        });
    });

    test('expands third accordion when clicked', async () => {
        const user = userEvent.setup();
        render(<FAQSection />);

        const thirdAccordionButton = screen.getByText('FAQSection.thirdAccordion.title').closest('button');

        expect(thirdAccordionButton).toBeInTheDocument();

        await user.click(thirdAccordionButton!);

        await waitFor(() => {
            const thirdDescription = screen.getByText('FAQSection.thirdAccordion.description');
            expect(thirdDescription).toBeVisible();
        });
    });

    test('multiple accordions can be open at the same time', async () => {
        const user = userEvent.setup();
        render(<FAQSection />);

        const firstAccordionButton = screen.getByText('FAQSection.firstAccordion.title').closest('button');
        await user.click(firstAccordionButton!);

        await waitFor(() => {
            expect(screen.getByText('FAQSection.firstAccordion.description')).toBeVisible();
        });

        const secondAccordionButton = screen.getByText('FAQSection.secondAccordion.title').closest('button');
        await user.click(secondAccordionButton!);

        await waitFor(() => {
            expect(screen.getByText('FAQSection.secondAccordion.description')).toBeVisible();
        });

        expect(screen.getByText('FAQSection.firstAccordion.description')).toBeVisible();

        const thirdAccordionButton = screen.getByText('FAQSection.thirdAccordion.title').closest('button');
        await user.click(thirdAccordionButton!);

        await waitFor(() => {
            expect(screen.getByText('FAQSection.thirdAccordion.description')).toBeVisible();
        });

        expect(screen.getByText('FAQSection.firstAccordion.description')).toBeVisible();
        expect(screen.getByText('FAQSection.secondAccordion.description')).toBeVisible();
        expect(screen.getByText('FAQSection.thirdAccordion.description')).toBeVisible();
    });
});