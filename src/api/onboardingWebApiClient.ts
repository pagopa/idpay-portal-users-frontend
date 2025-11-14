import { extractResponse } from '@pagopa/selfcare-common-frontend/lib/utils/api-utils';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { createClient, WithDefaultsT } from './generated/onboarding-web/client';

import { InitiativeDTO } from './generated/onboarding-web/InitiativeDTO';
import { SaveOnboardingT } from './generated/onboarding-web/requestTypes';
import { RequestParams } from '@pagopa/ts-commons/lib/requests';
import { OnboardingStatusDTO } from './generated/onboarding-web/OnboardingStatusDTO';
import { CodeEnum, OnboardingErrorDTO } from './generated/onboarding-web/OnboardingErrorDTO';
import { isRight } from 'fp-ts/Either';
import { buildFetchApiWithLoading } from './buildFetchApiWithLoading';
import { TransactionBarCodeResponse } from './generated/onboarding-web/TransactionBarCodeResponse';
import { OnboardingInitiativeDTO } from './generated/onboarding-web/OnboardingInitiativeDTO';
import { ReportDTO } from './generated/onboarding-web/ReportDTO';
import { TimelineDTO } from './generated/onboarding-web/TimelineDTO';
import { TimelineErrorDTO } from './generated/onboarding-web/TimelineErrorDTO';
import { OperationDTO } from './generated/onboarding-web/OperationDTO';
import { SupportRequestDTO } from './generated/onboarding-web/SupportRequestDTO';
import { SupportResponseDTO } from './generated/onboarding-web/SupportResponseDTO';
import { SupportErrorDTO } from './generated/onboarding-web/SupportErrorDTO';

export const commonHeaders = {
  'X-Api-Version': 'v1',
  'Accept-Language': 'it-IT'
};

type SaveNoLoader = { showLoader?: boolean };

const onRedirectToLogin = () => '/'; // TODO: implement real redirect

const withBearer: WithDefaultsT<'bearerAuth'> = (wrappedOperation) => (params: any) => {
  const token = storageTokenOps.read();
  return wrappedOperation({
    ...params,
    bearerAuth: `Bearer ${token}`
  });
};

const onboardingClient = createClient({
  baseUrl: import.meta.env.VITE_URL_API_PORTAL_USERS,
  basePath: 'web',
  fetchApi: buildFetchApiWithLoading(true),
  withDefaults: withBearer,
});

const onboardingClientNoLoader = createClient({
  baseUrl: import.meta.env.VITE_URL_API_PORTAL_USERS,
  basePath: 'web',
  fetchApi: buildFetchApiWithLoading(false),
  withDefaults: withBearer,
});

const isCodeEnum = (v: unknown): v is CodeEnum =>
  typeof v === "string" && (Object.values(CodeEnum) as string[]).includes(v);

