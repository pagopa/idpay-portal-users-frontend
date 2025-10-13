import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Layout from '../Layout';
import { loadingRef } from '../../../utils/loadingOverlay';

jest.mock('../../Header/Header', () => {
    return function MockHeader({ hasSubHeader }: any) {
        return (
            <div data-testid="header" data-has-subheader={hasSubHeader ? 'true' : 'false'}>
                Header
            </div>
        );
    };
});

jest.mock('../../Menu/Sidebar', () => {
    return function MockSidebar({ collapsed, toggleSidebar }: any) {
        return (
            <div data-testid="sidebar" data-collapsed={collapsed ? 'true' : 'false'}>
                <button data-testid="toggle-sidebar" onClick={toggleSidebar}>
                    Toggle
                </button>
            </div>
        );
    };
});

jest.mock('../../Overlay/Overlay', () => {
    return function MockOverlay() {
        return <div data-testid="overlay">Loading...</div>;
    };
});

jest.mock('@pagopa/selfcare-common-frontend/lib/components/Footer/Footer', () => {
    return function MockFooter({ loggedUser }: any) {
        return (
            <div data-testid="footer" data-logged-user={loggedUser ? 'true' : 'false'}>
                Footer
            </div>
        );
    };
});

describe('Layout', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders layout with header, sidebar, content and footer by default', () => {
        render(
            <Layout>
                <div data-testid="content">Test Content</div>
            </Layout>
        );

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
        expect(screen.getByTestId('content')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    test('renders header with subheader by default', () => {
        render(
            <Layout>
                <div>Content</div>
            </Layout>
        );

        expect(screen.getByTestId('header')).toHaveAttribute('data-has-subheader', 'true');
    });

    test('renders header without subheader when hasSubHeader is false', () => {
        render(
            <Layout hasSubHeader={false}>
                <div>Content</div>
            </Layout>
        );

        expect(screen.getByTestId('header')).toHaveAttribute('data-has-subheader', 'false');
    });

    test('renders layout without sidebar when hasSidebar is false', () => {
        render(
            <Layout hasSidebar={false}>
                <div data-testid="content">Test Content</div>
            </Layout>
        );

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
        expect(screen.getByTestId('content')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    test('toggles sidebar collapsed state when toggle button is clicked', async () => {
        render(
            <Layout>
                <div>Content</div>
            </Layout>
        );

        const sidebar = screen.getByTestId('sidebar');
        expect(sidebar).toHaveAttribute('data-collapsed', 'false');

        await userEvent.click(screen.getByTestId('toggle-sidebar'));

        expect(sidebar).toHaveAttribute('data-collapsed', 'true');

        await userEvent.click(screen.getByTestId('toggle-sidebar'));

        expect(sidebar).toHaveAttribute('data-collapsed', 'false');
    });

    test('renders overlay when loading is true', async () => {
        render(
            <Layout>
                <div>Content</div>
            </Layout>
        );

        expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();

        loadingRef.setLoading?.(true);

        await waitFor(() => {
            expect(screen.getByTestId('overlay')).toBeInTheDocument();
        });

        loadingRef.setLoading?.(false);

        await waitFor(() => {
            expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
        });
    });

    test('does not render overlay when loading is false', () => {
        render(
            <Layout>
                <div>Content</div>
            </Layout>
        );

        expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });

    test('passes loggedUser prop to Footer', () => {
        render(
            <Layout>
                <div>Content</div>
            </Layout>
        );

        expect(screen.getByTestId('footer')).toHaveAttribute('data-logged-user', 'true');
    });

    test('applies all layout props correctly', () => {
        render(
            <Layout hasSidebar={false} hasSubHeader={false} hasPadding={false}>
                <div data-testid="content">Content</div>
            </Layout>
        );

        expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
        expect(screen.getByTestId('header')).toHaveAttribute('data-has-subheader', 'false');
        expect(screen.getByTestId('content')).toBeInTheDocument();
    });
});