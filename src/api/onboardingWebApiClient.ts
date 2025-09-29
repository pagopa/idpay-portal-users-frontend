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

export const commonHeaders = {
  'X-Api-Version': 'v1',
  'Accept-Language': 'it-IT'
};

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
  fetchApi: buildFetchApiWithLoading(),
  withDefaults: withBearer,
});

const isCodeEnum = (v: unknown): v is CodeEnum =>
  typeof v === "string" && (Object.values(CodeEnum) as string[]).includes(v);

export const OnboardingWebApi = {
  getStatus: async (
    initiativeId: string
  ): Promise<{ status: number; data: OnboardingStatusDTO | OnboardingErrorDTO }> => {
    const result = await onboardingClient.onboardingStatus({
      initiativeId,
      ...commonHeaders
    });

    if (isRight(result)) {
      const { status, value } = result.right;
      if (status === 200) return { status: 200, data: value as OnboardingStatusDTO };
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
    params: Omit<RequestParams<SaveOnboardingT>, 'bearerAuth'>
  ): Promise<{ status: number; value: unknown }> => {
    const result = await onboardingClient.saveOnboarding({
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
  ): Promise<{ status: number; data: TransactionBarCodeResponse }> => {
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
};
