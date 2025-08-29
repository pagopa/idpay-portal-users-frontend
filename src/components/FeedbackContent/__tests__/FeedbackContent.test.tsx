import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FeedbackContent from '../FeedbackContent';

jest.mock('../../../contexts/AuthContext', () => {
    return {
        useAuth: () => ({
            logout: jest.fn(),
            isAuthenticated: false,
            loading: false,
            getToken: jest.fn().mockResolvedValue(null),
            initAuth: jest.fn(),
            login: jest.fn()
        }),
    };
});

describe('FeedbackContent', () => {
    const defaultProps = {
        icon: <div data-testid="test-icon">ICON</div>,
        title: 'Test Title',
        description: 'Line 1\nLine 2',
    };

    it('renders icon, title and multiline description correctly', () => {
        render(<FeedbackContent {...defaultProps} />, { wrapper: MemoryRouter });

        expect(screen.getByTestId('test-icon')).toBeInTheDocument();
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Line 1')).toBeInTheDocument();
        expect(screen.getByText('Line 2')).toBeInTheDocument();
    });

    it('renders single-line description if no newline is present', () => {
        render(<FeedbackContent {...defaultProps} description="Single line" />, { wrapper: MemoryRouter });
        expect(screen.getByText('Single line')).toBeInTheDocument();
    });

    it('renders button if buttonLabel and buttonRedirect are present', () => {
        render(
            <FeedbackContent
                {...defaultProps}
                buttonLabel="Go Back"
                buttonRedirect="/home"
            />,
            { wrapper: MemoryRouter }
        );

        const buttonLink = screen.getByRole('link', { name: 'Go Back' });
        expect(buttonLink).toBeInTheDocument();
        expect(buttonLink).toHaveAttribute('href', '/home');
    });

    it('does not render button if buttonLabel or buttonRedirect are missing', () => {
        render(
            <FeedbackContent
                {...defaultProps}
                buttonLabel="Missing URL"
            />,
            { wrapper: MemoryRouter }
        );

        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('renders support link if supportLinkLabel and supportLinkUrl are present', () => {
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

    it('does not render support link if supportLinkLabel or supportLinkUrl are missing', () => {
        render(
            <FeedbackContent
                {...defaultProps}
                supportLinkLabel="Only label"
            />,
            { wrapper: MemoryRouter }
        );

        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('calls logout when buttonRedirect is "__LOGOUT__"', () => {
        const logoutMock = jest.fn();
        (require('../../../contexts/AuthContext') as any).useAuth = () => ({ logout: logoutMock });
        render(
            <FeedbackContent
                {...defaultProps}
                buttonLabel="Exit"
                buttonRedirect="__LOGOUT__"
            />
        );
        screen.getByRole('button', { name: 'Exit' }).click();
        expect(logoutMock).toHaveBeenCalled();
    });
});
