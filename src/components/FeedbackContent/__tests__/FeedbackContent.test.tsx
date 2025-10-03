import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FeedbackContent from '../FeedbackContent';
import ROUTES from '../../../routes';
import '@testing-library/jest-dom';

const mockLogout = jest.fn();
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}));

const { useAuth } = require('../../../contexts/AuthContext');

describe('FeedbackContent Component', () => {
    const defaultProps = {
        icon: <div data-testid="test-icon">ICON</div>,
        title: 'Test Title',
        description: 'Line 1\nLine 2',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useAuth.mockReturnValue({
            logout: mockLogout,
            isAuthenticated: false,
            loading: false,
            getToken: jest.fn().mockResolvedValue(null),
            initAuth: jest.fn(),
            login: jest.fn()
        });
    });

    describe('Basic Rendering', () => {
        test('renders icon correctly', () => {
            render(<FeedbackContent {...defaultProps} />, { wrapper: MemoryRouter });

            expect(screen.getByTestId('test-icon')).toBeInTheDocument();
            expect(screen.getByText('ICON')).toBeInTheDocument();
        });

        test('renders single-line title', () => {
            render(
                <FeedbackContent {...defaultProps} title="Single Title" />,
                { wrapper: MemoryRouter }
            );

            expect(screen.getByText('Single Title')).toBeInTheDocument();
        });

        test('renders multi-line title when passed with actual newlines', () => {
            const multiLineTitle = "Title Line 1\nTitle Line 2";

            render(
                <FeedbackContent {...defaultProps} title={multiLineTitle} />,
                { wrapper: MemoryRouter }
            );

            const titleElements = screen.getAllByText(/Title Line/);
            expect(titleElements.length).toBeGreaterThan(0);
        });

        test('renders single-line description', () => {
            render(
                <FeedbackContent {...defaultProps} description="Single line description" />,
                { wrapper: MemoryRouter }
            );

            expect(screen.getByText('Single line description')).toBeInTheDocument();
        });

        test('renders multi-line description with newlines', () => {
            render(<FeedbackContent {...defaultProps} />, { wrapper: MemoryRouter });

            expect(screen.getByText('Line 1')).toBeInTheDocument();
            expect(screen.getByText('Line 2')).toBeInTheDocument();
        });

        test('description with string literal newlines is not split', () => {

            render(
                <FeedbackContent
                    {...defaultProps}
                    description="Line 1\nLine 2\nLine 3\nLine 4"
                    title="Single Title"
                />,
                { wrapper: MemoryRouter }
            );

            expect(screen.getByTestId('test-icon')).toBeInTheDocument();
        });
    });

    describe('Button Rendering', () => {
        test('renders button when both buttonLabel and buttonRedirect are provided', () => {
            render(
                <FeedbackContent
                    {...defaultProps}
                    buttonLabel="Go Home"
                    buttonRedirect="/home"
                />,
                { wrapper: MemoryRouter }
            );

            const button = screen.getByRole('link', { name: 'Go Home' });
            expect(button).toBeInTheDocument();
            expect(button).toHaveAttribute('href', '/home');
        });

        test('does not render button when buttonLabel is missing', () => {
            render(
                <FeedbackContent
                    {...defaultProps}
                    buttonRedirect="/home"
                />,
                { wrapper: MemoryRouter }
            );

            expect(screen.queryByRole('button')).not.toBeInTheDocument();
            expect(screen.queryByRole('link')).not.toBeInTheDocument();
        });

        test('does not render button when buttonRedirect is missing', () => {
            render(
                <FeedbackContent
                    {...defaultProps}
                    buttonLabel="Go Home"
                />,
                { wrapper: MemoryRouter }
            );

            expect(screen.queryByRole('button')).not.toBeInTheDocument();
            expect(screen.queryByRole('link')).not.toBeInTheDocument();
        });

        test('does not render button when both buttonLabel and buttonRedirect are missing', () => {
            render(<FeedbackContent {...defaultProps} />, { wrapper: MemoryRouter });

            expect(screen.queryByRole('button')).not.toBeInTheDocument();
            expect(screen.queryByRole('link')).not.toBeInTheDocument();
        });

        test('renders button as RouterLink for normal redirect', () => {
            render(
                <FeedbackContent
                    {...defaultProps}
                    buttonLabel="Navigate"
                    buttonRedirect="/some-page"
                />,
                { wrapper: MemoryRouter }
            );

            const button = screen.getByRole('link', { name: 'Navigate' });
            expect(button).toHaveAttribute('href', '/some-page');
        });

        test('renders button as HTML button for __LOGOUT__', () => {
            render(
                <FeedbackContent
                    {...defaultProps}
                    buttonLabel="Logout"
                    buttonRedirect="__LOGOUT__"
                />,
                { wrapper: MemoryRouter }
            );

            const button = screen.getByRole('button', { name: 'Logout' });
            expect(button).toBeInTheDocument();
            expect(button.tagName).toBe('BUTTON');
        });
    });

    describe('Support Link Rendering', () => {
        test('renders support link when both supportLinkLabel and supportLinkUrl are provided', () => {
            render(
                <FeedbackContent
                    {...defaultProps}
                    supportLinkLabel="Need Help?"
                    supportLinkUrl="/support"
                />,
                { wrapper: MemoryRouter }
            );

            const link = screen.getByRole('link', { name: 'Need Help?' });
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute('href', '/support');
        });

        test('does not render support link when supportLinkLabel is missing', () => {
            render(
                <FeedbackContent
                    {...defaultProps}
                    supportLinkUrl="/support"
                />,
                { wrapper: MemoryRouter }
            );

            expect(screen.queryByRole('link')).not.toBeInTheDocument();
        });

        test('does not render support link when supportLinkUrl is missing', () => {
            render(
                <FeedbackContent
                    {...defaultProps}
                    supportLinkLabel="Need Help?"
                />,
                { wrapper: MemoryRouter }
            );

            expect(screen.queryByRole('link')).not.toBeInTheDocument();
        });

        test('does not render support link when both are missing', () => {
            render(<FeedbackContent {...defaultProps} />, { wrapper: MemoryRouter });

            expect(screen.queryByRole('link')).not.toBeInTheDocument();
        });
    });

    describe('Button and Support Link Together', () => {
        test('renders both button and support link when all props are provided', () => {
            render(
                <FeedbackContent
                    {...defaultProps}
                    buttonLabel="Continue"
                    buttonRedirect="/next"
                    supportLinkLabel="Help"
                    supportLinkUrl="/help"
                />,
                { wrapper: MemoryRouter }
            );

            expect(screen.getByRole('link', { name: 'Continue' })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'Help' })).toBeInTheDocument();
        });

        test('applies correct spacing when support link is present', () => {
            render(
                <FeedbackContent
                    {...defaultProps}
                    buttonLabel="Continue"
                    buttonRedirect="/next"
                    supportLinkLabel="Help"
                    supportLinkUrl="/help"
                />,
                { wrapper: MemoryRouter }
            );

            const button = screen.getByRole('link', { name: 'Continue' });
            expect(button).toBeInTheDocument();
        });

        test('applies correct spacing when support link is absent', () => {
            render(
                <FeedbackContent
                    {...defaultProps}
                    buttonLabel="Continue"
                    buttonRedirect="/next"
                />,
                { wrapper: MemoryRouter }
            );

            const button = screen.getByRole('link', { name: 'Continue' });
            expect(button).toBeInTheDocument();
        });
    });

    describe('Logout Functionality', () => {
        test('calls logout when button with __LOGOUT__ is clicked and user is authenticated', () => {
            useAuth.mockReturnValue({
                logout: mockLogout,
                isAuthenticated: true,
                loading: false,
                getToken: jest.fn(),
                initAuth: jest.fn(),
                login: jest.fn(),
            });

            render(
                <FeedbackContent
                    {...defaultProps}
                    buttonLabel="Exit"
                    buttonRedirect="__LOGOUT__"
                />,
                { wrapper: MemoryRouter }
            );

            const button = screen.getByRole('button', { name: 'Exit' });
            fireEvent.click(button);

            expect(mockLogout).toHaveBeenCalledTimes(1);
            expect(mockNavigate).not.toHaveBeenCalled();
        });

        test('navigates to HOME when button with __LOGOUT__ is clicked and user is not authenticated', () => {
            useAuth.mockReturnValue({
                logout: mockLogout,
                isAuthenticated: false,
                loading: false,
                getToken: jest.fn(),
                initAuth: jest.fn(),
                login: jest.fn(),
            });

            render(
                <FeedbackContent
                    {...defaultProps}
                    buttonLabel="Exit"
                    buttonRedirect="__LOGOUT__"
                />,
                { wrapper: MemoryRouter }
            );

            const button = screen.getByRole('button', { name: 'Exit' });
            fireEvent.click(button);

            expect(mockLogout).not.toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith(ROUTES.HOME);
        });

        test('does not call handleClick for normal button redirects', () => {
            render(
                <FeedbackContent
                    {...defaultProps}
                    buttonLabel="Go Home"
                    buttonRedirect="/home"
                />,
                { wrapper: MemoryRouter }
            );

            const button = screen.getByRole('link', { name: 'Go Home' });

            expect(button).toHaveAttribute('href', '/home');
            expect(mockLogout).not.toHaveBeenCalled();
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    describe('Edge Cases', () => {
        test('handles empty strings for title and description', () => {
            render(
                <FeedbackContent
                    {...defaultProps}
                    title=""
                    description=""
                />,
                { wrapper: MemoryRouter }
            );

            expect(screen.getByTestId('test-icon')).toBeInTheDocument();
        });

        test('handles title with only newline character', () => {
            render(
                <FeedbackContent
                    {...defaultProps}
                    title="\n"
                />,
                { wrapper: MemoryRouter }
            );

            expect(screen.getByTestId('test-icon')).toBeInTheDocument();
        });

        test('handles description with only newline character', () => {
            render(
                <FeedbackContent
                    {...defaultProps}
                    description="\n"
                />,
                { wrapper: MemoryRouter }
            );

            expect(screen.getByTestId('test-icon')).toBeInTheDocument();
        });

        test('handles title with embedded newline character', () => {
            const titleWithNewline = "Line1\n\n\nLine2";

            render(
                <FeedbackContent
                    {...defaultProps}
                    title={titleWithNewline}
                />,
                { wrapper: MemoryRouter }
            );

            expect(screen.getByTestId('test-icon')).toBeInTheDocument();
        });

        test('handles very long single-line title', () => {
            const longTitle = 'A'.repeat(200);
            render(
                <FeedbackContent
                    {...defaultProps}
                    title={longTitle}
                />,
                { wrapper: MemoryRouter }
            );

            expect(screen.getByText(longTitle)).toBeInTheDocument();
        });

        test('handles very long multi-line description', () => {
            const longDescription = Array(10).fill('Long line of text').join('\n');
            render(
                <FeedbackContent
                    {...defaultProps}
                    description={longDescription}
                />,
                { wrapper: MemoryRouter }
            );

            expect(screen.getAllByText('Long line of text')).toHaveLength(10);
        });
    });

    describe('showButton and showSupportLink Flags', () => {
        test('showButton is false when buttonLabel is undefined', () => {
            render(
                <FeedbackContent
                    {...defaultProps}
                    buttonRedirect="/home"
                />,
                { wrapper: MemoryRouter }
            );

            expect(screen.queryByRole('button')).not.toBeInTheDocument();
        });

        test('showButton is false when buttonRedirect is undefined', () => {
            render(
                <FeedbackContent
                    {...defaultProps}
                    buttonLabel="Click Me"
                />,
                { wrapper: MemoryRouter }
            );

            expect(screen.queryByRole('button')).not.toBeInTheDocument();
        });

        test('showSupportLink is false when supportLinkLabel is undefined', () => {
            render(
                <FeedbackContent
                    {...defaultProps}
                    supportLinkUrl="/support"
                />,
                { wrapper: MemoryRouter }
            );

            expect(screen.queryByRole('link')).not.toBeInTheDocument();
        });

        test('showSupportLink is false when supportLinkUrl is undefined', () => {
            render(
                <FeedbackContent
                    {...defaultProps}
                    supportLinkLabel="Help"
                />,
                { wrapper: MemoryRouter }
            );

            expect(screen.queryByRole('link')).not.toBeInTheDocument();
        });
    });

    describe('Component Structure', () => {
        test('renders main Box container', () => {
            const { container } = render(
                <FeedbackContent {...defaultProps} />,
                { wrapper: MemoryRouter }
            );

            expect(container.firstChild).toBeInTheDocument();
        });

        test('renders icon before title and description', () => {
            render(
                <FeedbackContent {...defaultProps} />,
                { wrapper: MemoryRouter }
            );

            const icon = screen.getByTestId('test-icon');
            const title = screen.getByText('Test Title');

            expect(icon.compareDocumentPosition(title)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
        });

        test('renders all elements in correct order', () => {
            render(
                <FeedbackContent
                    {...defaultProps}
                    buttonLabel="Button"
                    buttonRedirect="/home"
                    supportLinkLabel="Support"
                    supportLinkUrl="/support"
                />,
                { wrapper: MemoryRouter }
            );

            const icon = screen.getByTestId('test-icon');
            const button = screen.getByRole('link', { name: 'Button' });
            const supportLink = screen.getByRole('link', { name: 'Support' });

            expect(icon.compareDocumentPosition(button)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
            expect(button.compareDocumentPosition(supportLink)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
        });
    });

    describe('Multiple Clicks', () => {
        test('handles multiple logout clicks when authenticated', () => {
            useAuth.mockReturnValue({
                logout: mockLogout,
                isAuthenticated: true,
                loading: false,
                getToken: jest.fn(),
                initAuth: jest.fn(),
                login: jest.fn(),
            });

            render(
                <FeedbackContent
                    {...defaultProps}
                    buttonLabel="Logout"
                    buttonRedirect="__LOGOUT__"
                />,
                { wrapper: MemoryRouter }
            );

            const button = screen.getByRole('button', { name: 'Logout' });
            fireEvent.click(button);
            fireEvent.click(button);
            fireEvent.click(button);

            expect(mockLogout).toHaveBeenCalledTimes(3);
        });

        test('handles multiple clicks when not authenticated', () => {
            useAuth.mockReturnValue({
                logout: mockLogout,
                isAuthenticated: false,
                loading: false,
                getToken: jest.fn(),
                initAuth: jest.fn(),
                login: jest.fn(),
            });

            render(
                <FeedbackContent
                    {...defaultProps}
                    buttonLabel="Exit"
                    buttonRedirect="__LOGOUT__"
                />,
                { wrapper: MemoryRouter }
            );

            const button = screen.getByRole('button', { name: 'Exit' });
            fireEvent.click(button);
            fireEvent.click(button);

            expect(mockNavigate).toHaveBeenCalledTimes(2);
            expect(mockNavigate).toHaveBeenCalledWith(ROUTES.HOME);
        });
    });
});