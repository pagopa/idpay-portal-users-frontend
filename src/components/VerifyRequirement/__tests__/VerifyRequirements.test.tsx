import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VerifyRequirementForm from '../VerifyRequirementForm';
import '@testing-library/jest-dom';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../FamilyForm', () => () => <div data-testid="family-form" />);
jest.mock('../HeaderForm', () => () => <div data-testid="header-form" />);

jest.mock('../SelfDeclaration', () => (props: any) => (
  <button
    data-testid="self-declaration"
    onClick={() => props.setSwitchValue(true)}
  >
    {props.switchValue ? 'true' : 'false'}
  </button>
));

jest.mock('../IseeForm', () => (props: any) => (
  <input
    data-testid="isee-form"
    value={props.iseeValue}
    onChange={(e) => props.setIseeValue(e.target.value)}
  />
));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('../../../routes', () => ({
  INSERT_EMAIL: '/insert-email',
  FEEDBACK: '/feedback',
}));

jest.mock('../../../api/onboardingWebApiClient', () => ({
  OnboardingWebApi: {
    getStatus: jest.fn().mockResolvedValue({ status: 200, data: {} }),
    getDetail: jest.fn().mockResolvedValue({}),
    save: jest.fn().mockResolvedValue({ status: 202 })
  }
}));

describe('VerifyRequirementForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all sections and buttons', () => {
    render(<VerifyRequirementForm />);

    expect(screen.getByTestId('header-form')).toBeInTheDocument();
    expect(screen.getByTestId('family-form')).toBeInTheDocument();
    expect(screen.getByTestId('self-declaration')).toBeInTheDocument();
    expect(screen.getByTestId('isee-form')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'commons.back' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'verifyRequirements.submit' })
    ).toBeInTheDocument();
  });

  test('navigates to insert email when back button is clicked', () => {
    render(<VerifyRequirementForm />);

    fireEvent.click(screen.getByRole('button', { name: 'commons.back' }));
    expect(mockNavigate).toHaveBeenCalledWith('/insert-email');
  });

  test('navigates to feedback when continue button is clicked', async () => {
    render(<VerifyRequirementForm />);

    fireEvent.change(screen.getByTestId('isee-form'), {
      target: { value: 'ISEE123' }
    });
    fireEvent.click(screen.getByTestId('self-declaration'));
    fireEvent.click(screen.getByRole('button', { name: 'verifyRequirements.submit' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/feedback', {
        state: { status: 'REQUEST_SUBMITTED' },
      });
    });
  });

  test('passes correct props to SelfDeclaration and IseeForm', () => {
    render(<VerifyRequirementForm />);
    expect(screen.getByTestId('self-declaration')).toHaveTextContent('false');
    expect(screen.getByTestId('isee-form')).toHaveValue('');
  });
});
