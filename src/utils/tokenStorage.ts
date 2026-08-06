import { storageOpsBuilder } from '@pagopa/selfcare-common-frontend/lib/utils/storage-utils';

const tokenStorageKey = [
  'token',
  import.meta.env.VITE_KEYCLOAK_REALM,
  import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
].join(':');

export const portalTokenStorage = storageOpsBuilder<string>(
  tokenStorageKey,
  'string',
  true
);
