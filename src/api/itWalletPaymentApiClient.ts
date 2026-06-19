import { createClient } from './generated/it-wallet-payment/client';
import { buildFetchApiWithLoading } from './buildFetchApiWithLoading';
import { isRight } from 'fp-ts/Either';
import { TimelineDTO } from './generated/it-wallet-payment/TimelineDTO';
import { TimelineErrorDTO } from './generated/it-wallet-payment/TimelineErrorDTO';

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
    fiscalCode: string
  ): Promise<{ status: number; data: TimelineDTO | TimelineErrorDTO}> => {
    const result = await itWalletPaymentApiClient.getItWalletPaymentTimeline({
      initiativeId,
      page: 0,
      size: 10,
      'X-Fiscal-Code': fiscalCode,
      ...commonHeaders,
    });

    if (isRight(result)) {
      const { status, value } = result.right;

      if (status === 200) {
        return { status: 200, data: value as TimelineDTO }
      }

      throw new Error(`Unexpected status: ${status}`);
    }
    /*
    else{
      const leftItem = result.left?.[0];
      const contexts = leftItem?.context ?? [];

      const valid = contexts.find(
        (c: any) => c?.actual?.operationList
      );

      if ((valid?.actual as TimelineDTO)?.operationList) {
        return { status: 200, data: valid?.actual as TimelineDTO };
      }
      throw result.left;
    }*/

    throw result.left;
  },
};


/*
const itWalletPaymentApiClientLoader = createClient({
  baseUrl: baseUrl,
  basePath: 'web',
  fetchApi: buildFetchApiWithLoading(true),

});

const itWalletPaymentApiClientNoLoader = createClient({
  baseUrl: baseUrl,
  fetchApi: buildFetchApiWithLoading(false),
});
*/