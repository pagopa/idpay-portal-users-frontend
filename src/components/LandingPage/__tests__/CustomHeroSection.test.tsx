import { render, screen, fireEvent } from '@testing-library/react';
import CustomHeroSection from '../CustomHeroSection';

describe('CustomHeroSection', () => {
  const defaultProps = {
    title: 'Test Title',
    description: 'This is a test description',
    buttonLabel: 'Click Me',
    onButtonClick: jest.fn(),
    backgroundImage: '/test-image.png',
  };

  it('renders title, description, and button correctly', () => {
    render(<CustomHeroSection {...defaultProps} />);

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: defaultProps.buttonLabel })).toBeInTheDocument();
  });

  it('calls onButtonClick when button is clicked', () => {
    render(<CustomHeroSection {...defaultProps} />);

    const button = screen.getByRole('button', { name: defaultProps.buttonLabel });
    fireEvent.click(button);

    expect(defaultProps.onButtonClick).toHaveBeenCalledTimes(1);
  });

  it('renders the background image', () => {
    render(<CustomHeroSection {...defaultProps} />);
    
    const image = screen.getByAltText('Background') as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toContain(defaultProps.backgroundImage);
  });

  it('does not render background image if none provided', () => {
    const { queryByAltText } = render(
      <CustomHeroSection {...defaultProps} backgroundImage={undefined} />
    );

    expect(queryByAltText('Background')).not.toBeInTheDocument();
  });
});