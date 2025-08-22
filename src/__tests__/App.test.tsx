import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import ROUTES from '../routes';

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

test('renders App component without crashing', () => {
  render(
    <MemoryRouter initialEntries={[ROUTES.DASHBOARD]}>
      <App />
    </MemoryRouter>
  );
});
