import { render, screen } from '@testing-library/react';
import VerifyRequirements from '../VerifyRequirements';
import '@testing-library/jest-dom';

jest.mock('../../../components/VerifyRequirement/VerifyRequirementForm', () => () => (
  <div data-testid="verify-requirement-form" />
));

describe('VerifyRequirements Page', () => {
  test('renders the VerifyRequirementForm inside the Box', () => {
    render(<VerifyRequirements />);

    expect(screen.getByTestId('verify-requirement-form')).toBeInTheDocument();
  });
});
