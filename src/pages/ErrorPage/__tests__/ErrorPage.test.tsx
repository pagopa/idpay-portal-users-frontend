import { render, screen } from '@testing-library/react';
import ErrorPage from '../ErrorPage';
import { useLocation } from 'react-router-dom';
import { errorState } from '../errorStates';

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

describe('ErrorPage', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders feedback for INVALID_ACCESS_TOKEN', () => {
        (useLocation as jest.Mock).mockReturnValue({
            state: { status: 'INVALID_ACCESS_TOKEN' },
        });

        render(<ErrorPage />);

        expect(screen.getByTestId('feedback-title')).toHaveTextContent(
            errorState.INVALID_ACCESS_TOKEN.title
        );
        expect(screen.getByTestId('feedback-description')).toHaveTextContent(
            errorState.INVALID_ACCESS_TOKEN.description
        );
        expect(screen.getByTestId('feedback-button')).toHaveTextContent(
            errorState.INVALID_ACCESS_TOKEN.buttonLabel!
        );
    });

    it('renders feedback for AGE_RESTRICTION', () => {
        (useLocation as jest.Mock).mockReturnValue({
            state: { status: 'AGE_RESTRICTION' },
        });

        render(<ErrorPage />);

        expect(screen.getByTestId('feedback-title')).toHaveTextContent(
            errorState.AGE_RESTRICTION.title
        );
        expect(screen.getByTestId('feedback-description')).toHaveTextContent(
            errorState.AGE_RESTRICTION.description
        );
        expect(screen.getByTestId('feedback-button')).toHaveTextContent(
            errorState.AGE_RESTRICTION.buttonLabel!
        );
    });

    it('renders feedback for SESSION_EXPIRED', () => {
        (useLocation as jest.Mock).mockReturnValue({
            state: { status: 'SESSION_EXPIRED' },
        });

        render(<ErrorPage />);

        expect(screen.getByTestId('feedback-title')).toHaveTextContent(
            errorState.SESSION_EXPIRED.title
        );
        expect(screen.getByTestId('feedback-description')).toHaveTextContent(
            errorState.SESSION_EXPIRED.description
        );
        expect(screen.getByTestId('feedback-button')).toHaveTextContent(
            errorState.SESSION_EXPIRED.buttonLabel!
        );
    });

    it('renders feedback for UNKNOWN_ERROR', () => {
        (useLocation as jest.Mock).mockReturnValue({
            state: { status: 'UNKNOWN_ERROR' },
        });

        render(<ErrorPage />);

        expect(screen.getByTestId('feedback-title')).toHaveTextContent(
            errorState.UNKNOWN_ERROR.title
        );
        expect(screen.getByTestId('feedback-description')).toHaveTextContent(
            errorState.UNKNOWN_ERROR.description
        );
        expect(screen.getByTestId('feedback-button')).toHaveTextContent(
            errorState.UNKNOWN_ERROR.buttonLabel!
        );
    });

    it('renders fallback feedback for unknown status', () => {
        (useLocation as jest.Mock).mockReturnValue({
            state: { status: 'SOME_UNKNOWN_ERROR' },
        });

        render(<ErrorPage />);

        expect(screen.getByTestId('feedback-title')).toHaveTextContent(
            errorState.UNKNOWN_ERROR.title
        );
        expect(screen.getByTestId('feedback-description')).toHaveTextContent(
            errorState.UNKNOWN_ERROR.description
        );
    });

    it('renders fallback feedback when state is null', () => {
        (useLocation as jest.Mock).mockReturnValue({
            state: null,
        });

        render(<ErrorPage />);

        expect(screen.getByTestId('feedback-title')).toHaveTextContent(
            errorState.UNKNOWN_ERROR.title
        );
        expect(screen.getByTestId('feedback-description')).toHaveTextContent(
            errorState.UNKNOWN_ERROR.description
        );
    });
});