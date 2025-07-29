import { ReactNode } from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { theme } from '@pagopa/mui-italia';

export type FeedbackState = {
  icon: ReactNode;
  title: string;
  description: string;
  buttonLabel?: string;
  buttonRedirect?: string;
  supportLinkLabel?: string;
  supportLinkUrl?: string;
};

export const feedbackStates: Record<string, FeedbackState> = {

  REQUEST_SUBMITTED: {
    icon: <CheckCircleOutlineIcon sx={{ fontSize: 60, color: theme.palette.secondary.main }} />,
    title: "feedbackStates.requestSubmitted.title",
    description: 'feedbackStates.requestSubmitted.description',
    buttonLabel: 'commons.exit',
    buttonRedirect: '/utente/'
  }
  //TODO handle other states
};
