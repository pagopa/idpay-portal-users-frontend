import { render, screen } from '@testing-library/react';
import TitleCard from '../TitleCard';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  }),
}));

describe('TitleCard', () => {
  it('renders the translated title', () => {
    const testTitle = 'my.custom.key';

    render(<TitleCard title={testTitle} />);

    const titleElement = screen.getByText(testTitle);
    expect(titleElement).toBeInTheDocument();
  });
});
