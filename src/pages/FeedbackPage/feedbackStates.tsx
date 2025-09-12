import { ReactNode } from 'react';
import { IllusCompleted, IllusHistoryDoc, IllusError } from '@pagopa/mui-italia';

export type FeedbackState = {
  icon: ReactNode;
  title: string;
  description: string;
  buttonLabel?: string;
  buttonRedirect?: string;
  supportLinkLabel?: string;
  supportLinkUrl?: string;
};

export type FeedbackStateKey = 'REQUEST_SUBMITTED' | 'ON_EVALUATION' | 'ONBOARDING_FAMILY_UNIT_ALREADY_JOINED' | 'WAITING_LIST';

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
  ONBOARDING_FAMILY_UNIT_ALREADY_JOINED: {
    icon: <IllusError />,
    title: "feedbackStates.familyMember.title",
    description: 'feedbackStates.familyMember.description',
    buttonLabel: 'commons.exit',
    buttonRedirect: '__LOGOUT__'
  },
  WAITING_LIST: {
    icon: <IllusHistoryDoc />,
    title: "feedbackStates.waitingList.title",
    description: 'feedbackStates.waitingList.description',
    buttonLabel: 'commons.exit',
    buttonRedirect: '__LOGOUT__'
  }
};