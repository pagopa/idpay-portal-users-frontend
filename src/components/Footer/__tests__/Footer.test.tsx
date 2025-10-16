import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Footer } from '../Footer';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (k: string) => k }),
}));

jest.mock('@pagopa/mui-italia', () => {
    const FooterPostLogin = jest.fn(() => <div data-testid="FooterPostLogin" />);
    const FooterLegal = ({ content }: any) => <div data-testid="FooterLegal">{content}</div>;
    return { FooterPostLogin, FooterLegal };
});

const getFooterPostLoginProps = () => {
    const { FooterPostLogin } = jest.requireMock('@pagopa/mui-italia') as {
        FooterPostLogin: jest.Mock;
    };
    const call = FooterPostLogin.mock.calls[0];
    return call?.[0] ?? {};
};

describe('Footer', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders FooterPostLogin and FooterLegal', () => {
        render(<Footer />);
        expect(screen.getByTestId('FooterPostLogin')).toBeInTheDocument();
        expect(screen.getByTestId('FooterLegal')).toBeInTheDocument();
    });

    it('passes correct company link props', () => {
        render(<Footer />);
        const props = getFooterPostLoginProps();
        expect(props.companyLink?.href).toBe('https://www.pagopa.it/it/');
        expect(props.companyLink?.ariaLabel).toBe('PagoPA SPA');
        expect(typeof props.companyLink?.onClick).toBe('function');
    });

    it('passes links with expected shape', () => {
        render(<Footer />);
        const props = getFooterPostLoginProps();
        expect(props.links).toHaveLength(4);

        expect(props.links[0].label).toBe('commons.footer.privacy');
        expect(props.links[0].href).toBe('');
        expect(props.links[0].linkType).toBe('external');
        expect(typeof props.links[0].onClick).toBe('function');

        expect(props.links[1].label).toBe('commons.footer.personalData');
        expect(props.links[1].href).toBe(
            'https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8'
        );
        expect(typeof props.links[1].onClick).toBe('function');

        expect(props.links[2].label).toBe('commons.footer.termsAndConditions');
        expect(props.links[2].href).toBe('');
        expect(typeof props.links[2].onClick).toBe('function');

        expect(props.links[3].label).toBe('commons.footer.a11y');
        expect(typeof props.links[3].onClick).toBe('function');
    });

    it('sets current language to Italian', () => {
        render(<Footer />);
        const props = getFooterPostLoginProps();
        expect(props.currentLangCode).toBe('it');
    });

    it('renders legal content with correct translations', () => {
        render(<Footer />);
        const legal = screen.getByTestId('FooterLegal');
        expect(legal).toHaveTextContent('commons.footer.PagoPA');
        expect(legal).toHaveTextContent('commons.footer.legalInfo');
    });
});
