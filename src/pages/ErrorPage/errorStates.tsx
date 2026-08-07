import { ReactNode } from 'react';
import { IllusAlarmClock, IllusUmbrella, IllusUserUnauthorized } from '@pagopa/mui-italia';

export type ErrorState = {
  icon: ReactNode;
  title: string;
  description: string;
  buttonLabel?: string;
  buttonRedirect?: string;
  supportLinkLabel?: string;
  supportLinkUrl?: string;
};

export type ErrorStateKey = 'AGE_RESTRICTION' | 'INVALID_ACCESS_TOKEN' | 'SESSION_EXPIRED' | 'UNKNOWN_ERROR' | 'TECHNICAL_ERROR' | 'TOO_MANY_REQUESTS';

export const errorState: Record<ErrorStateKey, ErrorState> = {

  INVALID_ACCESS_TOKEN: {
    icon: <IllusUmbrella />,
    title: "common.feedbackStates.accessToken.title",
    description: 'common.feedbackStates.accessToken.description',
    buttonLabel: 'commons.retry',
    buttonRedirect: '__LOGOUT__',
  },
  AGE_RESTRICTION: {
    icon: <IllusUserUnauthorized />,
    title: "common.feedbackStates.ageRestriction.title",
    description: 'common.feedbackStates.ageRestriction.description',
    buttonLabel: 'commons.exit',
    buttonRedirect: '__LOGOUT__'
  },
  SESSION_EXPIRED: {
    icon: <IllusAlarmClock />,
    title: "common.feedbackStates.sessionExpired.title",
    description: 'common.feedbackStates.sessionExpired.description',
    buttonLabel: 'commons.login',
    buttonRedirect: '__LOGOUT__'
  },
  UNKNOWN_ERROR: {
    icon: <IllusUmbrella />,
    title: "common.feedbackStates.unknownError.title",
    description: 'common.feedbackStates.unknownError.description',
    buttonLabel: 'commons.retry',
    buttonRedirect: '__LOGOUT__'
  },
  TECHNICAL_ERROR: {
    icon: <IllusUmbrella />,
    title: "common.feedbackStates.technicalError.title",
    description: 'common.feedbackStates.technicalError.description',
    buttonLabel: 'commons.exit',
    buttonRedirect: '__LOGOUT__',
  },
  TOO_MANY_REQUESTS: {
    icon: <IllusAlarmClock />,
    title: "common.feedbackStates.tooManyRequests.title",
    description: 'common.feedbackStates.tooManyRequests.description',
    buttonLabel: 'commons.exit',
    buttonRedirect: '__LOGOUT__'
  }
};
