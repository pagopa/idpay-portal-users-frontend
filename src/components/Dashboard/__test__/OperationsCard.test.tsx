import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OperationsCard from '../OperationsCard';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

describe('OperationsCard', () => {
  test('renders operations card with title', () => {
    render(<OperationsCard />);

    expect(screen.getByText('dashboard.operationsSection.title')).toBeInTheDocument();
  });

  test('renders as a card component', () => {
    const { container } = render(<OperationsCard />);
    
    const cardElement = container.querySelector('.MuiCard-root');
    expect(cardElement).toBeInTheDocument();
  });

  test('renders card content', () => {
    const { container } = render(<OperationsCard />);
    
    const cardContentElement = container.querySelector('.MuiCardContent-root');
    expect(cardContentElement).toBeInTheDocument();
  });

  test('has overline typography for title', () => {
    render(<OperationsCard />);
    
    const titleElement = screen.getByText('dashboard.operationsSection.title');
    expect(titleElement.tagName.toLowerCase()).toBe('span');
  });

  test('component renders without crashing', () => {
    const { container } = render(<OperationsCard />);
    expect(container).toBeInTheDocument();
  });
});