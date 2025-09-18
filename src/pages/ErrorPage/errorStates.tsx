import { ReactNode } from 'react';
import { IllusUmbrella, IllusUserDenied, IllusAlarmClock } from '../../assets/Icons';

export type ErrorState = {
  icon: ReactNode;
  title: string;
  description: string;
  buttonLabel?: string;
  buttonRedirect?: string;
  supportLinkLabel?: string;
  supportLinkUrl?: string;
};

export type ErrorStateKey = 'AGE_RESTRICTION' | 'INVALID_ACCESS_TOKEN' | 'SESSION_EXPIRED' | 'UNKNOWN_ERROR';

export const errorState: Record<ErrorStateKey, ErrorState> = {

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
  },
  SESSION_EXPIRED: {
    icon: <IllusAlarmClock />,
    title: "feedbackStates.sessionExpired.title",
    description: 'feedbackStates.sessionExpired.description',
    buttonLabel: 'commons.login',
    buttonRedirect: '__LOGOUT__'
  },
  UNKNOWN_ERROR: {
    icon: <IllusUmbrella />,
    title: "feedbackStates.unknownError.title",
    description: 'feedbackStates.unknownError.description',
    buttonLabel: 'commons.retry',
    buttonRedirect: '__LOGOUT__'
  },
};