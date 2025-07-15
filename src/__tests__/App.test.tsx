import { render } from '@testing-library/react';
import { useAuth } from 'react-oidc-context';
import App from '../App';

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: () => new Promise(() => {}) }
  })
}));

jest.mock('react-oidc-context', () => ({
  useAuth: jest.fn(),
}));

describe('App component', () => {
//   it('renders loading', () => {
//     (useAuth as jest.Mock).mockReturnValue({
//       isLoading: true,
//       isAuthenticated: false,
//       signinRedirect: jest.fn(),
//     });

//     render(<App />);
//     expect(screen.getByText(/Caricamento sessione/i)).toBeInTheDocument();
//   });

//   it('renders redirect message', () => {
//     (useAuth as jest.Mock).mockReturnValue({
//       isLoading: false,
//       isAuthenticated: false,
//       signinRedirect: jest.fn(),
//     });

//     render(<App />);
//     expect(screen.getByText(/Reindirizzamento al login/i)).toBeInTheDocument();
//   });

  it('renders layout when authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      signinRedirect: jest.fn(),
    });

    render(<App />);
  });
});
