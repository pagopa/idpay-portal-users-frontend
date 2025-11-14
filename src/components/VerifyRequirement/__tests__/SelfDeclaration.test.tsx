import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SelfDeclaration from '../SelfDeclaration';
import '@testing-library/jest-dom';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../../Titles/TitleCard', () => (props: { title: string }) => (
  <div data-testid="title-card">{props.title}</div>
));

describe('SelfDeclaration', () => {
  test('renders TitleCard and description', () => {
    render(<SelfDeclaration switchValue={false} setSwitchValue={jest.fn()} />);

    expect(screen.getByTestId('title-card')).toHaveTextContent(
      'verifyRequirements.selfDeclaration.title'
    );
    expect(
      screen.getByText('verifyRequirements.selfDeclaration.description')
    ).toBeInTheDocument();
  });

  test('renders the switch label', () => {
    render(<SelfDeclaration switchValue={false} setSwitchValue={jest.fn()} />);

    expect(
      screen.getByText('verifyRequirements.selfDeclaration.switchLabel')
    ).toBeInTheDocument();
  });

  test('shows error message when switchValue is false and showError is true', () => {
    render(<SelfDeclaration switchValue={false} setSwitchValue={jest.fn()} showError={true} />);

    expect(
      screen.getByText('verifyRequirements.selfDeclarationError')
    ).toBeInTheDocument();
  });

  test('does not show error message when showError is false', () => {
    render(<SelfDeclaration switchValue={false} setSwitchValue={jest.fn()} showError={false} />);

    expect(
      screen.queryByText('verifyRequirements.selfDeclarationError')
    ).not.toBeInTheDocument();
  });

  test('does not show error message when switchValue is true even if showError is true', () => {
    render(<SelfDeclaration switchValue={true} setSwitchValue={jest.fn()} showError={true} />);

    expect(
      screen.queryByText('verifyRequirements.selfDeclarationError')
    ).not.toBeInTheDocument();
  });

  test('does not show error message when switchValue is true and showError is false', () => {
    render(<SelfDeclaration switchValue={true} setSwitchValue={jest.fn()} showError={false} />);

    expect(
      screen.queryByText('verifyRequirements.selfDeclarationError')
    ).not.toBeInTheDocument();
  });

  test('propagates the aria-label to the switch via slotProps.input', () => {
    render(<SelfDeclaration switchValue={false} setSwitchValue={jest.fn()} />);
    const sw = screen.getByRole('checkbox', {
      name: 'verifyRequirements.selfDeclaration.switchLabel',
    });
    expect(sw).toBeInTheDocument();
  });

  test('calls setSwitchValue with the correct value when the switch is clicked', async () => {
    const user = userEvent.setup();
    const setSwitchValue = jest.fn();
    render(<SelfDeclaration switchValue={false} setSwitchValue={setSwitchValue} />);

    const sw = screen.getByRole('checkbox', {
      name: 'verifyRequirements.selfDeclaration.switchLabel',
    });

    await user.click(sw);
    expect(setSwitchValue).toHaveBeenCalledWith(true);
  });
});