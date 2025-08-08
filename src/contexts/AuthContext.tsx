import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import keycloak from '../config/keycloak';
import type { ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: unknown;
  token: string | null;
  initAuth: (shouldRedirectToLogin?: boolean) => Promise<void>;
  login: () => void;
  logout: () => void;
  loading: boolean;
}
interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const isMockMode = import.meta.env.VITE_KEYCLOAK_MOCK_AUTH === 'true';
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<unknown>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const initAuth = useCallback(async (shouldRedirectToLogin = false) => {
    if (isMockMode) {
      console.log('mock-login');
      setIsAuthenticated(true);
      setUser({ name: 'Mock User', email: 'test@test.it' });
      setToken('mock-token');
      return;
    }
    setLoading(true);
    try {
      const authenticated = await keycloak.init({
        checkLoginIframe: false,
        pkceMethod: 'S256'
      });

      if (authenticated) {
        setIsAuthenticated(true);
        setToken(keycloak.token || null);
        const userProfile = await keycloak.loadUserProfile();
        setUser(userProfile);
      } else {
        if (shouldRedirectToLogin) {
          keycloak.login({ idpHint: 'oneid-keycloak' });
        }
      }
    } catch (error) {
        console.log('Keycloak already initialized');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      keycloak.updateToken(70).then((refreshed) => {
        if (refreshed) {
          setToken(keycloak.token || null);
          console.log('refresh Token');
        }
      }).catch(() => {
        console.log('Failed refresh Token');
        logout();
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const login = useCallback(() => keycloak.login({ idpHint: 'oneid-keycloak' }), []);
  const logout = useCallback(() => {
    keycloak.logout();
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(() => ({
    isAuthenticated,
    user,
    token,
    login,
    logout,
    loading,
    initAuth
  }), [isAuthenticated, user, token, login, logout, loading, initAuth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve essere usato all\'interno di un AuthProvider');
  }
  return context;
};