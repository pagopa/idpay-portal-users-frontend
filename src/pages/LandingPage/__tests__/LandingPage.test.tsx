import { render, screen, fireEvent } from '@testing-library/react';
import LandingPage from '../LandingPage';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'landing.withIO': 'Con IO è tutto più semplice',
                'landing.descriptionWithIO': 'Descrizione con IO app',
                'landing.downloadIO': 'Scarica IO',
            };
            return translations[key] || key;
        },
    }),
}));

jest.mock('../../../components/LandingPage/CustomLandingSection', () => () => (
    <div data-testid="custom-landing-section">Custom Landing Section</div>
));

jest.mock('../../../components/LandingPage/CustomHeroSection', () => (props: any) => (
    <div data-testid="custom-hero-section">
        <button onClick={props.onButtonClick}>{props.buttonLabel}</button>
    </div>
));

jest.mock('../../../assets/io-gradient-blu.png', () => 'mock-image.png');

describe('LandingPage', () => {
    let originalUserAgent: string;

    beforeEach(() => {
        originalUserAgent = navigator.userAgent;
        window.open = jest.fn();
    });

    afterEach(() => {
        Object.defineProperty(navigator, 'userAgent', {
            value: originalUserAgent,
            configurable: true,
        });

        window.open = jest.fn();
        jest.resetAllMocks();
    });


    it('renders both sections', () => {
        render(<LandingPage />);

        expect(screen.getByTestId('custom-landing-section')).toBeInTheDocument();
        expect(screen.getByTestId('custom-hero-section')).toBeInTheDocument();
        expect(screen.getByText('Scarica IO')).toBeInTheDocument();
    });

    it('opens Android link when Android userAgent is detected', () => {
        Object.defineProperty(navigator, 'userAgent', {
            value: 'Mozilla/5.0 (Linux; Android 10)',
            configurable: true,
        });

        render(<LandingPage />);
        fireEvent.click(screen.getByText('Scarica IO'));

        expect(window.open).toHaveBeenCalledWith(
            'https://play.google.com/store/apps/details?id=it.pagopa.io.app',
            '_blank'
        );
    });

    it('opens iOS link when iPhone userAgent is detected', () => {
        Object.defineProperty(navigator, 'userAgent', {
            value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
            configurable: true,
        });

        Object.defineProperty(navigator, 'msStream', {
            value: undefined,
            configurable: true,
        });

        render(<LandingPage />);
        fireEvent.click(screen.getByText('Scarica IO'));

        expect(window.open).toHaveBeenCalledWith(
            'https://apps.apple.com/it/app/io/id1501681835',
            '_blank'
        );
    });

    it('opens fallback link on desktop userAgent', () => {
        Object.defineProperty(navigator, 'userAgent', {
            value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            configurable: true,
        });

        render(<LandingPage />);
        fireEvent.click(screen.getByText('Scarica IO'));

        expect(window.open).toHaveBeenCalledWith(
            'https://ioapp.it/scarica-io',
            '_blank'
        );
    });
});