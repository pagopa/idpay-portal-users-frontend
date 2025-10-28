import { errorState, ErrorStateKey } from '../pages/ErrorPage/errorStates';
import { feedbackStates, FeedbackStateKey } from '../pages/FeedbackPage/feedbackStates';

const normalizeStatus = (statusCode: string): string => {
    return statusCode?.toUpperCase().trim() || '';
};

export const isKnownErrorState = (statusCode: string): statusCode is ErrorStateKey => {
    return normalizeStatus(statusCode) in errorState;
};

export const isKnownFeedbackState = (statusCode: string): statusCode is FeedbackStateKey => {
    return normalizeStatus(statusCode) in feedbackStates;
};

export type StatusDestination =
    | { type: 'error'; status: ErrorStateKey }
    | { type: 'feedback'; status: FeedbackStateKey }
    | { type: 'unknown' };

export const getStatusDestination = (statusCode: string): StatusDestination => {
    const normalized = normalizeStatus(statusCode);

    if (normalized in feedbackStates) {
        return { type: 'feedback', status: normalized as FeedbackStateKey };
    }

    if (normalized in errorState) {
        return { type: 'error', status: normalized as ErrorStateKey };
    }

    return { type: 'unknown' };
};