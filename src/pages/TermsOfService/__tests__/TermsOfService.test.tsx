import { render, screen, waitFor } from '@testing-library/react';
import TOS from '../TermsOfService';

jest.mock('../../../components/PrivacyAndTosLayout/PrivacyAndTosLayout', () => ({
    PrivacyAndTosLayout: ({ text }: { text: string }) => <div data-testid="layout">{text}</div>,
}));

describe('TOS', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders without crashing and fetches TOS HTML', async () => {
        const mockHtml = '<h1>Terms of Service</h1>';

        global.fetch = jest.fn(() =>
            Promise.resolve({
                text: () => Promise.resolve(mockHtml),
            } as unknown as Response)
        ) as jest.Mock;

        render(<TOS />);

        expect(global.fetch).toHaveBeenCalledWith('/utente/tos.html');

        await waitFor(() => {
            expect(screen.getByTestId('layout')).toHaveTextContent(mockHtml);
        });
    });

    it('renders with empty text before fetch completes', () => {
        global.fetch = jest.fn(() => new Promise(() => { })) as jest.Mock;

        render(<TOS />);
        expect(screen.getByTestId('layout')).toHaveTextContent('');
    });
});