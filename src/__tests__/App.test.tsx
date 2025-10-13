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
    data-sidebar={String(props.hasSidebar)}
    data-subheader={String(props.hasSubHeader)}
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
    save: jest.fn().mockResolvedValue(undefined)
  }
}));

jest.mock('@pagopa/selfcare-common-frontend/lib/components/Footer/Footer', () => () => (
  <div data-testid="footer" />
));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

jest.mock('../contexts/AuthContext', () => {
  const initAuthMock = jest.fn();
  return {
    AuthProvider: ({ children }: any) => <>{children}</>,
    useAuth: () => ({
      initAuth: initAuthMock,
      isAuthenticated: true
    })
  };
});

jest.mock('../hooks/useIsMobile', () => ({
  useIsMobile: () => false,
}));

jest.mock('../utils/env', () => ({
  isMockAuthEnabled: () => false,
}));

jest.mock('../utils/env', () => ({
  getInitiativeId: () => '68dd003ccce8c534d1da22bc',
}));

test('PublicLayout props are passed (isLogged=true, no sidebar/subheader, padding=false)', () => {
  render(
    <MemoryRouter initialEntries={[ROUTES.HOME]}>
      <App />
    </MemoryRouter>
  );
  const layout = screen.getByTestId('layout');
  expect(layout).toHaveAttribute('data-sidebar', 'false');
  expect(layout).toHaveAttribute('data-subheader', 'false');
  expect(layout).toHaveAttribute('data-padding', 'false');
});

test('PrivateLayout default props are applied (sidebar=false, subheader=false, padding=undefined)', () => {
  render(
    <MemoryRouter initialEntries={[ROUTES.VERIFY_REQUIREMENTS]}>
      <App />
    </MemoryRouter>
  );
  const layout = screen.getByTestId('layout');
  expect(layout).toHaveAttribute('data-sidebar', 'false');
  expect(layout).toHaveAttribute('data-subheader', 'false');
  expect(layout).toHaveAttribute('data-padding', 'undefined');
});

test('PrivateLayout with explicit hasSidebar=true is passed to Layout', () => {
  render(
    <MemoryRouter initialEntries={[ROUTES.DASHBOARD]}>
      <App />
    </MemoryRouter>
  );
  const layout = screen.getByTestId('layout');
  expect(layout).toHaveAttribute('data-sidebar', 'true');
});