export const OnboardingWebApi = {
  getStatus: async (
    initiativeId: string, opts?: SaveNoLoader
  ): Promise<{ status: number; data: OnboardingStatusDTO | OnboardingErrorDTO }> => {
    const client = opts?.showLoader === false
      ? onboardingClientNoLoader
      : onboardingClient;

    const result = await client.onboardingStatus({
      initiativeId,
      ...commonHeaders
    });

    if (isRight(result)) {
      const { status, value } = result.right;
      if (status === 200) return { status: 200, data: value as OnboardingStatusDTO };
      if (status === 400) return { status: 400, data: value as OnboardingErrorDTO };
      if (status === 404) return { status: 404, data: value as OnboardingErrorDTO };
      throw new Error(`Unexpected status: ${status}`);
    } else {
      const codeStr =
        (result.left as any)?.at?.(0)?.value ??
        (result.left as any)?.at?.(0)?.actual;

      if (isCodeEnum(codeStr) || isCodeEnum("ONBOARDING_" + codeStr)) {
        return {
          status: 200,
          data: {
            code: codeStr as CodeEnum,
            message: "",
          } as OnboardingErrorDTO,
        };
      }

      throw result.left;
    }
  },

  getDetail: async (initiativeId: string): Promise<OnboardingInitiativeDTO> => {
    const result = await onboardingClient.initiativeDetail({
      initiativeId,
      ...commonHeaders
    });
    return await extractResponse<OnboardingInitiativeDTO>(result, 200, onRedirectToLogin);
  },


  save: async (
    params: Omit<RequestParams<SaveOnboardingT>, 'bearerAuth'>, opts?: SaveNoLoader
  ): Promise<{ status: number; value: unknown; isLoading?: boolean }> => {
     const client = opts?.showLoader === false
      ? onboardingClientNoLoader
      : onboardingClient;

    const result = await client.saveOnboarding({
      ...params,
      ...commonHeaders
    });

    if (isRight(result)) {
      return result.right;
    } else {
      throw result.left;
    }
  },

  getBarCode: async (
    initiativeId: string
  ): Promise<{ status: number; data: TransactionBarCodeResponse | null }> => {
    const result = await onboardingClient.retrievectiveBarCodeTransaction({
      initiativeId,
      ...commonHeaders
    });

    if (isRight(result)) {
      const { status, value } = result.right;
      if (status === 200) return { status: 200, data: value as TransactionBarCodeResponse };
      throw new Error(`Unexpected status: ${status}`);
    }

    const leftItem = result.left?.[0];
    const contexts = leftItem?.context ?? [];
    const actualValue = contexts.find((c: any) => c.key === '')?.actual;
    if (actualValue && typeof actualValue === 'object' && Object.keys(actualValue).length === 0) {
      return { status: 200, data: null };
    }

    const valid = contexts.find(
      (c: any) => c?.actual?.trxCode && c?.actual?.trxCode.trim() !== ''
    );
    if (valid?.actual) return { status: 200, data: valid.actual as TransactionBarCodeResponse };
    throw result.left;
  },

  getBonusDetail: async (
    initiativeId: string
  ): Promise<{ status: number; data: InitiativeDTO }> => {
    const result = await onboardingClient.getWalletDetail({
      initiativeId,
      ...commonHeaders
    });

    if (isRight(result)) {
      const { status, value } = result.right;
      if (status === 200) return { status: 200, data: value as InitiativeDTO };
      throw new Error(`Unexpected status: ${status}`);
    } else {
      const leftItem = result.left?.[0];
      const contexts = leftItem?.context ?? [];

      const valid = contexts.find(
        (c: any) =>
          (c?.actual?.voucherStatus === "EXPIRED" || c?.actual?.voucherStatus === "USED"
            || c?.actual?.voucherStatus === "ACTIVE" || c?.actual?.voucherStatus === "EXPIRING") &&
          c?.actual?.voucherStartDate && c?.actual?.voucherEndDate
      );

      if (valid?.actual) return { status: 200, data: valid.actual as InitiativeDTO };
      throw result.left;
    }
  },

  downloadPDF: async (
    initiativeId: string,
    trxCode: string,
  ): Promise<{ status: number; data: ReportDTO}> => {
    const result = await onboardingClient.getTransactionPdf({
      initiativeId,
      trxCode,
      ...commonHeaders,
    });

    if (isRight(result)) {
      const { status, value } = result.right;
      if (status === 200){ 
        return { status: 200, data: value as ReportDTO }
      };
      throw new Error(`Unexpected status: ${status}`);
    }
    throw result.left;
  },

  timeline: async (
    initiativeId: string,
  ): Promise<{ status: number; data: TimelineDTO | TimelineErrorDTO}> => {
    const result = await onboardingClientNoLoader.getTimeline({
      initiativeId,
      size: 10,
      ...commonHeaders,
    });

    if (isRight(result)) {
      const { status, value } = result.right;
      if (status === 200){ 
        return { status: 200, data: value as TimelineDTO }
      };
      throw new Error(`Unexpected status: ${status}`);
    }else{
      const leftItem = result.left?.[0];
      const contexts = leftItem?.context ?? [];

      const valid = contexts.find(
        (c: any) => c?.actual?.operationList
      );

      if ((valid?.actual as TimelineDTO)?.operationList) {
        return { status: 200, data: valid?.actual as TimelineDTO };
      }
      throw result.left;
    }
  },

  timelineDetail: async (
    initiativeId: string,
    operationId: string,
  ): Promise<{ status: number; data: OperationDTO}> => {
    const result = await onboardingClientNoLoader.getTimelineDetail({
      initiativeId,
      operationId,
      ...commonHeaders,
    });

    if (isRight(result)) {
      const { status, value } = result.right;
      if (status === 200){ 
        return { status: 200, data: value as OperationDTO }
      };
      throw new Error(`Unexpected status: ${status}`);
    }else{
      const leftItem = result.left?.[0];
      const contexts = leftItem?.context ?? [];

      const valid = contexts.find(
        (c: any) => c?.actual?.operationStatus
      );

      if (valid?.actual) return { status: 200, data: valid?.actual as OperationDTO };
      throw result.left;
    }
  },
  support: async (
      body: SupportRequestDTO,
      opts?: SaveNoLoader
  ): Promise<{ status: number; data: SupportResponseDTO | SupportErrorDTO }> => {
    const client = opts?.showLoader === false ? onboardingClientNoLoader : onboardingClient;

    const result = await client.buildZendeskJwt({
      body,
      ...commonHeaders,
    });

    if (isRight(result)) {
      const { status, value } = result.right;
      if (status === 200) return { status: 200, data: value as SupportResponseDTO };
      if (status === 400) return { status: 400, data: value as SupportErrorDTO };
      if (status === 401) return { status: 401, data: value as SupportErrorDTO };
      if (status === 429) return { status: 429, data: value as SupportErrorDTO };
      if (status === 500) return { status: 500, data: value as SupportErrorDTO };
      throw new Error(`Unexpected status: ${status}`);
    } else {
      throw result.left;
    }
  },
};