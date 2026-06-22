import { isRight } from 'fp-ts/Either';

import { createClient } from './generated/it-wallet-payment/client';
import { TimelineDTO } from './generated/it-wallet-payment/TimelineDTO';
import { buildFetchApiWithLoading } from './buildFetchApiWithLoading';

const baseUrl = import.meta.env.VITE_URL_API_PORTAL_USERS;

export const itWalletPaymentApiClient = createClient({
  baseUrl,
  basePath: 'it-wallet-payment',
  fetchApi: buildFetchApiWithLoading(false),
});

export const commonHeaders = {
  'X-Api-Version': 'v1',
  'Accept-Language': 'it-IT',
};

export const ItWalletPaymentApi = {
  timeline: async (
    initiativeId: string,
    fiscalCode: string,
    page = 0,
    size = 10
  ): Promise<{ status: number; data: TimelineDTO }> => {
    const result = await itWalletPaymentApiClient.getItWalletPaymentTimeline({
      initiativeId,
      page,
      size,
      'X-Fiscal-Code': fiscalCode,
      ...commonHeaders,
    });

    if (isRight(result)) {
      const { status, value } = result.right;

      if (status === 200) {
        return { status, data: value as TimelineDTO };
      }

      throw new Error(`Unexpected status: ${status}`);
    }

    console.error('Timeline decoder error', result.left);
    throw result.left;
  },
};