import { ReactNode } from 'react';
import { IllusUmbrella, IllusUserDenied } from '../../assets/Icons';

export type ErrorState = {
  icon: ReactNode;
  title: string;
  description: string;
  buttonLabel?: string;
  buttonRedirect?: string;
  supportLinkLabel?: string;
  supportLinkUrl?: string;
};

export type ErrorStateKey = 'AGE_RESTRICTION' | 'INVALID_ACCESS_TOKEN';

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
  }
};