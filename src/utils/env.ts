import type { LoginMethod } from '../types/auth';

const getEnvValue = (key: keyof ImportMetaEnv): string | undefined => {
  const value = import.meta.env[key];

  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

const keycloakIdpHints: Record<LoginMethod, { envKey: keyof ImportMetaEnv; fallback: string }> = {
  'spid-cie': {
    envKey: 'VITE_KEYCLOAK_SPID_CIE_IDP_HINT',
    fallback: 'oneid-keycloak',
  },
  'it-wallet': {
    envKey: 'VITE_KEYCLOAK_IT_WALLET_IDP_HINT',
    fallback: 'it-wallet',
  },
};

export const isMockAuthEnabled = (): boolean =>
  getEnvValue('VITE_KEYCLOAK_MOCK_AUTH') === 'true';

// Feature flag to show/hide IT Wallet buttons.
export const isItWalletEnabled = (): boolean =>
  getEnvValue('VITE_IT_WALLET_ENABLED') === 'true';

export const getKeycloakIdpHint = (method: LoginMethod): string => {
  const { envKey, fallback } = keycloakIdpHints[method];
  return getEnvValue(envKey) ?? fallback;
};

export const getInitiativeId = (): string =>
  import.meta.env.VITE_INITIATIVE_ID as string;

export const getBaseUrl = (): string =>
  import.meta.env.VITE_BASE_URL as string;

export const getItWalletDeepLink = (): string =>
  getEnvValue('VITE_IT_WALLET_DEEPLINK') ?? '';
