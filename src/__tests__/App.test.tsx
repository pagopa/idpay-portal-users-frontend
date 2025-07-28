import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import ROUTES from '../routes';

test('renders App component without crashing', () => {
  render(
    <MemoryRouter initialEntries={[ROUTES.DASHBOARD]}>
      <App />
    </MemoryRouter>
  );
});
