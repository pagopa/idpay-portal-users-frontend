import { buildFetchApi } from '@pagopa/selfcare-common-frontend/lib/utils/api-utils';
import { loadingRef } from '../utils/loadingOverlay';

export const buildFetchApiWithLoading = () => {
  const originalFetch = buildFetchApi();

  return async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      loadingRef.setLoading(true);
      return await originalFetch(input, init);
    } finally {
      loadingRef.setLoading(false);
    }
  };
};
