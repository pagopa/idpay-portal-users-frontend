import { render, screen } from '@testing-library/react';
import { makeStatusPage, type FeedbackDef } from '../StatusPageFactory';
import '@testing-library/jest-dom';

const mockUseLocation = jest.fn();
const mockNavigate = jest.fn((_props) => <div>Redirect</div>);

jest.mock('react-router-dom', () => ({
  useLocation: () => mockUseLocation(),
  Navigate: (props: any) => mockNavigate(props),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../../../pages/ErrorPage/errorStates', () => ({
  errorState: {
    UNKNOWN_ERROR: {
      icon: null,
      title: 'feedbackStates.unknownError.title',
      description: 'feedbackStates.unknownError.description',
      buttonLabel: 'commons.exit',
      buttonRedirect: '__LOGOUT__',
    },
  },
}));

jest.mock('../../FeedbackContent/FeedbackContent', () => (props: any) => (
  <div data-testid="feedback">
    <div data-testid="feedback-title">{props.title}</div>
    <div data-testid="feedback-description">{props.description}</div>
    {props.buttonLabel && <div data-testid="feedback-button">{props.buttonLabel}</div>}
    {props.buttonRedirect && (
      <div data-testid="feedback-button-redirect">{props.buttonRedirect}</div>
    )}
    {props.supportLinkLabel && (
      <div data-testid="feedback-support-label">{props.supportLinkLabel}</div>
    )}
    {props.supportLinkUrl && <div data-testid="feedback-support-url">{props.supportLinkUrl}</div>}
  </div>
));

const states = {
  REQUEST_SUBMITTED: {
    icon: <span>icon</span>,
    title: 'feedback.requestSubmitted.title',
    description: 'feedback.requestSubmitted.description',
    subDescription: 'feedbackStates.requestSubmitted.description',
    buttonLabel: 'feedback.requestSubmitted.cta',
    buttonRedirect: '/foo',
  },
  WAITING_LIST: {
    icon: <span>icon</span>,
    title: 'feedback.waitingList.title',
    description: 'feedback.waitingList.description',
  },
} satisfies Record<string, FeedbackDef>;

describe('makeStatusPage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the correct feedback when status is valid', () => {
    mockUseLocation.mockReturnValue({ state: { status: 'REQUEST_SUBMITTED' } });
    const Page = makeStatusPage(states);

    render(<Page />);

    expect(screen.getByTestId('feedback')).toBeInTheDocument();
    expect(screen.getByTestId('feedback-title')).toHaveTextContent(
      states.REQUEST_SUBMITTED.title
    );
    expect(screen.getByTestId('feedback-description')).toHaveTextContent(
      states.REQUEST_SUBMITTED.description
    );
    expect(screen.getByTestId('feedback-button')).toHaveTextContent(
      states.REQUEST_SUBMITTED.buttonLabel!
    );
    expect(screen.getByTestId('feedback-button-redirect')).toHaveTextContent('/foo');
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('does not render a button when buttonLabel is missing', () => {
    mockUseLocation.mockReturnValue({ state: { status: 'WAITING_LIST' } });
    const Page = makeStatusPage(states);

    render(<Page />);

    expect(screen.getByTestId('feedback-title')).toHaveTextContent(states.WAITING_LIST.title);
    expect(screen.getByTestId('feedback-description')).toHaveTextContent(
      states.WAITING_LIST.description
    );
    expect(screen.queryByTestId('feedback-button')).toBeNull();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('falls back to UNKNOWN_ERROR when status is unknown (no redirect)', () => {
    mockUseLocation.mockReturnValue({ state: { status: 'UNKNOWN_STATUS' } });
    const Page = makeStatusPage(states);

    render(<Page />);

    expect(screen.getByTestId('feedback')).toBeInTheDocument();
    expect(screen.getByTestId('feedback-title')).toHaveTextContent(
      'feedbackStates.unknownError.title'
    );
    expect(screen.getByTestId('feedback-description')).toHaveTextContent(
      'feedbackStates.unknownError.description'
    );
    expect(screen.getByTestId('feedback-button')).toHaveTextContent('commons.exit');
    expect(screen.getByTestId('feedback-button-redirect')).toHaveTextContent('__LOGOUT__');

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('redirects to HOME when status is missing', () => {
    mockUseLocation.mockReturnValue({});
    const Page = makeStatusPage(states);

    const { getByText, queryByTestId } = render(<Page />);

    expect(getByText('Redirect')).toBeInTheDocument();
    expect(queryByTestId('feedback')).toBeNull();

    const firstCallProps = mockNavigate.mock.calls[0][0];
    expect(firstCallProps).toMatchObject({ to: '/', replace: true });
  });

  it('passes support link props through when present', () => {
    const extendedStates = {
      ...states,
      WITH_SUPPORT: {
        icon: <span>icon</span>,
        title: 'feedback.support.title',
        description: 'feedback.support.description',
        supportLinkLabel: 'feedback.support.label',
        supportLinkUrl: 'https://example.com/support',
      },
    } as const;

    mockUseLocation.mockReturnValue({ state: { status: 'WITH_SUPPORT' } });
    const Page = makeStatusPage(extendedStates);

    render(<Page />);

    expect(screen.getByTestId('feedback-support-label')).toHaveTextContent(
      extendedStates.WITH_SUPPORT.supportLinkLabel!
    );
    expect(screen.getByTestId('feedback-support-url')).toHaveTextContent(
      extendedStates.WITH_SUPPORT.supportLinkUrl!
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
