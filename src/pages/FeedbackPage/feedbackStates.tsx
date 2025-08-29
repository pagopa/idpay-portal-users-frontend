import { ReactNode } from 'react';
import { IllusCompleted, IllusHistoryDoc } from '@pagopa/mui-italia';

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
    icon: <IllusCompleted />,
    title: "feedbackStates.requestSubmitted.title",
    description: 'feedbackStates.requestSubmitted.description',
    buttonLabel: 'commons.exit',
    buttonRedirect: '__LOGOUT__'
  },
  ON_EVALUATION: {
    icon: <IllusHistoryDoc />,
    title: "feedbackStates.onEvaluation.title",
    description: 'feedbackStates.onEvaluation.description',
    buttonLabel: 'commons.exit',
    buttonRedirect: '__LOGOUT__'
  }
  //TODO handle other states
};
