import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { buildFetchApiWithLoading } from './buildFetchApiWithLoading';
import {
  Api,
  InitiativeDTO,
  OnboardingDTO,
  OnboardingErrorDTO,
  OnboardingErrorDtoCodeEnum,
  OnboardingInitiativeDTO,
  OnboardingStatusDTO,
  OnboardingStatusDtoStatusEnum,
  OperationDTO,
  ReportDTO,
  SupportErrorDTO,
  SupportRequestDTO,
  SupportResponseDTO,
  TimelineDTO,
  TimelineErrorDTO,
  TransactionBarCodeResponse,
  UserOnboardingStatusDtoStatusEnum
} from './generated/onboarding-web/api';

type SaveNoLoader = { showLoader?: boolean };

const onRedirectToLogin = () => '/'; // TODO: implement real redirect

const createCustomFetch = (showLoader: boolean) => {
  const baseFetch = buildFetchApiWithLoading(showLoader);

  return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const token = storageTokenOps.read();
    const headers = {
      'X-Api-Version': 'v1',
      'Accept-Language': 'it-IT',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...init?.headers
    }
    return baseFetch(input, { ...init, headers });
  };
};

const onboardingClient = new Api({
  baseUrl: `${import.meta.env.VITE_URL_API_PORTAL_USERS}/web`,
  customFetch: createCustomFetch(true),
});

const onboardingClientNoLoader = new Api({
  baseUrl: `${import.meta.env.VITE_URL_API_PORTAL_USERS}/web`,
  customFetch: createCustomFetch(false),
});
const isCodeEnum = (v: unknown): v is OnboardingErrorDtoCodeEnum | UserOnboardingStatusDtoStatusEnum | OnboardingStatusDtoStatusEnum =>
  typeof v === "string" && (Object.values({ ...OnboardingErrorDtoCodeEnum, ...UserOnboardingStatusDtoStatusEnum, ...OnboardingStatusDtoStatusEnum }) as string[]).includes(v);

export const OnboardingWebApi = {
  getStatus: async (
    initiativeId: string,
    opts?: SaveNoLoader
  ): Promise<{ status: number; data: OnboardingStatusDTO | OnboardingErrorDTO }> => {
    const client = opts?.showLoader === false ? onboardingClientNoLoader : onboardingClient;
    return await client.onboarding.onboardingStatus(initiativeId).catch((error) => {
      const code = error?.response?.code || error?.code;
      if (isCodeEnum(code) || isCodeEnum("ONBOARDING_" + code)) {
        return {
          status: 200,
          data: {
            code: code,
            message: "",
          },
        };
      }
      throw error;
    })
  },

  getDetail: async (initiativeId: string): Promise<OnboardingInitiativeDTO> => {
    return await onboardingClient.onboarding.initiativeDetail(initiativeId)
      .then((res) => res.data)
      .catch((error) => {
        const status = error?.status || error?.response?.status;
        if (status === 401) {
          window.location.assign(onRedirectToLogin());
        }
        throw error;
      });
  },

  save: async (
    params: OnboardingDTO,
    opts?: SaveNoLoader
  ): Promise<void | OnboardingErrorDTO> => {
    const client = opts?.showLoader === false ? onboardingClientNoLoader : onboardingClient;
    return await client.onboarding.saveOnboarding(params).then((res) => res.data)
  },

  getBarCode: async (
    initiativeId: string
  ): Promise<{ status: number; data: TransactionBarCodeResponse | null }> => {
    const result = await onboardingClient.payment.retrievectiveBarCodeTransaction(initiativeId);
    if (result.data && typeof result.data === 'object' && Object.keys(result.data).length === 0) {
      return { status: 200, data: null };
    }
    return result;
  },

  getBonusDetail: (initiativeId: string): Promise<{ status: number; data: InitiativeDTO }> =>
    onboardingClient.wallet.getWalletDetail(initiativeId),

  downloadPDF: (initiativeId: string, trxCode: string): Promise<{ status: number; data: ReportDTO }> =>
    onboardingClient.payment.getTransactionPdf(initiativeId, trxCode),

  timeline: (initiativeId: string): Promise<{ status: number; data: TimelineDTO | TimelineErrorDTO }> =>
    onboardingClientNoLoader.timeline.getTimeline(initiativeId, { size: 10 }),

  timelineDetail: (initiativeId: string, operationId: string): Promise<{ status: number; data: OperationDTO }> =>
    onboardingClientNoLoader.timeline.getTimelineDetail(initiativeId, operationId),

  support: async (
    body: SupportRequestDTO,
    opts?: SaveNoLoader
  ): Promise<{ status: number; data: SupportResponseDTO | SupportErrorDTO }> => {
    const client = opts?.showLoader === false ? onboardingClientNoLoader : onboardingClient;
    return await client.wallet.buildZendeskJwt(body);
  },
};