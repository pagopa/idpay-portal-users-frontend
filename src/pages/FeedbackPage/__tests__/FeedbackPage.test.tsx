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

    it('renders feedback for ONBOARDING_FAMILY_UNIT_ALREADY_JOINED', () => {
        (useLocation as jest.Mock).mockReturnValue({
            state: { status: 'ONBOARDING_FAMILY_UNIT_ALREADY_JOINED' },
        });

        render(<FeedbackPage />);

        expect(screen.getByTestId('feedback-title')).toHaveTextContent(
            feedbackStates.ONBOARDING_FAMILY_UNIT_ALREADY_JOINED.title
        );
        expect(screen.getByTestId('feedback-description')).toHaveTextContent(
            feedbackStates.ONBOARDING_FAMILY_UNIT_ALREADY_JOINED.description
        );
        expect(screen.getByTestId('feedback-button')).toHaveTextContent(
            feedbackStates.ONBOARDING_FAMILY_UNIT_ALREADY_JOINED.buttonLabel!
        );
    });

    it('renders feedback for WAITING_LIST', () => {
        (useLocation as jest.Mock).mockReturnValue({
            state: { status: 'WAITING_LIST' },
        });

        render(<FeedbackPage />);

        expect(screen.getByTestId('feedback-title')).toHaveTextContent(
            feedbackStates.WAITING_LIST.title
        );
        expect(screen.getByTestId('feedback-description')).toHaveTextContent(
            feedbackStates.WAITING_LIST.description
        );
        expect(screen.getByTestId('feedback-button')).toHaveTextContent(
            feedbackStates.WAITING_LIST.buttonLabel!
        );
    });

    it('renders feedback for ONBOARDING_INITIATIVE_ENDED', () => {
        (useLocation as jest.Mock).mockReturnValue({
            state: { status: 'ONBOARDING_INITIATIVE_ENDED' },
        });

        render(<FeedbackPage />);

        expect(screen.getByTestId('feedback-title')).toHaveTextContent(
            feedbackStates.ONBOARDING_INITIATIVE_ENDED.title
        );
        expect(screen.getByTestId('feedback-description')).toHaveTextContent(
            feedbackStates.ONBOARDING_INITIATIVE_ENDED.description
        );
        expect(screen.getByTestId('feedback-button')).toHaveTextContent(
            feedbackStates.ONBOARDING_INITIATIVE_ENDED.buttonLabel!
        );
    });

    it('renders feedback for ONBOARDING_BUDGET_EXHAUSTED', () => {
        (useLocation as jest.Mock).mockReturnValue({
            state: { status: 'ONBOARDING_BUDGET_EXHAUSTED' },
        });

        render(<FeedbackPage />);

        expect(screen.getByTestId('feedback-title')).toHaveTextContent(
            feedbackStates.ONBOARDING_BUDGET_EXHAUSTED.title
        );
        expect(screen.getByTestId('feedback-description')).toHaveTextContent(
            feedbackStates.ONBOARDING_BUDGET_EXHAUSTED.description
        );
        expect(screen.getByTestId('feedback-button')).toHaveTextContent(
            feedbackStates.ONBOARDING_BUDGET_EXHAUSTED.buttonLabel!
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
});