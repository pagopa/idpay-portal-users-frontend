import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import keycloak from '../config/keycloak';
import type { ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: unknown;
  token: string | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<unknown>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        const authenticated = await keycloak.init({
          onLoad: 'login-required',
          checkLoginIframe: false,
          pkceMethod: 'S256'
        });

        if (authenticated) {
          setIsAuthenticated(true);
          setToken(keycloak.token || null);
          const userProfile = await keycloak.loadUserProfile();
          setUser(userProfile);
        }
      } catch (error) {
        console.error('Keycloak initialization error: ', error);
      } finally {
        setLoading(false);
      }
    };

    initKeycloak();

    // Automatic refresh token
    const refreshToken = () => {
      keycloak.updateToken(70).then((refreshed) => {
        if (refreshed) {
          setToken(keycloak.token || null);
          console.log('refresh Token');
        }
      }).catch(() => {
        console.log('Failed refresh Token');
        logout();
      });
    };

    const interval = setInterval(refreshToken, 60000);

    return () => clearInterval(interval);
  }, []);

  const login = useCallback(() => {
    keycloak.login();
  },[]);

  const logout = useCallback(() => {
    keycloak.logout();
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  }, [setIsAuthenticated, setUser, setToken]);

  const value = useMemo(() => ({
    isAuthenticated,
    user,
    token,
    login, // Le funzioni login e logout dovrebbero essere avvolte in useCallback se cambiano ad ogni render
    logout, // per evitare che siano "nuove" e causino una ricreazione del 'value'
    loading
  }), [isAuthenticated, user, token, login, logout, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve essere usato all\'interno di un AuthProvider');
  }
  return context;
};