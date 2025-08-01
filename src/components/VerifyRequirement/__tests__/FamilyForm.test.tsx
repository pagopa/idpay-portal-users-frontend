import { render, screen, fireEvent } from '@testing-library/react';
import FamilyForm from '../FamilyForm';
import '@testing-library/jest-dom';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../../Titles/TitleCard', () => (props: { title: string }) => (
  <div data-testid="title-card">{props.title}</div>
));

describe('FamilyForm', () => {
  test('renders TitleCard with correct title', () => {
    render(<FamilyForm />);
    expect(screen.getByTestId('title-card')).toHaveTextContent(
      'verifyRequirements.family.title'
    );
  });

  test('renders description texts', () => {
    render(<FamilyForm />);

    expect(
      screen.getByText('verifyRequirements.family.description1')
    ).toBeInTheDocument();
    expect(
      screen.getByText('verifyRequirements.family.description2')
    ).toBeInTheDocument();
  });

  test('renders tooltip button and shows tooltip on hover', async () => {
    render(<FamilyForm />);

    const iconButton = screen.getByRole('button');
    expect(iconButton).toBeInTheDocument();

    fireEvent.mouseOver(iconButton);

    const tooltip = await screen.findByText('verifyRequirements.tooltip');
    expect(tooltip).toBeInTheDocument();
  });
});
