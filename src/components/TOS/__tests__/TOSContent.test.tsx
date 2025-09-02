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
    expect(screen.getByText('tos.privacy_part1')).toBeInTheDocument();
    expect(screen.getByText('tos.privacy_terms')).toBeInTheDocument();
    expect(screen.getByText('tos.privacy_part2')).toBeInTheDocument();
    expect(screen.getByText('tos.privacy_policy')).toBeInTheDocument();
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
    expect(screen.getByText('exit')).toBeInTheDocument();
    expect(screen.getByText('tos.continue')).toBeInTheDocument();
  });

  test('shows error when continue is clicked without accepting terms', async () => {
    const user = userEvent.setup();
    const { TOSContent } = await import('../TOSContent');
    render(<TOSContent sectionRefs={makeRefs()} />);
    await user.click(screen.getByRole('button', { name: /tos.continue/i }));
    expect(screen.getByText('commons.mandatoryField')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('error disappears after checking, then navigate is called', async () => {
    const user = userEvent.setup();
    const { TOSContent } = await import('../TOSContent');
    render(<TOSContent sectionRefs={makeRefs()} />);

    await user.click(screen.getByRole('button', { name: /tos.continue/i }));
    expect(screen.getByText('commons.mandatoryField')).toBeInTheDocument();

    await user.click(screen.getByRole('checkbox'));
    expect(screen.queryByText('commons.mandatoryField')).not.toBeInTheDocument();

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

  test('mobile branch is executed (useIsMobile = true)', async () => {
    jest.isolateModules(async () => {
      jest.doMock('../../../hooks/useIsMobile', () => ({ useIsMobile: () => true }));
      const { TOSContent } = await import('../TOSContent');
      render(<TOSContent sectionRefs={makeRefs()} />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });
  });

  it('hydrates checkbox from persisted store when mounting', () => {
    renderHook(() => {
      const store = useTOSCheckboxStore();
      store.setTosAccepted(true);
    });

    render(<TOSContent sectionRefs={makeRefs()} />);
    const cb = screen.getByRole('checkbox') as HTMLInputElement;
    expect(cb.checked).toBe(true);
  });

  it('accepting terms then continuing navigates without showing error after remount', async () => {
    const user = userEvent.setup();

    renderHook(() => {
      const store = useTOSCheckboxStore();
      store.setTosAccepted(true);
    });

    render(<TOSContent sectionRefs={makeRefs()} />);
    await user.click(screen.getByRole('button', { name: /tos.continue/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/inserisci-email');
  });
});