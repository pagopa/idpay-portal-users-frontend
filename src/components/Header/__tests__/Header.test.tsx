import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from '../Header';

jest.mock('../../../contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (k: string) => k }),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

jest.mock('@pagopa/mui-italia', () => ({
    HeaderAccount: (props: any) => (
        <div
            data-testid="HeaderAccount"
            data-enable-login={String(props.enableLogin)}
            data-has-logged-user={String(!!props.loggedUser)}
            data-logged-email={props.loggedUser?.email ?? ''}
            data-rootlabel={props.rootLink?.label ?? ''}
            data-roottitle={props.rootLink?.title ?? ''}
            data-has-onlogout={String(typeof props.onLogout === 'function')}
            data-has-onassistance={String(typeof props.onAssistanceClick === 'function')}
        />
    ),
    HeaderProduct: ({ productsList }: any) => (
        <div
            data-testid="HeaderProduct"
            data-first-product-title={productsList?.[0]?.title ?? ''}
        />
    ),
}));

const { useAuth } = jest.requireMock('../../../contexts/AuthContext');

describe('Header', () => {
    beforeEach(() => jest.clearAllMocks());

    it('renders HeaderAccount and HeaderProduct only when hasSubHeader=true', () => {
        (useAuth as jest.Mock).mockReturnValue({
            isAuthenticated: false,
            logout: jest.fn(),
            user: undefined,
        });

        render(<Header/>);
        expect(screen.getByTestId('HeaderAccount')).toBeInTheDocument();
        expect(screen.getByTestId('HeaderProduct')).toBeInTheDocument();
    });

    it('passes correct props to HeaderAccount when authenticated', () => {
        const mockLogout = jest.fn();
        (useAuth as jest.Mock).mockReturnValue({
            isAuthenticated: true,
            logout: mockLogout,
            user: { id: '1', firstName: 'Name', lastName: 'LastName', email: 'email@test.com' },
        });

        render(<Header/>);

        const el = screen.getByTestId('HeaderAccount');
        expect(el).toHaveAttribute('data-enable-login', 'true');
        expect(el).toHaveAttribute('data-has-logged-user', 'true');
        expect(el).toHaveAttribute('data-logged-email', 'email@test.com');
        expect(el).toHaveAttribute('data-has-onlogout', 'true');
    });

    it('provides root link and translations to HeaderAccount', () => {
        (useAuth as jest.Mock).mockReturnValue({
            isAuthenticated: false,
            logout: jest.fn(),
            user: undefined,
        });

        render(<Header />);

        const el = screen.getByTestId('HeaderAccount');
        expect(el).toHaveAttribute('data-rootlabel', 'commons.header.pagopaLinkLabel');
        expect(el).toHaveAttribute('data-roottitle', 'commons.header.pagopaLinkTitle');
        expect(el).toHaveAttribute('data-has-onassistance', 'true');
    });

    it('passes product title to HeaderProduct when subheader is enabled', () => {
        (useAuth as jest.Mock).mockReturnValue({
            isAuthenticated: false,
            logout: jest.fn(),
            user: undefined,
        });

        render(<Header />);

        const sub = screen.getByTestId('HeaderProduct');
        expect(sub).toHaveAttribute('data-first-product-title', 'commons.header.productTitle');
    });
});