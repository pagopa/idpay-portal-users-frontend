import React, { createContext, useContext, useEffect, useState, useMemo, useCallback, useRef } from 'react';
import keycloak from '../config/keycloak';
import type { ReactNode } from 'react';
import ROUTES from '../routes';

interface AuthContextType {
  isAuthenticated: boolean;
  user: unknown;
  token: string | null;
  initAuth: (shouldRedirectToLogin?: boolean) => Promise<void>;
  login: () => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const isMockMode = import.meta.env.VITE_KEYCLOAK_MOCK_AUTH === 'true';

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<unknown>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const hasInitialized = useRef(false);
  const initPromise = useRef<Promise<boolean> | null>(null);

  const readProfile = useCallback(async () => {
    setIsAuthenticated(true);
    setToken(keycloak.token || null);
    try {
      const profile = await keycloak.loadUserProfile();
      setUser(profile);
    } catch {
      setUser(null);
    }
  }, []);

  const initOnce = useCallback((onLoad?: 'check-sso' | 'login-required') => {
    if (initPromise.current) return initPromise.current;
    initPromise.current = keycloak
      .init({
        onLoad,
        pkceMethod: 'S256',
        checkLoginIframe: false,
      })
      .then((auth) => !!auth)
      .catch(() => false);
    return initPromise.current;
  }, []);

  const logout = useCallback(() => {
    if (!isMockMode) {
      keycloak.logout({
        redirectUri: `${window.location.origin}${ROUTES.HOME}`,
      });
    }
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  }, [isMockMode]);

  const login = useCallback(() => {
    if (isMockMode) {
      console.log('mock-login');
      setIsAuthenticated(true);
      setUser({ name: 'Mock User', email: 'test@test.it' });
      setToken('mock-token');
      return;
    }
    keycloak.login({
      idpHint: 'oneid-keycloak',
      redirectUri: `${window.location.origin}${ROUTES.TOS}`,
    });
  }, [isMockMode]);

  const initAuth = useCallback(
    async (shouldRedirectToLogin = false) => {
      if (isMockMode) {
        setIsAuthenticated(true);
        setUser({ name: 'Mock User', email: 'test@test.it' });
        setToken('mock-token');
        return;
      }

      setLoading(true);
      try {
        if (!hasInitialized.current) {
          const authenticated = await initOnce('check-sso');
          hasInitialized.current = true;
          if (authenticated) {
            await readProfile();
            return;
          }
        }
        if (shouldRedirectToLogin) {
          await keycloak.login({
            idpHint: 'oneid-keycloak',
            redirectUri: `${window.location.origin}${ROUTES.TOS}`,
          });
        }
      } catch (err) {
        console.error('Keycloak init/login error', err);
      } finally {
        setLoading(false);
      }
    },
    [initOnce, isMockMode, readProfile]
  );

  useEffect(() => {
    void initAuth(false);
  }, [initAuth]);

  useEffect(() => {
    if (isMockMode) return;
    const interval = setInterval(() => {
      keycloak
        .updateToken(70)
        .then((refreshed) => {
          if (refreshed) setToken(keycloak.token || null);
        })
        .catch(() => {
          logout();
        });
    }, 60000);
    return () => clearInterval(interval);
  }, [isMockMode, logout]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      token,
      initAuth,
      login,
      logout,
      loading,
    }),
    [isAuthenticated, user, token, initAuth, login, logout, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside the AuthProvider');
  return ctx;
};