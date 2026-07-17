import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { BrowserRouter } from 'react-router-dom';
import './locale/i18n.ts'
import './locale';
import { AuthProvider } from "./contexts/AuthContext";
import { initializeCookieOneTrust } from './utils/oneTrustLoader.ts';

initializeCookieOneTrust().catch(err => {
  console.log('Failed to initialize Cookie OneTrust: ', err);
});

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <BrowserRouter basename=/utente'>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </AuthProvider>
);