import keycloak from '../config/keycloak';
import ROUTES from '../routes';
import { UserProfile } from '../types/auth';
import { createTokenManager } from '../utils/tokenManager';

export type KeycloakService = {
  initialize: () => Promise<boolean>;
  loadUserProfile: () => Promise<UserProfile | null>;
  login: () => void;
  logout: () => void;
  getCurrentToken: () => string | null;
  getValidToken: () => Promise<string | null>;
  isAuthenticated: () => boolean;
  startTokenRefresh: () => void;
  saveToken: (token: string | null) => void;
  cleanup: () => void;
};

export function createKeycloakService(
  onTokenUpdate: (token: string | null) => void,
  onAuthError: () => void
): KeycloakService {
  const isMockMode = import.meta.env.VITE_KEYCLOAK_MOCK_AUTH === 'true';

  const basePath =
    ((import.meta.env.BASE_URL || '/').replace(/\/+$/, '') as string) || '/';

  const buildFullUrl = (path: string) => `${window.location.origin}${basePath}${path}`;

  const tokenManager = createTokenManager(keycloak, onTokenUpdate, onAuthError);

  const initialize = async (): Promise<boolean> => {
    if (isMockMode) return true;

    try {
      const savedToken = tokenManager.getSavedToken();
      const useBootstrap = tokenManager.isTokenValid(savedToken);

      const authenticated = await keycloak.init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        checkLoginIframe: false,
        silentCheckSsoFallback: false,
        silentCheckSsoRedirectUri: buildFullUrl('/silent-check-sso.html'),
        ...(useBootstrap && savedToken ? { token: savedToken } : {}),
      });

      return !!authenticated;
    } catch (error) {
      console.error('Keycloak initialization failed:', error);
      return false;
    }
  };

  const loadUserProfile = async (): Promise<UserProfile | null> => {
    if (isMockMode) {
      return { name: 'Mock User', email: 'test@test.it' };
    }
    try {
      const profile = await keycloak.loadUserProfile();
      return profile as UserProfile;
    } catch (error) {
      console.error('Failed to load user profile:', error);
      return null;
    }
  };

  const login = (): void => {
    if (isMockMode) return;
    keycloak.login({
      idpHint: 'oneid-keycloak',
      redirectUri: buildFullUrl(ROUTES.GATEWAY),
    });
  };

  const logout = (): void => {
    tokenManager.cleanup();
    if (!isMockMode) {
      keycloak.logout({
        redirectUri: buildFullUrl(ROUTES.HOME),
      });
    }
  };

  const getCurrentToken = (): string | null => {
    if (isMockMode) return 'mock-token';
    return keycloak.token || null;
  };

  const getValidToken = async (): Promise<string | null> => {
    if (isMockMode) return 'mock-token';
    if (!keycloak.authenticated) return null;
    return tokenManager.forceRefreshToken();
  };

  const isAuthenticated = (): boolean => {
    if (isMockMode) return true;
    return !!keycloak.authenticated;
  };

  const startTokenRefresh = (): void => {
    if (!isMockMode) tokenManager.scheduleTokenRefresh();
  };

  const saveToken = (token: string | null): void => {
    tokenManager.saveToken(token);
  };

  const cleanup = (): void => {
    tokenManager.cleanup();
  };

  return {
    initialize,
    loadUserProfile,
    login,
    logout,
    getCurrentToken,
    getValidToken,
    isAuthenticated,
    startTokenRefresh,
    saveToken,
    cleanup,
  };
}