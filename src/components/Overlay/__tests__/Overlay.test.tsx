import { render, screen } from '@testing-library/react';
import Overlay from '../Overlay';
import { theme } from '@pagopa/mui-italia';

describe('Overlay', () => {
  it('renders a full-screen overlay with a CircularProgress', () => {
    render(<Overlay />);

    const loader = screen.getByRole('progressbar');
    expect(loader).toBeInTheDocument();

    const overlay = loader.closest('div');
    expect(overlay).toHaveStyle({
      position: 'fixed',
      top: '0px',
      left: '0px',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      'background-color': theme.palette.action.disabledBackground,
    });
  });
});
