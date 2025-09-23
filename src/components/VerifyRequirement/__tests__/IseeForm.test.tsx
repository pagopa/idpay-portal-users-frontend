import { render, screen, fireEvent } from '@testing-library/react';
import IseeForm from '../IseeForm';
import '@testing-library/jest-dom';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../../Titles/TitleCard', () => (props: { title: string }) => (
  <div data-testid="title-card">{props.title}</div>
));

describe('IseeForm', () => {
  test('renders TitleCard and description', () => {
    render(<IseeForm iseeValue="" setIseeValue={jest.fn()} />);

    expect(screen.getByTestId('title-card')).toHaveTextContent(
      'verifyRequirements.isee.title'
    );
    expect(
      screen.getByText('verifyRequirements.isee.description')
    ).toBeInTheDocument();
  });

  test('renders all radio options', () => {
    render(<IseeForm iseeValue="" setIseeValue={jest.fn()} />);

    expect(
      screen.getByText('verifyRequirements.isee.option.<25000')
    ).toBeInTheDocument();
    expect(
      screen.getByText('verifyRequirements.isee.option.>=25000')
    ).toBeInTheDocument();
    expect(
      screen.getByText('verifyRequirements.isee.option.none')
    ).toBeInTheDocument();
  });

  test('calls setIseeValue when a radio option is selected', () => {
    const setIseeValueMock = jest.fn();
    render(<IseeForm iseeValue="" setIseeValue={setIseeValueMock} />);

    const option = screen.getByText('verifyRequirements.isee.option.<25000');
    fireEvent.click(option);

    expect(setIseeValueMock).toHaveBeenCalledWith('1');
  });

  test('displays error message when iseeValue is empty and showError is true', () => {
    render(<IseeForm iseeValue="" setIseeValue={jest.fn()} showError={true} />);

    expect(
      screen.getByText('verifyRequirements.error')
    ).toBeInTheDocument();
  });

  test('does not display error message when showError is false', () => {
    render(<IseeForm iseeValue="" setIseeValue={jest.fn()} showError={false} />);

    expect(
      screen.queryByText('verifyRequirements.error')
    ).not.toBeInTheDocument();
  });

  test('does not display error message when iseeValue is selected even if showError is true', () => {
    render(<IseeForm iseeValue="1" setIseeValue={jest.fn()} showError={true} />);

    expect(
      screen.queryByText('verifyRequirements.error')
    ).not.toBeInTheDocument();
  });
});