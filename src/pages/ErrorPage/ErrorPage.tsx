import { useLocation, Navigate } from 'react-router-dom';
import { errorState } from './errorStates';
import FeedbackContent from '../../components/FeedbackContent/FeedbackContent';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

const ErrorPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const status = location.state?.status as keyof typeof errorState;
  const feedback = errorState[status] || errorState.INVALID_ACCESS_TOKEN; //TODO tmp fallback

  if (!feedback) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box sx={{ py: { xs: 4, sm: 6 }, height: "100%", }} justifyContent="center" display="flex" alignItems="center" maxWidth={"sm"} mx="auto" >
      <FeedbackContent
        icon={feedback.icon}
        title={t(feedback.title)}
        description={t(feedback.description)}
        buttonLabel={feedback.buttonLabel && t(feedback.buttonLabel)}
        buttonRedirect={feedback.buttonRedirect}
        supportLinkLabel={feedback.supportLinkLabel && t(feedback.supportLinkLabel)}
        supportLinkUrl={feedback.supportLinkUrl}
      />
    </Box>
  );
};

export default ErrorPage;