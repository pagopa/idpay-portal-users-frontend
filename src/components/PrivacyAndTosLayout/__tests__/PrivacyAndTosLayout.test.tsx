import { render, screen } from '@testing-library/react';
import { PrivacyAndTosLayout } from '../PrivacyAndTosLayout';
import DOMPurify from 'dompurify';

jest.mock('dompurify', () => ({
    __esModule: true,
    default: {
        sanitize: jest.fn((input) => input),
    },
}));

describe('PrivacyAndTosLayout', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders sanitized HTML content', () => {
        const mockHtml = '<p>Hello Privacy!</p>';
        render(<PrivacyAndTosLayout text={mockHtml} />);

        expect(DOMPurify.sanitize).toHaveBeenCalledWith(mockHtml);

        const contentDiv = screen.getByText('Hello Privacy!');
        expect(contentDiv).toBeInTheDocument();
        expect(contentDiv.closest('.content')).not.toBeNull();
    });

    it('sanitizes malicious HTML', () => {
        const maliciousHtml = '<img src="x" onerror="alert(1)" />';
        const safeHtml = '<img src="x" />';

        (DOMPurify.sanitize as jest.Mock).mockReturnValueOnce(safeHtml);

        render(<PrivacyAndTosLayout text={maliciousHtml} />);

        expect(DOMPurify.sanitize).toHaveBeenCalledWith(maliciousHtml);

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'x');
        expect(img).not.toHaveAttribute('onerror');
    });

    it('renders empty content safely when text is empty', () => {
        render(<PrivacyAndTosLayout text="" />);
        expect(DOMPurify.sanitize).toHaveBeenCalledWith('');

        const content = document.querySelector('.content');
        expect(content).toBeInTheDocument();
        expect(content?.innerHTML).toBe('');
    });
});