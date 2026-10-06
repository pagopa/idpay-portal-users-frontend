import { Box, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ROUTES from '../../routes';
import { OnboardingWebApi } from '../../api/onboardingWebApiClient';
import { OnboardingDTO } from '../../api/generated/onboarding-web/api';

type SelfDeclaration = {
    _type: string;
    code: string;
    value: string | boolean | number;
};

type Payload = {
    initiativeId: string;
    confirmedTos: boolean;
    pdndAccept: boolean;
    selfDeclarationList: SelfDeclaration[];
    userMail: string;
    userMailConfirmation: string;
};

type WaitingContentProps = {
    payload: Payload;
};

const WaitingContent: React.FC<WaitingContentProps> = ({ payload }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isFirstStep, setIsFirstStep] = useState(true);
    const description = t('common.click-day.firstDescription')

    useEffect(() => {
        if (!payload) navigate(ROUTES.ERROR_PAGE)

        let timeoutId: ReturnType<typeof setTimeout>;
        let delay = 5000;

        const fetchData = async () => {
            try {
                await OnboardingWebApi.save(payload as OnboardingDTO, { showLoader: false });
                navigate(ROUTES.FEEDBACK, { state: { status: 'REQUEST_SUBMITTED' } });
                return;
            } catch (error: any) {
                const status = error?.status || error?.response?.status;
                if (status === 429) {
                    if (delay === 5000) {
                        delay = 10000;
                        timeoutId = setTimeout(fetchData, delay);
                        setIsFirstStep(false);
                        return;
                    }
                    navigate(ROUTES.ERROR_PAGE, { state: { status: "TOO_MANY_REQUESTS" } });
                    return;
                }
                navigate(ROUTES.ERROR_PAGE, { state: { status: 'TECHNICAL_ERROR' } });
                return;
            }
        };

        timeoutId = setTimeout(fetchData, delay);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [])

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
        >
            <CircularProgress sx={{ mb: 4 }} />
            {isFirstStep ?
                description.split('\n').map((line, i) => (
                    <Typography
                        key={i}
                        variant="h4"
                    >
                        {line}
                    </Typography>
                ))
                :
                <Typography variant="h4" mt={2}>
                    {t('common.click-day.secondDescription')}
                </Typography>
            }
        </Box>
    );
};

export default WaitingContent;
