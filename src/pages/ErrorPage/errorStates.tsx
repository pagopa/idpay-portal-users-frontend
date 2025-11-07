import { ReactNode } from 'react';
import { IllusAlarmClock, IllusUmbrella, IllusUserUnauthorized } from '@pagopa/mui-italia';
import ROUTES from '../../routes';

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
    title: "feedbackStates.accessToken.title",
    description: 'feedbackStates.accessToken.description',
    buttonLabel: 'commons.retry',
    buttonRedirect: '__LOGOUT__',
  },
  AGE_RESTRICTION: {
    icon: <IllusUserUnauthorized />,
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
  TECHNICAL_ERROR: {
    icon: <IllusUmbrella />,
    title: "feedbackStates.technicalError.title",
    description: 'feedbackStates.technicalError.description',
    buttonLabel: 'commons.exit',
    buttonRedirect: '__LOGOUT__',
    supportLinkUrl: ROUTES.ASSISTANCE,
    supportLinkLabel: "Contatta l'assistenza"
  },
  TOO_MANY_REQUESTS: {
    icon: <IllusAlarmClock />,
    title: "feedbackStates.tooManyRequests.title",
    description: 'feedbackStates.tooManyRequests.description',
    buttonLabel: 'commons.exit',
    buttonRedirect: '__LOGOUT__'
  }
};