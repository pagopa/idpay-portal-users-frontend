import { render, screen, waitFor } from '@testing-library/react';
import PrivacyPolicy from '../PrivacyPolicy';

jest.mock('../../../components/PrivacyAndTosLayout/PrivacyAndTosLayout', () => ({
    PrivacyAndTosLayout: ({ text }: { text: string }) => <div data-testid="layout">{text}</div>,
}));

describe('PrivacyPolicy', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders without crashing and fetches privacy policy HTML', async () => {
        const mockHtml = '<h1>Privacy Policy</h1>';

        global.fetch = jest.fn(() =>
            Promise.resolve({
                text: () => Promise.resolve(mockHtml),
            } as unknown as Response)
        ) as jest.Mock;

        render(<PrivacyPolicy />);

        expect(global.fetch).toHaveBeenCalledWith('/utente/privacyPolicy.html');

        await waitFor(() => {
            expect(screen.getByTestId('layout')).toHaveTextContent(mockHtml);
        });
    });

    it('renders with empty text before fetch completes', () => {
        global.fetch = jest.fn(() => new Promise(() => { })) as jest.Mock;

        render(<PrivacyPolicy />);
        expect(screen.getByTestId('layout')).toHaveTextContent('');
    });
});