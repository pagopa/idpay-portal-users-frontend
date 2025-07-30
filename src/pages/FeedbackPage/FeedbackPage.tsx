import { useLocation, Navigate } from 'react-router-dom';
import { feedbackStates } from './feedbackStates';
import FeedbackContent from '../../components/FeedbackContent/FeedbackContent';
import { useTranslation } from 'react-i18next';
import { Container } from '@mui/material';

const FeedbackPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const status = location.state?.status as keyof typeof feedbackStates;
  const feedback = feedbackStates[status];

  if (!feedback) {
    return <Navigate to="/utente/" replace />;
  }

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, sm: 6 } }}>
      <FeedbackContent
        icon={feedback.icon}
        title={t(feedback.title)}
        description={t(feedback.description)}
        buttonLabel={feedback.buttonLabel && t(feedback.buttonLabel)}
        buttonRedirect={feedback.buttonRedirect}
        supportLinkLabel={feedback.supportLinkLabel && t(feedback.supportLinkLabel)}
        supportLinkUrl={feedback.supportLinkUrl}
      />
    </Container>
  );
};

export default FeedbackPage;