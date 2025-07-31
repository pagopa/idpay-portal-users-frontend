import { buildFetchApi, extractResponse } from '@pagopa/selfcare-common-frontend/lib/utils/api-utils';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { createClient, WithDefaultsT } from './generated/onboarding-web/client';

import { InitiativeDTO } from './generated/onboarding-web/InitiativeDTO';
import { WebOnboardingStatusT, WebSaveOnboardingT } from './generated/onboarding-web/requestTypes';
import { RequestParams } from '@pagopa/ts-commons/lib/requests';

export const commonHeaders = {
  'X-Api-Version': 'v1',
  'Accept-Language': 'it-IT'
};

const onRedirectToLogin = () => '/'; //TODO add redirectLogin

const withBearer: WithDefaultsT<'bearerAuth'> = (wrappedOperation) => (params: any) => {
  const token = storageTokenOps.read();
  return wrappedOperation({
    ...params,
    bearerAuth: `Bearer ${token}`
  });
};

const onboardingClient = createClient({
  baseUrl: 'https://api-io.dev.cstar.pagopa.it/idpay-itn/onboarding/web', //TODO add baseUrl path
  basePath: '',
  fetchApi: buildFetchApi(),
  withDefaults: withBearer,
});

export const OnboardingWebApi = {
  getStatus: async (initiativeId: string): Promise<WebOnboardingStatusT> => {
    try {
      const result = await onboardingClient.webOnboardingStatus({
        initiativeId,
        ...commonHeaders
      });
      return extractResponse(result, 200, onRedirectToLogin);
    } catch (error) {
      console.error('Test api errore ', error);
      throw error;
    }
  },

  getDetail: async (initiativeId: string): Promise<InitiativeDTO> => {
    const result = await onboardingClient.webInitiativeDetail({
      initiativeId,
      ...commonHeaders
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  save: async (
    params: Omit<RequestParams<WebSaveOnboardingT>, 'bearerAuth'>
  ): Promise<void> => {
    const result = await onboardingClient.webSaveOnboarding({
      ...params,
      ...commonHeaders
    });
    return extractResponse(result, 200, onRedirectToLogin);
  }
};
