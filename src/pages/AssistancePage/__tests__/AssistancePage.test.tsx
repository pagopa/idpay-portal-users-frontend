import { render, screen } from '@testing-library/react';
import AssistancePage from '../AssistancePage';
import '@testing-library/jest-dom'

const mockGetInitiative = jest.fn(() => 'bonusvalore');

jest.mock('../../../utils/env', () => ({ getInitiative: () => mockGetInitiative() }));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'assistance.title': 'Richiedi assistenza',
                'common.bonusNotFound.assistanceTitle': 'Hai bisogno di aiuto?',
                'assistance.subtitle': 'Compila il modulo per contattarci',
            };
            return translations[key] || key;
        },
    }),
}));

jest.mock('../assistanceEmailForm', () => jest.fn(() => <div data-testid="email-form" />));

describe('AssistancePage', () => {
    it('uses the generic title only for bonusnotfound', () => {
        mockGetInitiative.mockReturnValueOnce('bonusnotfound');

        render(<AssistancePage />);

        expect(screen.getByText('Hai bisogno di aiuto?')).toBeInTheDocument();
        expect(screen.getByText('Compila il modulo per contattarci')).toBeInTheDocument();
        expect(screen.getByTestId('email-form')).toBeInTheDocument();
    });

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
