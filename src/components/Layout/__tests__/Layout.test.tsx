import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Layout from '../Layout';
import { loadingRef } from '../../../utils/loadingOverlay';

jest.mock('../../Header/Header', () => {
  return function MockHeader() {
    return (
      <div data-testid="header" >
        Header
      </div>
    );
  };
});

jest.mock('../../Overlay/Overlay', () => {
  return function MockOverlay() {
    return <div data-testid="overlay">Loading...</div>;
  };
});

jest.mock('../../Footer/Footer', () => ({
  Footer: (props: any) => (
    <div data-testid="footer" data-logged-user={props?.loggedUser ? 'true' : 'false'}>
      Footer
    </div>
  ),
}));

describe('Layout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders layout with header, content, and footer by default', () => {
    render(
      <Layout>
        <div data-testid="content">Test Content</div>
      </Layout>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('renders overlay when loading is true', async () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();

    loadingRef.setLoading?.(true);

    await waitFor(() => {
      expect(screen.getByTestId('overlay')).toBeInTheDocument();
    });

    loadingRef.setLoading?.(false);

    await waitFor(() => {
      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });
  });

  test('does not render overlay when loading is false', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
  });

  test('renders Footer', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('applies layout props correctly', () => {
    render(
      <Layout hasPadding={false}>
        <div data-testid="content">Content</div>
      </Layout>
    );

    expect(screen.getByTestId('content')).toBeInTheDocument();
  });
});