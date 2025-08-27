import keycloak from '../config/keycloak';
import ROUTES from '../routes';
import { UserProfile } from '../types/auth';
import { TokenManager } from '../utils/tokenManager';

export class KeycloakService {
  private tokenManager: TokenManager;
  private isMockMode: boolean;
  
  constructor(
    onTokenUpdate: (token: string | null) => void,
    onAuthError: () => void
  ) {
    this.isMockMode = import.meta.env.VITE_KEYCLOAK_MOCK_AUTH === 'true';
    this.tokenManager = new TokenManager(keycloak, onTokenUpdate, onAuthError);
  }

  async initialize(): Promise<boolean> {
    if (this.isMockMode) return true;

    try {
      const savedToken = this.tokenManager.getSavedToken();
      const useBootstrap = this.tokenManager.isTokenValid(savedToken);

      const authenticated = await keycloak.init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: `${window.location.origin}/utente/silent-check-sso.html`,
        ...(useBootstrap && savedToken ? { token: savedToken } : {}),
      });

      return !!authenticated;
    } catch (error) {
      console.error('Keycloak initialization failed:', error);
      return false;
    }
  }

  async loadUserProfile(): Promise<UserProfile | null> {
    if (this.isMockMode) {
      return { name: 'Mock User', email: 'test@test.it' };
    }

    try {
      const profile = await keycloak.loadUserProfile();
      return profile as UserProfile;
    } catch (error) {
      console.error('Failed to load user profile:', error);
      return null;
    }
  }

  login(): void {
    if (this.isMockMode) return;

    keycloak.login({
      idpHint: 'oneid-keycloak',
      redirectUri: `${window.location.origin}${ROUTES.TOS}`,
    });
  }

  logout(): void {
    this.tokenManager.cleanup();
    
    if (!this.isMockMode) {
      keycloak.logout({
        redirectUri: `${window.location.origin}${ROUTES.HOME}`,
      });
    }
  }

  getCurrentToken(): string | null {
    if (this.isMockMode) return 'mock-token';
    return keycloak.token || null;
  }

  async getValidToken(): Promise<string | null> {
    if (this.isMockMode) return 'mock-token';
    if (!keycloak.authenticated) return null;
    
    return this.tokenManager.forceRefreshToken();
  }

  isAuthenticated(): boolean {
    if (this.isMockMode) return true;
    return !!keycloak.authenticated;
  }

  startTokenRefresh(): void {
    if (!this.isMockMode) {
      this.tokenManager.scheduleTokenRefresh();
    }
  }

  saveToken(token: string | null): void {
    this.tokenManager.saveToken(token);
  }

  cleanup(): void {
    this.tokenManager.cleanup();
  }
}