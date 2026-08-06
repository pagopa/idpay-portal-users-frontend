import { storageOpsBuilder } from '@pagopa/selfcare-common-frontend/lib/utils/storage-utils';

const tokenStorageKey = `token_${import.meta.env.VITE_KEYCLOAK_CLIENT_ID}`;

export const portalTokenStorage = storageOpsBuilder<string>(
  tokenStorageKey,
  'string',
  true
);
