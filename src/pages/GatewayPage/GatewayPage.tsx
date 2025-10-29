import { Box } from '@mui/material';
import { useEffect } from 'react';
import { theme } from '@pagopa/mui-italia';
import { OnboardingWebApi } from '../../api/onboardingWebApiClient';
import { CodeEnum, OnboardingErrorDTO } from '../../api/generated/onboarding-web/OnboardingErrorDTO';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';
import { StatusEnum } from '../../api/generated/onboarding-web/OnboardingStatusDTO';
import { useAuth } from '../../contexts/AuthContext';
import Overlay from '../../components/Overlay/Overlay';
import { UserProfile } from '../../types/auth';
import { isStorageTokenExpired } from '../../utils/tokenManager';
import { useCanAccessTOSStore } from '../../hooks/useCanAccessTOSStore';
import { extractErrorResponse } from '../../utils/api';
import { getInitiativeId } from '../../utils/env';
import { getStatusDestination } from '../../utils/statusChecker';
import { useIsMobile } from '../../hooks/useIsMobile';

const GatewayPage = () => {
    const { loading, token, user } = useAuth();
    const navigate = useNavigate();
    const { setCanAccessTOS } = useCanAccessTOSStore();
    const isMobile = useIsMobile();

    const isErrorDTO = (data: OnboardingErrorDTO | unknown): data is OnboardingErrorDTO =>
        typeof data === 'object' && data !== null && 'code' in data;

    const isInitiativeNotStarted = (data: OnboardingErrorDTO | unknown): boolean =>
        isErrorDTO(data)
        && [
            CodeEnum.ONBOARDING_INITIATIVE_NOT_STARTED,
            CodeEnum.ONBOARDING_INITIATIVE_NOT_FOUND,
            CodeEnum.ONBOARDING_INITIATIVE_STATUS_NOT_PUBLISHED
        ].includes(data.code);

    const isUserNotOnboardedError = (data: OnboardingErrorDTO | unknown): boolean =>
        isErrorDTO(data) && data.code === CodeEnum.ONBOARDING_USER_NOT_ONBOARDED;

    const getDateOfBirth = (user: UserProfile): string | null => {
        if (!user?.attributes?.dateOfBirth || !Array.isArray(user.attributes.dateOfBirth)) {
            return null;
        }
        return user.attributes.dateOfBirth[0] || null;
    };

    const isAgeRestricted = (dateOfBirth: string | null): boolean => {
        if (!dateOfBirth) return false;

        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

        return birthDate > eighteenYearsAgo;
    };

    useEffect(() => {
        if (loading) return;

        let statusKey: string | null = null;
        if (isStorageTokenExpired()) {
            statusKey = 'SESSION_EXPIRED';
        } else if (token == null) {
            statusKey = 'INVALID_ACCESS_TOKEN';
        } else if (user) {
            const dateOfBirth = getDateOfBirth(user);
            if (dateOfBirth && isAgeRestricted(dateOfBirth)) {
                statusKey = 'AGE_RESTRICTION';
            }
        } else {
            statusKey = 'UNKNOWN_ERROR';
        }

        if (statusKey) {
            navigate(ROUTES.ERROR_PAGE, { state: { status: statusKey } });
            return;
        }

        const initiativeId = getInitiativeId();
        const fetchData = async () => {
            try {
                const statusResponse = await OnboardingWebApi.getStatus(initiativeId, { showLoader: false });
                const { status: httpStatus, data: statusData } = statusResponse;
                const statusCode = (statusData as any).status || (statusData as any).code;

                if (!statusCode || typeof statusCode !== 'string') {
                    navigate(ROUTES.ERROR_PAGE, { state: { status: 'UNKNOWN_ERROR' } });
                    return;
                }

                if (httpStatus === 200 && statusCode === StatusEnum.ONBOARDING_OK) {
                    navigate(ROUTES.DASHBOARD);
                    return;
                }

                if (httpStatus === 400 && isInitiativeNotStarted(statusData)) {
                    navigate(ROUTES.UPCOMING_INITIATIVE);
                    return;
                }

                if (httpStatus === 404 && isUserNotOnboardedError(statusData)) {
                    setCanAccessTOS(true);
                    navigate(ROUTES.TOS);
                    return;
                }

                if (httpStatus === 200 || httpStatus === 400 || httpStatus === 404) {
                    const destination = getStatusDestination(statusCode);

                    if (destination.type === 'error') {
                        navigate(ROUTES.ERROR_PAGE, { state: { status: destination.status } });
                        return;
                    }

                    if (destination.type === 'feedback') {
                        navigate(ROUTES.FEEDBACK, { state: { status: destination.status } });
                        return;
                    }
                    navigate(ROUTES.ERROR_PAGE, { state: { status: 'UNKNOWN_ERROR' } });
                    return;
                }
                navigate(ROUTES.ERROR_PAGE, { state: { status: 'UNKNOWN_ERROR' } });

            } catch (error: any) {
                if (extractErrorResponse(error)) {
                    if (error?.status === 429) {
                        navigate(ROUTES.ERROR_PAGE, { state: { status: 'TOO_MANY_REQUESTS' } });
                        return;
                    }
                }
                navigate(ROUTES.ERROR_PAGE, { state: { status: 'UNKNOWN_ERROR' } });
            }
        };

        fetchData();
    }, [loading, token, user]);

    return (
        <Box
            sx={{
                overflowX: 'clip',
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: theme.palette.background.paper,
                minHeight: isMobile ? "80vh" : ""
            }}
        >
            <Overlay />
        </Box>
    );
};

export default GatewayPage;