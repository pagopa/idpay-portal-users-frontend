import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';

const TOKEN_REFRESH_BEFORE_EXPIRY_SECONDS = 70;

export class TokenManager {
  private refreshTimer: number | null = null;

  constructor(
    private keycloak: any,
    private onTokenUpdate: (token: string | null) => void,
    private onAuthError: () => void
  ) {}

  saveToken(token: string | null): void {
    if (token) {
      storageTokenOps.write(token);
    } else {
      storageTokenOps.delete();
    }
  }

  getSavedToken(): string | null {
    return storageTokenOps.read();
  }

  isTokenValid(token?: string | null): boolean {
    if (!token || token.split('.').length !== 3) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const now = Date.now();
      const bufferTime = 30 * 1000;
      
      return expirationTime > (now + bufferTime);
    } catch {
      return false;
    }
  }

  scheduleTokenRefresh(): void {
    this.clearRefreshTimer();
    
    if (!this.keycloak.tokenParsed?.exp) return;

    const expirationTime = this.keycloak.tokenParsed.exp * 1000;
    const now = Date.now();
    const refreshTime = expirationTime - now - (TOKEN_REFRESH_BEFORE_EXPIRY_SECONDS * 1000);
    const timeUntilRefresh = Math.max(refreshTime, 5000);

    this.refreshTimer = window.setTimeout(() => {
      this.refreshToken();
    }, timeUntilRefresh);
  }

  private async refreshToken(): Promise<void> {
    try {
      const refreshed = await this.keycloak.updateToken(TOKEN_REFRESH_BEFORE_EXPIRY_SECONDS);
      
      if (refreshed && this.keycloak.token) {
        this.onTokenUpdate(this.keycloak.token);
        this.saveToken(this.keycloak.token);
        this.scheduleTokenRefresh();
      }
    } catch (error) {
      console.warn('Token refresh failed:', error);
      this.onAuthError();
    }
  }

  async forceRefreshToken(): Promise<string | null> {
    try {
      const refreshed = await this.keycloak.updateToken(TOKEN_REFRESH_BEFORE_EXPIRY_SECONDS);
      
      if (refreshed && this.keycloak.token) {
        this.onTokenUpdate(this.keycloak.token);
        this.saveToken(this.keycloak.token);
      }
      
      return this.keycloak.token || null;
    } catch {
      return null;
    }
  }

  clearRefreshTimer(): void {
    if (this.refreshTimer) {
      window.clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  cleanup(): void {
    this.clearRefreshTimer();
    this.saveToken(null);
  }
}