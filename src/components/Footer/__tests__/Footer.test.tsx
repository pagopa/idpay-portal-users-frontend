import { render, screen } from '@testing-library/react';
import CustomFooter from '../Footer';

jest.mock('@pagopa/mui-italia', () => ({
  Footer: (props: any) => (
    <div data-testid="mui-footer">
      {props.loggedUser && 'Logged Footer'}
      {props.legalInfo}
      {props.postLoginLinks?.map((link: any, index: number) => (
        <a key={index} href={link.href}>{link.label}</a>
      ))}
    </div>
  ),
}));

jest.mock('@pagopa/selfcare-common-frontend/lib', () => ({
  Footer: (props: any) => (
    <div data-testid="prelogin-footer">
      {!props.loggedUser && 'Pre-login Footer'}
    </div>
  ),
}));

describe('CustomFooter', () => {
  test('renders logged-in footer when isLogged is true (default)', () => {
    render(<CustomFooter />);

    expect(screen.getByTestId('mui-footer')).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('Logged Footer'))).toBeInTheDocument();
    expect(screen.getByText('Informativa Privacy')).toBeInTheDocument();
    expect(screen.getByText('Termini e condizioni d’uso')).toBeInTheDocument();
  });

  // test('renders pre-login footer when isLogged is false', () => {
  //   render(<CustomFooter isLogged={false} />);

  //   expect(screen.getByTestId('prelogin-footer')).toBeInTheDocument();
  //   expect(screen.getByText('Pre-login Footer')).toBeInTheDocument();
  // });
});
