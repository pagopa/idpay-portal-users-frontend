import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import ROUTES from '../routes';

jest.mock('../api/onboardingWebApiClient', () => ({
  OnboardingWebApi: {
    getStatus: jest.fn().mockResolvedValue({ status: 200, data: {} }),
    getDetail: jest.fn().mockResolvedValue({}),
    save: jest.fn().mockResolvedValue(undefined)
  }
}));

test('renders App component without crashing', () => {
  render(
    <MemoryRouter initialEntries={[ROUTES.DASHBOARD]}>
      <App />
    </MemoryRouter>
  );
});
