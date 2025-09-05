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

     it('renders feedback for AGE_RESTRICTION', () => {
        (useLocation as jest.Mock).mockReturnValue({
            state: { status: 'AGE_RESTRICTION' },
        });

        render(<FeedbackPage />);

        expect(screen.getByTestId('feedback-title')).toHaveTextContent(
            feedbackStates.AGE_RESTRICTION.title
        );
        expect(screen.getByTestId('feedback-description')).toHaveTextContent(
            feedbackStates.AGE_RESTRICTION.description
        );
        expect(screen.getByTestId('feedback-button')).toHaveTextContent(
            feedbackStates.AGE_RESTRICTION.buttonLabel!
        );
    });

    it('renders fallback feedback when state is null', () => {
        (useLocation as jest.Mock).mockReturnValue({
            state: null,
        });

        render(<FeedbackPage />);

        expect(screen.getByTestId('feedback-title')).toHaveTextContent(
            feedbackStates.ON_EVALUATION.title
        );
        expect(screen.getByTestId('feedback-description')).toHaveTextContent(
            feedbackStates.ON_EVALUATION.description
        );
    });

    it('renders feedback for INVALID_ACCESS_TOKEN', () => {
        (useLocation as jest.Mock).mockReturnValue({
            state: { status: 'INVALID_ACCESS_TOKEN' },
        });

        render(<FeedbackPage />);

        expect(screen.getByTestId('feedback-title')).toHaveTextContent(
            feedbackStates.INVALID_ACCESS_TOKEN.title
        );
        expect(screen.getByTestId('feedback-description')).toHaveTextContent(
            feedbackStates.INVALID_ACCESS_TOKEN.description
        );
        expect(screen.getByTestId('feedback-button')).toHaveTextContent(
            feedbackStates.INVALID_ACCESS_TOKEN.buttonLabel!
        );
    });
});