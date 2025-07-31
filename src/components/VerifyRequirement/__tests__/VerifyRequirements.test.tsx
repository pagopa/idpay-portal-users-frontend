import { render, screen, fireEvent } from '@testing-library/react';
import VerifyRequirementForm from '../VerifyRequirementForm';
import '@testing-library/jest-dom';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../FamilyForm', () => () => <div data-testid="family-form" />);
jest.mock('../SelfDeclaration', () => (props: any) => (
  <div data-testid="self-declaration">{props.switchValue ? 'ON' : 'OFF'}</div>
));
jest.mock('../IseeForm', () => (props: any) => (
  <div data-testid="isee-form">{props.iseeValue}</div>
));
jest.mock('../HeaderForm', () => () => <div data-testid="header-form" />);

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('../../../routes', () => ({
  INSERT_EMAIL: '/insert-email',
  FEEDBACK: '/feedback',
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

  test('navigates to feedback when continue button is clicked', () => {
    render(<VerifyRequirementForm />);

    fireEvent.click(screen.getByRole('button', { name: 'verifyRequirements.submit' }));
    expect(mockNavigate).toHaveBeenCalledWith('/feedback', {
      state: { status: 'REQUEST_SUBMITTED' },
    });
  });

  test('passes correct props to SelfDeclaration and IseeForm', () => {
    render(<VerifyRequirementForm />);

    expect(screen.getByTestId('self-declaration')).toHaveTextContent('OFF');

    expect(screen.getByTestId('isee-form')).toHaveTextContent('');
  });
});