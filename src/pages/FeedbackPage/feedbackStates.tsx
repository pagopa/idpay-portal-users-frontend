import { ReactNode } from 'react';
import { IllusCompleted, IllusQuick } from '@pagopa/mui-italia';

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
    buttonRedirect: '/' //TODO add redirect
  },
  ON_EVALUATION: {
    icon: <IllusQuick />,
    title: "feedbackStates.onEvaluation.title",
    description: 'feedbackStates.onEvaluation.description',
    buttonLabel: 'commons.exit',
    buttonRedirect: '/' //TODO add redirect
  }
  //TODO handle other states
};
