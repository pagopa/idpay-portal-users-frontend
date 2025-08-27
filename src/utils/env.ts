export const isMockAuthEnabled = (): boolean =>
  (import.meta as any).env?.VITE_KEYCLOAK_MOCK_AUTH === 'true';