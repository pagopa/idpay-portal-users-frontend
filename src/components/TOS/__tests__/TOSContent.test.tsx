import { render, renderHook, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { useTOSCheckboxStore } from '../../../hooks/useTOSCheckboxStore';
import { TOSContent } from '../TOSContent';

const mockNavigate = jest.fn();
const mockLogout = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  Trans: ({ i18nKey }: { i18nKey: string }) => <>{i18nKey}</>,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({ logout: mockLogout }),
}));

jest.mock('../../../hooks/useIsMobile', () => ({
  useIsMobile: () => false,
}));

jest.mock('../../../utils/env', () => ({
  getBaseUrl: () => 'https://www.google.com',
  getPortalUrl: (path: string) => `https://www.google.com/bonusdecoder/utente${path}`,
}));

const makeRefs = () =>
  [...Array(4)].map(() => ({ current: document.createElement('div') }));

describe('TOSContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all section titles', async () => {
    const { TOSContent } = await import('../TOSContent');
    render(<TOSContent sectionRefs={makeRefs()} />);
    expect(screen.getByText('tos.sideMenu.element1.title')).toBeInTheDocument();
    expect(screen.getByText('tos.sideMenu.element2.title')).toBeInTheDocument();
    expect(screen.getByText('tos.sideMenu.element3.title')).toBeInTheDocument();
    expect(screen.getByText('tos.sideMenu.element4.title')).toBeInTheDocument();
  });

  test('renders descriptions and Trans elements', async () => {
    const { TOSContent } = await import('../TOSContent');
    render(<TOSContent sectionRefs={makeRefs()} />);
    expect(screen.getByText('tos.sideMenu.element1.description')).toBeInTheDocument();
    expect(screen.getByText('tos.sideMenu.element2.description')).toBeInTheDocument();
    expect(screen.getByText('tos.sideMenu.element3.description')).toBeInTheDocument();
    expect(screen.getByText('tos.sideMenu.element4.description')).toBeInTheDocument();
    expect(screen.getByText('tos.postDescription')).toBeInTheDocument();
    expect(screen.getByText(/tos\.privacy_part1/)).toBeInTheDocument();
    expect(screen.getByText('tos.privacy_terms')).toBeInTheDocument();
    expect(screen.getByText(/tos\.privacy_part2/)).toBeInTheDocument();
    expect(screen.getByText('tos.privacy_policy')).toBeInTheDocument();
    expect(screen.getByText(/tos\.privacy_part3/)).toBeInTheDocument();
  });

  test('renders list items and links', async () => {
    const { TOSContent } = await import('../TOSContent');
    render(<TOSContent sectionRefs={makeRefs()} />);
    expect(screen.getByText('tos.sideMenu.element2.listItem1')).toBeInTheDocument();
    expect(screen.getByText('tos.sideMenu.element2.listItem2')).toBeInTheDocument();
    expect(screen.getByText('tos.sideMenu.element2.link')).toBeInTheDocument();
    expect(screen.getByText('tos.sideMenu.element4.link')).toBeInTheDocument();
  });

  test('renders exit and continue buttons', async () => {
    const { TOSContent } = await import('../TOSContent');
    render(<TOSContent sectionRefs={makeRefs()} />);
    expect(screen.getByText('common.exit')).toBeInTheDocument();
    expect(screen.getByText('tos.continue')).toBeInTheDocument();
  });

  test('clicking continue sets tosAccepted and navigates', async () => {
    const user = userEvent.setup();
    const { TOSContent } = await import('../TOSContent');
    render(<TOSContent sectionRefs={makeRefs()} />);

    await user.click(screen.getByRole('button', { name: /tos.continue/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/inserisci-email');
  });

  test('clicking Exit calls logout', async () => {
    const user = userEvent.setup();
    const { TOSContent } = await import('../TOSContent');
    render(<TOSContent sectionRefs={makeRefs()} />);
    await user.click(screen.getByRole('button', { name: /exit/i }));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test('hydrates from persisted store when mounting', () => {
    renderHook(() => {
      const store = useTOSCheckboxStore();
      store.setTosAccepted(true);
    });

    render(<TOSContent sectionRefs={makeRefs()} />);
    expect(screen.getByRole('button', { name: /tos.continue/i })).toBeInTheDocument();
  });

  test('setTosAccepted is called when continue button is clicked', async () => {
    const user = userEvent.setup();
    const { result } = renderHook(() => useTOSCheckboxStore());

    const { TOSContent } = await import('../TOSContent');
    render(<TOSContent sectionRefs={makeRefs()} />);

    await user.click(screen.getByRole('button', { name: /tos.continue/i }));

    expect(result.current.tosAccepted).toBe(true);
    expect(mockNavigate).toHaveBeenCalledWith('/inserisci-email');
  });

  test('external links open in new tab', () => {
    const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);

    render(<TOSContent sectionRefs={makeRefs()} />);

    const link = screen.getByText('tos.sideMenu.element2.link');
    link.click();

    expect(windowOpenSpy).toHaveBeenCalledWith(
      'https://www.google.com/elenco-informatico-elettrodomestici',
      '_blank'
    );

    windowOpenSpy.mockRestore();
  });
});
