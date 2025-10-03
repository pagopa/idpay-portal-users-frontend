import { buildFetchApi } from '@pagopa/selfcare-common-frontend/lib/utils/api-utils';
import { loadingRef } from '../utils/loadingOverlay';

export const buildFetchApiWithLoading = (showLoader: boolean) => {
  const originalFetch = buildFetchApi();

  return async (input: RequestInfo | URL, init?: RequestInit) => {
    if (showLoader) loadingRef.setLoading(true);
    try {
      const res = await originalFetch(input, init);
      if (res.status === 429) throw res;
      return res;
    } finally {
      if (showLoader) loadingRef.setLoading(false);
    }
  };
};
