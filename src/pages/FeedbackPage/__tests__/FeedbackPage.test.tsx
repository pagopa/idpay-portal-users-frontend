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

    it('renders feedback for ONBOARDING_WAITING_LIST', () => {
        (useLocation as jest.Mock).mockReturnValue({
            state: { status: 'ONBOARDING_WAITING_LIST' },
        });

        render(<FeedbackPage />);

        expect(screen.getByTestId('feedback-title')).toHaveTextContent(
            feedbackStates.ONBOARDING_WAITING_LIST.title
        );
        expect(screen.getByTestId('feedback-description')).toHaveTextContent(
            feedbackStates.ONBOARDING_WAITING_LIST.description
        );
        expect(screen.getByTestId('feedback-button')).toHaveTextContent(
            feedbackStates.ONBOARDING_WAITING_LIST.buttonLabel!
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

    it('redirects when state is null', () => {
        (useLocation as jest.Mock).mockReturnValue({ state: null });

        const { queryByTestId, getByText } = render(<FeedbackPage />);

        expect(getByText('Redirect')).toBeInTheDocument();
        expect(queryByTestId('feedback-title')).toBeNull();
        expect(queryByTestId('feedback-description')).toBeNull();
        expect(queryByTestId('feedback-button')).toBeNull();

        const { Navigate } = require('react-router-dom');
        expect(Navigate).toHaveBeenCalled();
    });
});
