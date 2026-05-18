/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL?: string;
  readonly VITE_IT_WALLET_ENABLED?: string;
  readonly VITE_INITIATIVE_ID?: string;
  readonly VITE_KEYCLOAK_CLIENT_ID: string;
  readonly VITE_KEYCLOAK_IT_WALLET_IDP_HINT?: string;
  readonly VITE_KEYCLOAK_MOCK_AUTH?: string;
  readonly VITE_KEYCLOAK_REALM: string;
  readonly VITE_KEYCLOAK_SPID_CIE_IDP_HINT?: string;
  readonly VITE_KEYCLOAK_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
