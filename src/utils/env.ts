export const isMockAuthEnabled = (): boolean =>
  (import.meta as any).env?.VITE_KEYCLOAK_MOCK_AUTH === 'true';

export const getInitiativeId = (): string => 
  (import.meta as any).env?.VITE_INITIATIVE_ID as string;