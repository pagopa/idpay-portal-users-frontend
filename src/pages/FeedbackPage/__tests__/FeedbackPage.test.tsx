import { render, screen } from '@testing-library/react';
import FeedbackPage from '../FeedbackPage';
import { useLocation } from 'react-router-dom';
import { feedbackStates } from '../feedbackStates';

jest.mock('react-router-dom', () => ({
    useLocation: jest.fn(),
    Navigate: jest.fn(() => <div>Redirect</div>),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('../../../components/FeedbackContent/FeedbackContent', () => (props: any) => (
    <div>
        <div data-testid="feedback-title">{props.title}</div>
        <div data-testid="feedback-description">{props.description}</div>
        {props.buttonLabel && <div data-testid="feedback-button">{props.buttonLabel}</div>}
    </div>
));

describe('FeedbackPage', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders feedback for REQUEST_SUBMITTED', () => {
        (useLocation as jest.Mock).mockReturnValue({
            state: { status: 'REQUEST_SUBMITTED' },
        });

        render(<FeedbackPage />);

        expect(screen.getByTestId('feedback-title')).toHaveTextContent(
            feedbackStates.REQUEST_SUBMITTED.title
        );
        expect(screen.getByTestId('feedback-description')).toHaveTextContent(
            feedbackStates.REQUEST_SUBMITTED.description
        );
        expect(screen.getByTestId('feedback-button')).toHaveTextContent(
            feedbackStates.REQUEST_SUBMITTED.buttonLabel!
        );
    });

    it('renders fallback feedback for unknown status', () => {
        (useLocation as jest.Mock).mockReturnValue({
            state: { status: 'UNKNOWN_STATUS' },
        });

        render(<FeedbackPage />);

        expect(screen.getByTestId('feedback-title')).toHaveTextContent(
            feedbackStates.ON_EVALUATION.title
        );
        expect(screen.getByTestId('feedback-description')).toHaveTextContent(
            feedbackStates.ON_EVALUATION.description
        );
    });

    it('redirects to /utente/ if no status and no fallback', () => {
        const originalOnEvaluation = feedbackStates.ON_EVALUATION;
        delete feedbackStates.ON_EVALUATION;

        (useLocation as jest.Mock).mockReturnValue({
            state: null,
        });

        render(<FeedbackPage />);

        expect(screen.getByText('Redirect')).toBeInTheDocument();

        feedbackStates.ON_EVALUATION = originalOnEvaluation;
    });
});
