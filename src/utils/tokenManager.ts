import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';

const TOKEN_REFRESH_BEFORE_EXPIRY_SECONDS = 70;

export const isStorageTokenExpired = () => {
  const storageToken = storageTokenOps.read();
  if (!storageToken) return false;
  try {
    const [, payload] = storageToken.split('.');
    const { exp } = JSON.parse(atob(payload));
    if (typeof exp !== 'number') return false;
    const now = Math.floor(Date.now() / 1000);
    return now >= exp;
  } catch {
    return false;
  }
};

export type TokenManager = {
  saveToken: (token: string | null) => void;
  getSavedToken: () => string | null;
  isTokenValid: (token?: string | null) => boolean;
  scheduleTokenRefresh: () => void;
  forceRefreshToken: () => Promise<string | null>;
  clearRefreshTimer: () => void;
  cleanup: () => void;
};

export function createTokenManager(
  keycloak: any,
  onTokenUpdate: (token: string | null) => void,
  onAuthError: () => void
): TokenManager {
  let refreshTimer: number | null = null;

  const saveToken = (token: string | null): void => {
    if (token) {
      storageTokenOps.write(token);
    } else {
      storageTokenOps.delete();
    }
  };

  const getSavedToken = (): string | null => {
    return storageTokenOps.read();
  };

  const isTokenValid = (token?: string | null): boolean => {
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
  };

  const clearRefreshTimer = (): void => {
    if (refreshTimer) {
      window.clearTimeout(refreshTimer);
      refreshTimer = null;
    }
  };

  const scheduleTokenRefresh = (): void => {
    clearRefreshTimer();

    if (!keycloak.tokenParsed?.exp) return;

    const expirationTime = keycloak.tokenParsed.exp * 1000;
    const now = Date.now();
    const refreshTime =
      expirationTime - now - TOKEN_REFRESH_BEFORE_EXPIRY_SECONDS * 1000;

    const timeUntilRefresh = Math.max(refreshTime, 5000);

    refreshTimer = window.setTimeout(() => {
      void refreshToken();
    }, timeUntilRefresh);
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const refreshed = await keycloak.updateToken(
        TOKEN_REFRESH_BEFORE_EXPIRY_SECONDS
      );

      if (refreshed && keycloak.token) {
        onTokenUpdate(keycloak.token);
        saveToken(keycloak.token);
        scheduleTokenRefresh();
      }
    } catch (error) {
      console.warn('Token refresh failed:', error);
      onAuthError();
    }
  };

  const forceRefreshToken = async (): Promise<string | null> => {
    try {
      const refreshed = await keycloak.updateToken(
        TOKEN_REFRESH_BEFORE_EXPIRY_SECONDS
      );

      if (refreshed && keycloak.token) {
        onTokenUpdate(keycloak.token);
        saveToken(keycloak.token);
      }

      return keycloak.token || null;
    } catch {
      return null;
    }
  };

  const cleanup = (): void => {
    clearRefreshTimer();
    saveToken(null);
  };

  return {
    saveToken,
    getSavedToken,
    isTokenValid,
    scheduleTokenRefresh,
    forceRefreshToken,
    clearRefreshTimer,
    cleanup,
  };
}