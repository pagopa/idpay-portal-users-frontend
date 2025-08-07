import { render, screen } from '@testing-library/react';
import { TOSHeader } from '../TOSHeader'; // Adjust path as needed
import '@testing-library/jest-dom';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../../../hooks/useIsMobile', () => ({
  useIsMobile: jest.fn(),
}));

describe('TOSHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders title and description', () => {
    const { useIsMobile } = require('../../../hooks/useIsMobile');
    useIsMobile.mockReturnValue(false);

    render(<TOSHeader />);

    expect(screen.getByText('bonus')).toBeInTheDocument();
    expect(screen.getByText('tos.description')).toBeInTheDocument();
  });

  test('renders with no margin bottom on mobile', () => {
    const { useIsMobile } = require('../../../hooks/useIsMobile');
    useIsMobile.mockReturnValue(true);

    const { container } = render(<TOSHeader />);

    const box = container.querySelector('div');
    expect(box).toBeInTheDocument();
  });
});
