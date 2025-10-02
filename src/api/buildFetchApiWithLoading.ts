import { buildFetchApi } from '@pagopa/selfcare-common-frontend/lib/utils/api-utils';
import { loadingRef } from '../utils/loadingOverlay';

export const buildFetchApiWithLoading = () => {
  const originalFetch = buildFetchApi();

  return async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      loadingRef.setLoading(true);
      const res = await originalFetch(input, init);
      if (res.status === 429) {
        throw res;
      }
      return res;
    } finally {
      loadingRef.setLoading(false);
    }
  };
};
