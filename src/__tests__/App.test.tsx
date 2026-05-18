import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import ROUTES from '../routes';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => jest.fn()
  };
});

jest.mock('../components/Layout/Layout', () => (props: any) => (
  <div
    data-testid="layout"
    data-padding={String(props.hasPadding)}
  >
    {props.children}
  </div>
));

jest.mock('../config/ProtectedRoute', () => (props: any) => <>{props.children}</>);

jest.mock('../api/onboardingWebApiClient', () => ({
  OnboardingWebApi: {
    getStatus: jest.fn().mockResolvedValue({ status: 200, data: {} }),
    getDetail: jest.fn().mockResolvedValue({}),
    save: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('@pagopa/selfcare-common-frontend/lib/components/Footer/Footer', () => () => (
  <div data-testid="footer" />
));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../contexts/AuthContext', () => {
  const initAuthMock = jest.fn();
  return {
    AuthProvider: ({ children }: any) => <>{children}</>,
    useAuth: () => ({
      initAuth: initAuthMock,
      isAuthenticated: true,
    }),
  };
});

jest.mock('../hooks/useIsMobile', () => ({
  useIsMobile: () => false,
}));

jest.mock('../utils/env', () => ({
  isMockAuthEnabled: () => false,
  getInitiativeId: () => '68dd003ccce8c534d1da22bc',
  isItWalletEnabled: () => true
}));

const mockScrollTo = jest.fn();

beforeAll(() => {
  Object.defineProperty(window, 'scrollTo', {
    value: mockScrollTo,
    writable: true,
  });
});

describe('App Routing and Layout props', () => {
  test('PublicLayout props are passed (no padding)', () => {
    render(
      <MemoryRouter initialEntries={[ROUTES.HOME]}>
        <App />
      </MemoryRouter>
    );
    const layout = screen.getByTestId('layout');
    expect(layout).toHaveAttribute('data-padding', 'false');
  });

  test('PrivateLayout default props are applied (padding=undefined)', () => {
    render(
      <MemoryRouter initialEntries={[ROUTES.VERIFY_REQUIREMENTS]}>
        <App />
      </MemoryRouter>
    );
    const layout = screen.getByTestId('layout');
    expect(layout).toHaveAttribute('data-padding', 'undefined');
  });

  test('PrivateLayout passes explicit props (hasPadding=false)', () => {
    render(
      <MemoryRouter initialEntries={[ROUTES.DASHBOARD]}>
        <App />
      </MemoryRouter>
    );
    const layout = screen.getByTestId('layout');
    expect(layout).toHaveAttribute('data-padding', 'false');
  });
});