import { render, screen, fireEvent } from '@testing-library/react';
import UpcomingHeroSection from '../UpcomingHeroSection';
import '@testing-library/jest-dom';

describe('UpcomingHeroSection', () => {
    const mockOnClick = jest.fn();

    const defaultProps = {
        title: 'Upcoming Initiative',
        subtitle: 'This is a short description of the upcoming event.',
        buttonLabel: 'Learn More',
        onButtonClick: mockOnClick,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders title, subtitle and button correctly', () => {
        render(<UpcomingHeroSection {...defaultProps} />);

        expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
        expect(screen.getByText(defaultProps.subtitle)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: defaultProps.buttonLabel })).toBeInTheDocument();
    });

    it('calls onButtonClick when button is clicked', () => {
        render(<UpcomingHeroSection {...defaultProps} />);

        const button = screen.getByRole('button', { name: defaultProps.buttonLabel });
        fireEvent.click(button);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('renders the background image correctly', () => {
        render(<UpcomingHeroSection {...defaultProps} />);

        const img = screen.getByAltText('Hero Background') as HTMLImageElement;
        expect(img).toBeInTheDocument();
        expect(img.src).toContain('upcomingInitiative.svg');
    });
});
