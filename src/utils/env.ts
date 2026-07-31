export const isMockAuthEnabled = (): boolean =>
  (import.meta as any).env?.VITE_KEYCLOAK_MOCK_AUTH === 'true';

export const getInitiativeId = (): string =>
  (import.meta as any).env?.VITE_INITIATIVE_ID as string;

export const getInitiative = (): string =>
  (import.meta as any).env?.VITE_INITIATIVE as string;

export const getBaseUrl = (): string =>
  (import.meta as any).env?.VITE_BASE_URL as string;

export const getPortalBasePath = (): string => {
  const basePath = ((import.meta as any).env?.BASE_URL as string) || '/utente/';
  return basePath.replace(/\/+$/, '');
};

export const getPortalUrl = (path: string): string =>
  `${getBaseUrl()}${getPortalBasePath()}${path}`;