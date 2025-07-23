import i18n from '@pagopa/selfcare-common-frontend/lib/locale/locale-utils';
import {
  buildFetchApi,
  extractResponse,
} from '@pagopa/selfcare-common-frontend/lib/utils/api-utils';
import { appStateActions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/appStateSlice';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { store } from '../redux/store';
import { ENV } from '../utils/env';
import { createClient, WithDefaultsT } from './generated/register/client';
import { UserPermissionDTO } from './generated/register/UserPermissionDTO';
import { PortalConsentDTO } from './generated/register/PortalConsentDTO';
import { UploadsListDTO } from './generated/register/UploadsListDTO';
import { BatchList } from './generated/register/BatchList';
import { RegisterUploadResponseDTO } from './generated/register/RegisterUploadResponseDTO';
import { CsvDTO } from './generated/register/CsvDTO';
import {InstitutionsResponse} from "./generated/register/InstitutionsResponse";

const withBearerAndPartyId: WithDefaultsT<'Bearer'> = (wrappedOperation) => (params: any) => {
  const token = storageTokenOps.read();
  return wrappedOperation({
    ...params,
    Bearer: `Bearer ${token}`,
  });
};

const registerClient = createClient({
  baseUrl: ENV.URL_API.OPERATION,
  basePath: '',
  fetchApi: buildFetchApi(ENV.API_TIMEOUT_MS.OPERATION),
  withDefaults: withBearerAndPartyId,
});

const onRedirectToLogin = () =>
  store.dispatch(
    appStateActions.addError({
      id: 'tokenNotValid',
      error: new Error(),
      techDescription: 'token expired or not valid',
      toNotify: false,
      blocking: false,
      displayableTitle: i18n.t('session.expired.title'),
      displayableDescription: i18n.t('session.expired.message'),
    })
  );

export const RolePermissionApi = {
  userPermission: async (): Promise<UserPermissionDTO> => {
    const result = await registerClient.userPermission({});
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getPortalConsent: async (): Promise<PortalConsentDTO> => {
    const result = await registerClient.getPortalConsent({});
    return extractResponse(result, 200, onRedirectToLogin);
  },

  savePortalConsent: async (versionId: string | undefined): Promise<void> => {
    const result = await registerClient.savePortalConsent({ body: { versionId } });
    return extractResponse(result, 200, onRedirectToLogin);
  },
};

export const RegisterApi = {
  getProductFiles: async (page?: number, size?: number, sort?: string): Promise<UploadsListDTO> => {
    try {
      const params = {
        ...(page !== undefined ? { page } : {}),
        ...(size !== undefined ? { size } : {}),
        ...(sort !== undefined ? { sort } : {}),
      };

      const result = await registerClient.getProductFilesList(params);
      return extractResponse(result, 200, onRedirectToLogin);
    } catch (error) {
      console.error('Errore durante il recupero dei file prodotto:', error);
      throw error;
    }
  },
  getProducts: async (
      xOrganizationSelected: string,
      page?: number,
      size?: number,
      sort?: string,
      category?: string,
      eprelCode?: string,
      gtinCode?: string,
      productCode?: string,
      productFileId?: string,
  ): Promise<UploadsListDTO> => {
    try {
      const params = {
        'x-organization-selected': xOrganizationSelected,
        ...(page !== undefined ? { page } : {}),
        ...(size !== undefined ? { size } : {}),
        ...(sort !== undefined ? { sort } : {}),
        ...(category ? { category } : {}),
        ...(eprelCode ? { eprelCode } : {}),
        ...(gtinCode ? { gtinCode } : {}),
        ...(productCode ? { productCode } : {}),
        ...(productFileId ? { productFileId } : {}),
      }; 

      const result = await registerClient.getProducts(params);
      return extractResponse(result, 200, onRedirectToLogin);
    } catch (error) {
      console.error('Errore durante il recupero dei file prodotto:', error);
      throw error;
    }
  },
  getBatchFilterItems: async (xOrganizationSelected: string): Promise<BatchList> => {
    try {
      return await registerClient.getBatchNameList({
        'x-organization-selected': xOrganizationSelected,
      });
    } catch (error) {
      console.error('Errore durante il recupero della lista filtri lotti:', error);
      throw error;
    }
  },
  uploadProductList: async (csv: File, category: string): Promise<RegisterUploadResponseDTO> => {
    const result = await registerClient.uploadProductList({ csv, category });
    return extractResponse(result, 200, onRedirectToLogin);
  },
  uploadProductListVerify: async (csv: File, category: string): Promise<RegisterUploadResponseDTO> => {
    const result = await registerClient.verifyProductList({ csv, category });
    return extractResponse(result, 200, onRedirectToLogin);
  },
  downloadErrorReport: async (
    productFileId: string
  ): Promise<{ data: CsvDTO; filename: string }> => {
    const response = await registerClient.downloadErrorReport({ productFileId });

    const rawResponse =
      (response as any).response || (response as any).data || (response as any).right;

    const headers = rawResponse?.headers || (response as any).headers;

    const contentDisposition =
      headers?.get?.('content-disposition') ||
      headers?.get?.('Content-Disposition') ||
      headers?.['content-disposition'] ||
      headers?.['Content-Disposition'];

    // eslint-disable-next-line functional/no-let
    let fileName: string = '';
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match?.[1]) {
        fileName = match[1];
      }
    }

    const responseData = (await extractResponse(response, 200, onRedirectToLogin)) as CsvDTO;

    return { data: responseData, filename: fileName };
  },
  getInstitutionsList: async (): Promise<InstitutionsResponse> => {
    try {
      const result = await registerClient.getInstitutionsList({});
      return extractResponse(result, 200, onRedirectToLogin);
    } catch (error) {
      console.error('Errore durante il recupero della lista delle istituzioni:', error);
      throw error;
    }
  },
  getInstitutionById: async (institutionId: string): Promise<InstitutionsResponse> => {
    try {
      const result = await registerClient.retrieveInstitutionById({ institutionId });
      return extractResponse(result, 200, onRedirectToLogin);
    } catch (error) {
      console.error(`Errore durante il recupero dell'istituzione con ID ${institutionId}:`, error);
      throw error;
    }
  },

};
