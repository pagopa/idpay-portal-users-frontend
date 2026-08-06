import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { BrowserRouter } from 'react-router-dom';
import './locale/i18n.ts'
import './locale';
import { AuthProvider } from "./contexts/AuthContext";
import './utils/initializeOneTrust.ts';

const routerBasename = import.meta.env.BASE_URL.replace(/\/+$/, '') || '/';

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <BrowserRouter basename={routerBasename}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </AuthProvider>
);
