import { ReactNode } from 'react';
import { IllusCompleted, IllusHistoryDoc } from '@pagopa/mui-italia';
import { IllusUmbrella, IllusUserDenied } from '../../assets/Icons';

export type FeedbackState = {
  icon: ReactNode;
  title: string;
  description: string;
  buttonLabel?: string;
  buttonRedirect?: string;
  supportLinkLabel?: string;
  supportLinkUrl?: string;
};

export type FeedbackStateKey = 'REQUEST_SUBMITTED' | 'ON_EVALUATION' | 'AGE_RESTRICTION' | 'INVALID_ACCESS_TOKEN';

export const feedbackStates: Record<FeedbackStateKey, FeedbackState> = {

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
  },
  INVALID_ACCESS_TOKEN: {
    icon: <IllusUmbrella />,
    title: "feedbackStates.accessToken.title",
    description: 'feedbackStates.accessToken.description',
    buttonLabel: 'commons.retry',
    buttonRedirect: '__LOGOUT__',
  },
  AGE_RESTRICTION: {
    icon: <IllusUserDenied />,
    title: "feedbackStates.ageRestriction.title",
    description: 'feedbackStates.ageRestriction.description',
    buttonLabel: 'commons.exit',
    buttonRedirect: '__LOGOUT__'
  }
};