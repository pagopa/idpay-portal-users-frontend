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

const GatewayPage = () => {
    const { loading, token } = useAuth();
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

    useEffect(() => {
        if(loading) {
            return;
        }
        if (token == null) {
            navigate(ROUTES.ERROR_PAGE, { state: { status: "INVALID_ACCESS_TOKEN" } });
            return;
        }

        const initiativeId = '68b1612f5a02762e0511c964';
        const fetchData = async () => {
            try {
                const statusResponse = await OnboardingWebApi.getStatus(initiativeId);
                const { status, data: statusData } = statusResponse;

                if (status === 200 && isStatusData(statusData)) {
                    const statusString = (statusData as any).status;
                    navigate(ROUTES.FEEDBACK, { state: { status: statusString } });
                    return;
                }

                if (status === 404 && isUserNotOnboardedError(statusData)) {
                    navigate(ROUTES.TOS);
                    return;
                }
            } catch (error) {
                console.log('Error: ', error);
                //TODO handle generic error
            };
        };

        fetchData();
    }, [loading]);

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