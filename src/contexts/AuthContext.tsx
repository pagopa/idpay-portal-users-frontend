import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef, type ReactNode } from 'react';
import { AuthContextType, UserProfile } from '../types/auth';
import { createKeycloakService, type KeycloakService } from '../services/keycloakService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const keycloakServiceRef = useRef<KeycloakService | null>(null);
  const hasInitialized = useRef(false);
  const isMockMode = import.meta.env.VITE_KEYCLOAK_MOCK_AUTH === 'true';

  useEffect(() => {
    const handleTokenUpdate = (newToken: string | null) => {
      setToken(newToken);
    };

    const handleAuthError = () => {
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
    };
    keycloakServiceRef.current = createKeycloakService(handleTokenUpdate, handleAuthError);

    return () => {
      keycloakServiceRef.current?.cleanup();
    };
  }, []);

  const setupAuthenticatedState = useCallback(async () => {
    if (!keycloakServiceRef.current) return;

    setIsAuthenticated(true);

    const currentToken = keycloakServiceRef.current.getCurrentToken();
    setToken(currentToken);
    keycloakServiceRef.current.saveToken(currentToken);

    const profile = await keycloakServiceRef.current.loadUserProfile();
    setUser(profile);

    keycloakServiceRef.current.startTokenRefresh();
  }, []);

  const initAuth = useCallback(async () => {
    if (!keycloakServiceRef.current || hasInitialized.current) return;
    hasInitialized.current = true;

    setLoading(true);

    try {
      if (isMockMode) {
        setIsAuthenticated(true);
        setUser({ name: 'Mock User', email: 'test@test.it' });
        setToken('mock-token');
        setLoading(false);
        return;
      }

      const authenticated = await keycloakServiceRef.current.initialize();

      if (authenticated) {
        await setupAuthenticatedState();
      }
      setLoading(false);
    } catch (error) {
      console.error('Auth initialization failed:', error);
      setLoading(false);
    }
  }, [setupAuthenticatedState, isMockMode]);

  const login = useCallback(() => {
    if (isMockMode) {
      setIsAuthenticated(true);
      setUser({ name: 'Mock User', email: 'test@test.it' });
      setToken('mock-token');
      return;
    }

    keycloakServiceRef.current?.login();
  }, [isMockMode]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    keycloakServiceRef.current?.logout();
  }, []);

  const getToken = useCallback(async (): Promise<string | null> => {
    if (!keycloakServiceRef.current) return null;
    return keycloakServiceRef.current.getValidToken();
  }, []);

  useEffect(() => {
    void initAuth();
  }, [initAuth]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      token,
      loading,
      initAuth,
      login,
      logout,
      getToken,
    }),
    [isAuthenticated, user, token, loading, initAuth, login, logout, getToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside the AuthProvider');
  return ctx;
};