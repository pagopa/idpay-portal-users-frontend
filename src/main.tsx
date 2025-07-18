import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from "react-oidc-context";


const oidcConfig = {
  authority: import.meta.env.VITE_OIDC_AUTHORITY, //provider url
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID, //client univoque id
  redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URI, //redirect uri after a successful login
  automaticSilentRenew: true, // automatically renews tokens
  onSigninCallback: () => {
    // clean the url after a successful login
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

createRoot(document.getElementById('root')!).render(
  <AuthProvider {...oidcConfig}>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </AuthProvider>
);