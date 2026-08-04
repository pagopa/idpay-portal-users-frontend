import { ReactNode } from 'react';
import { IllusCompleted, IllusHistoryDoc, IllusError } from '@pagopa/mui-italia';

export type FeedbackState = {
  icon: ReactNode;
  title: string;
  description: string;
  subDescription?: string;
  buttonLabel?: string;
  buttonRedirect?: string;
  supportLinkLabel?: string;
  supportLinkUrl?: string;
};

export type FeedbackStateKey = 'REQUEST_SUBMITTED' | 'ON_EVALUATION' | 'ONBOARDING_FAMILY_UNIT_ALREADY_JOINED' | 'ONBOARDING_WAITING_LIST' | 'ONBOARDING_INITIATIVE_ENDED' | 'ONBOARDING_BUDGET_EXHAUSTED';

export const feedbackStates: Record<FeedbackStateKey, FeedbackState> = {

  REQUEST_SUBMITTED: {
    icon: <IllusCompleted />,
    title: "common.feedbackStates.requestSubmitted.title",
    description: 'common.feedbackStates.requestSubmitted.description',
    subDescription: 'common.feedbackStates.requestSubmitted.subDescription',
    buttonLabel: 'commons.exit',
    buttonRedirect: '__LOGOUT__'
  },
  ON_EVALUATION: {
    icon: <IllusHistoryDoc />,
    title: "common.feedbackStates.onEvaluation.title",
    description: 'common.feedbackStates.onEvaluation.description',
    buttonLabel: 'commons.exit',
    buttonRedirect: '__LOGOUT__'
  },
  ONBOARDING_FAMILY_UNIT_ALREADY_JOINED: {
    icon: <IllusError />,
    title: "common.feedbackStates.familyMember.title",
    description: 'common.feedbackStates.familyMember.description',
    buttonLabel: 'commons.exit',
    buttonRedirect: '__LOGOUT__'
  },
  ONBOARDING_WAITING_LIST: {
    icon: <IllusHistoryDoc />,
    title: "common.feedbackStates.waitingList.title",
    description: 'common.feedbackStates.waitingList.description',
    buttonLabel: 'commons.exit',
    buttonRedirect: '__LOGOUT__'
  },
  ONBOARDING_INITIATIVE_ENDED: {
    icon: <IllusError />,
    title: "common.feedbackStates.initiativeEnded.title",
    description: 'common.feedbackStates.initiativeEnded.description',
    buttonLabel: 'commons.exit',
    buttonRedirect: '__LOGOUT__'
  },
  ONBOARDING_BUDGET_EXHAUSTED: {
    icon: <IllusError />,
    title: "common.feedbackStates.budgetExhausted.title",
    description: 'common.feedbackStates.budgetExhausted.description',
    buttonLabel: 'commons.exit',
    buttonRedirect: '__LOGOUT__'
  },
};
