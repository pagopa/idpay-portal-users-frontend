import { render, screen } from '@testing-library/react';
import AssistancePage from '../AssistancePage';
import '@testing-library/jest-dom'

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'assistance.title': 'Richiedi assistenza',
                'assistance.subtitle': 'Compila il modulo per contattarci',
            };
            return translations[key] || key;
        },
    }),
}));

jest.mock('../assistanceEmailForm', () => jest.fn(() => <div data-testid="email-form" />));

describe('AssistancePage', () => {
    it('renders title, subtitle, and email form correctly', () => {
        render(<AssistancePage />);

        expect(screen.getByText('Richiedi assistenza')).toBeInTheDocument();
        expect(screen.getByText('Compila il modulo per contattarci')).toBeInTheDocument();

        expect(screen.getByTestId('email-form')).toBeInTheDocument();
    });

    it('applies correct layout structure', () => {
        render(<AssistancePage />);

        const mainBox = screen.getByText('Richiedi assistenza').closest('div');
        expect(mainBox).toBeInTheDocument();

        expect(mainBox).toHaveStyle('display: flex');
    });
});
