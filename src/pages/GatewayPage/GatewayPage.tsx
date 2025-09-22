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
import { ErrorStateKey } from '../ErrorPage/errorStates';

const GatewayPage = () => {
    const { loading, token, user } = useAuth();
    const navigate = useNavigate();

    const isErrorDTO = (data: OnboardingErrorDTO | unknown): data is OnboardingErrorDTO =>
        typeof data === 'object' && data !== null && 'code' in data;

    const isUserNotOnboardedError = (data: OnboardingErrorDTO | unknown): boolean =>
        isErrorDTO(data) && data.code === CodeEnum.ONBOARDING_USER_NOT_ONBOARDED;

    const isValidStatus = (status: any): status is StatusEnum =>
        Object.values(StatusEnum).includes(status);

    const isStatusData = (data: any): data is { status: StatusEnum } =>
        typeof data === 'object' &&
        data !== null &&
        'status' in data &&
        isValidStatus(data.status);

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

        let statusKey: ErrorStateKey | null = null;
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

        const initiativeId = '68c4449d0d8426093743d00e';
        const fetchData = async () => {
            try {
                const statusResponse = await OnboardingWebApi.getStatus(initiativeId);
                const { status, data: statusData } = statusResponse;

                if (status === 200 && (isStatusData(statusData) || isErrorDTO(statusData))) {
                    const statusString = (statusData as any).status || (statusData as any).code;
                    navigate(ROUTES.FEEDBACK, { state: { status: statusString } });
                    return;
                }

                if (status === 404 && isUserNotOnboardedError(statusData)) {
                    navigate(ROUTES.TOS);
                    return;
                }
            } catch (error) {
                navigate(ROUTES.ERROR_PAGE, { state: { status: 'UNKNOWN_ERROR' } });
                return;
            };
        };

        fetchData();
    }, [loading, token, user]);

    return (
        <Box
            sx={{
                overflowX: 'clip',
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: theme.palette.background.paper
            }}
        >
            <Overlay />
        </Box>
    );
};

export default GatewayPage;