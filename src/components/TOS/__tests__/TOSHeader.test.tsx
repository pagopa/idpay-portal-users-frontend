import { render } from '@testing-library/react';
import { TOSHeader } from '../TOSHeader';
import { useIsMobile } from '../../../hooks/useIsMobile';

jest.mock('../../../hooks/useIsMobile', () => ({
  useIsMobile: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  Trans: ({ i18nKey }: { i18nKey: string }) => <span>{i18nKey}</span>,
}));

describe('TOSHeader', () => {
  it('renders correctly', () => {
    (useIsMobile as jest.Mock).mockReturnValue(false);
    const { getByText } = render(<TOSHeader />);
    expect(getByText('bonus')).toBeInTheDocument();
    expect(getByText('tos.description')).toBeInTheDocument();
  });
});