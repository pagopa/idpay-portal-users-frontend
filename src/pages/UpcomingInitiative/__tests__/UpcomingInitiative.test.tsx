import { render, screen, fireEvent } from '@testing-library/react';
import UpcomingInitiative from '../UpcomingInitiative';
import '@testing-library/jest-dom';

const translations: Record<string, string> = {
    'upcomingInitiative.title': 'Iniziativa in arrivo',
    'upcomingInitiative.preSubtitle': 'Pre ',
    'upcomingInitiative.boldSubtitle': 'BOLD ',
    'upcomingInitiative.postSubtitle': 'Post',
    'upcomingInitiative.withIO': 'Con IO',
    'upcomingInitiative.descriptionWithIO': 'Scarica l’app IO per scoprire di più.',
    'upcomingInitiative.downloadIO': 'Scarica IO',
};

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => translations[key] ?? key,
    }),
}));

jest.mock('../UpcomingHeroSection.tsx', () => {
    return function MockUpcomingHeroSection(props: any) {
        return (
            <button onClick={props.onButtonClick}>
                {props.buttonLabel}
            </button>
        );
    };
});

describe('UpcomingInitiative', () => {
    const originalUA = window.navigator.userAgent;

    const setUserAgent = (ua: string) => {
        Object.defineProperty(window.navigator, 'userAgent', {
            value: ua,
            configurable: true,
        });
    };

    beforeEach(() => {
        jest.restoreAllMocks();
        setUserAgent(originalUA);
    });

    afterAll(() => {
        setUserAgent(originalUA);
    });

    it('renderizza titolo e sottotitolo (con parte in grassetto) dai key di traduzione', () => {
        render(<UpcomingInitiative />);

        expect(screen.getByRole('heading', { name: translations['upcomingInitiative.title'] })).toBeInTheDocument();


        expect(screen.getByText('Iniziativa in arrivo')).toBeInTheDocument();
    });

    it('apre il link Google Play su Android', () => {
        setUserAgent('Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 Chrome/110.0.0.0 Mobile Safari/537.36');

        const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
        render(<UpcomingInitiative />);

        const btn = screen.getByRole('button', {
            name: translations['upcomingInitiative.downloadIO'],
        });
        fireEvent.click(btn);

        expect(openSpy).toHaveBeenCalledWith(
            'https://play.google.com/store/apps/details?id=it.pagopa.io.app',
            '_blank'
        );
    });

    it('apre l’App Store su iOS', () => {
        setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 Version/16.0 Mobile/15E148 Safari/604.1');

        const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
        render(<UpcomingInitiative />);

        const btn = screen.getByRole('button', {
            name: translations['upcomingInitiative.downloadIO'],
        });
        fireEvent.click(btn);

        expect(openSpy).toHaveBeenCalledWith(
            'https://apps.apple.com/it/app/io/id1501681835',
            '_blank'
        );
    });

    it('apre la pagina di fallback su desktop/altro', () => {
        setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36');

        const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
        render(<UpcomingInitiative />);

        const btn = screen.getByRole('button', {
            name: translations['upcomingInitiative.downloadIO'],
        });
        fireEvent.click(btn);

        expect(openSpy).toHaveBeenCalledWith(
            'https://ioapp.it/scarica-io',
            '_blank'
        );
    });
});
