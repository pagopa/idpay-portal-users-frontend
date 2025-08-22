import { render, screen } from '@testing-library/react';
import { TOSContent } from '../TOSContent';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  Trans: ({ i18nKey }: { i18nKey: string }) => <>{i18nKey}</>,
}));

jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({ logout: jest.fn() }),
}));

jest.mock('../../../hooks/useIsMobile', () => ({
  useIsMobile: () => false,
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('TOSContent', () => {
  const sectionRefs = [
    { current: document.createElement('div') },
    { current: document.createElement('div') },
    { current: document.createElement('div') },
    { current: document.createElement('div') },
  ];

  test('renders all section titles', () => {
    render(<TOSContent sectionRefs={sectionRefs} />);

    expect(screen.getByText('tos.sideMenu.element1.title')).toBeInTheDocument();
    expect(screen.getByText('tos.sideMenu.element2.title')).toBeInTheDocument();
    expect(screen.getByText('tos.sideMenu.element3.title')).toBeInTheDocument();
    expect(screen.getByText('tos.sideMenu.element4.title')).toBeInTheDocument();
  });

  test('renders descriptions and Trans elements', () => {
    render(<TOSContent sectionRefs={sectionRefs} />);

    expect(screen.getByText('tos.sideMenu.element1.description')).toBeInTheDocument();
    expect(screen.getByText('tos.sideMenu.element2.description')).toBeInTheDocument();
    expect(screen.getByText('tos.sideMenu.element3.description')).toBeInTheDocument();
    expect(screen.getByText('tos.sideMenu.element4.description')).toBeInTheDocument();
    expect(screen.getByText('tos.postDescription')).toBeInTheDocument();
    expect(screen.getByText('tos.privacy_part1')).toBeInTheDocument();
    expect(screen.getByText('tos.privacy_terms')).toBeInTheDocument();
    expect(screen.getByText('tos.privacy_part2')).toBeInTheDocument();
    expect(screen.getByText('tos.privacy_policy')).toBeInTheDocument();
  });

  test('renders list items in section 2', () => {
    render(<TOSContent sectionRefs={sectionRefs} />);

    expect(screen.getByText('tos.sideMenu.element2.listItem1')).toBeInTheDocument();
    expect(screen.getByText('tos.sideMenu.element2.listItem2')).toBeInTheDocument();
  });

  test('renders links with correct text', () => {
    render(<TOSContent sectionRefs={sectionRefs} />);

    expect(screen.getByText('tos.sideMenu.element2.link')).toBeInTheDocument();
    expect(screen.getByText('tos.sideMenu.element4.link')).toBeInTheDocument();
  });

  test('renders exit and continue buttons', () => {
    render(<TOSContent sectionRefs={sectionRefs} />);

    expect(screen.getByText('exit')).toBeInTheDocument();
    expect(screen.getByText('tos.continue')).toBeInTheDocument();
  });

  test('shows error when continue is clicked without accepting terms', async () => {
    const user = userEvent.setup();
  
    render(<TOSContent sectionRefs={[...Array(4)].map(() => ({ current: document.createElement('div') }))} />);

    const continueBtn = screen.getByRole('button', { name: /tos.continue/i });
    await user.click(continueBtn);

    expect(screen.getByText('commons.mandatoryField')).toBeInTheDocument();
  });

  test('calls navigate when checkbox is checked and continue is clicked', async () => {
    const user = userEvent.setup();
  
    render(<TOSContent sectionRefs={[...Array(4)].map(() => ({ current: document.createElement('div') }))} />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    const continueBtn = screen.getByRole('button', { name: /tos.continue/i });
    await user.click(continueBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/utente/inserisci-email');
  });
});