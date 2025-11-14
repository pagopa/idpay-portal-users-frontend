import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import WaitingPage from '../WaitingPage';

jest.mock('../../../components/WaitingPage/WaitingContent', () => {
  return {
    __esModule: true,
    default: (props: any) => (
      <div data-testid="waiting-content">
        {props.payload == null ? 'no-payload' : 'has-payload'}
      </div>
    ),
  };
});

jest.mock('../../../utils/env', () => ({
  getInitiativeId: () => '68dd003ccce8c534d1da22bc',
}));

describe('WaitingPage', () => {
  test('passes location.state to WaitingContent', () => {
    const payload = {
      userMail: 'user@test.it',
      initiativeId: '68dd003ccce8c534d1da22bc',
    };

    render(
      <MemoryRouter initialEntries={[{ pathname: '/', state: payload } as any]}>
        <WaitingPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('waiting-content')).toHaveTextContent('has-payload');
  });

  test('renders with undefined payload when no location.state', () => {
    render(
        <MemoryRouter initialEntries={['/']}>
        <WaitingPage />
        </MemoryRouter>
    );

    expect(screen.getByTestId('waiting-content')).toHaveTextContent('no-payload');
    });
});