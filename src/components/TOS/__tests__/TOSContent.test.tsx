import { render, screen } from '@testing-library/react';
import { TOSContent } from '../TOSContent';
import '@testing-library/jest-dom';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  Trans: ({ i18nKey }: { i18nKey: string }) => <>{i18nKey}</>,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('TOSContent', () => {
  const sectionRefs = [
    { current: document.createElement('div') },
    { current: document.createElement('div') },
    { current: document.createElement('div') },
    { current: document.createElement('div') },
  ];

  test('renders all section titles', () => {
    render(<TOSContent sectionRefs={sectionRefs} />);

    expect(screen.getByText('tos.sideMenu.element1.title')).toBeInTheDocument();
    expect(screen.getByText('tos.sideMenu.element2.title')).toBeInTheDocument();
    expect(screen.getByText('tos.sideMenu.element3.title')).toBeInTheDocument();
    expect(screen.getByText('tos.sideMenu.element4.title')).toBeInTheDocument();
  });

  test('renders descriptions and Trans elements', () => {
    render(<TOSContent sectionRefs={sectionRefs} />);

    expect(screen.getByText('tos.sideMenu.element1.description')).toBeInTheDocument();
    expect(screen.getByText('tos.sideMenu.element2.description')).toBeInTheDocument();
    expect(screen.getByText('tos.sideMenu.element3.description')).toBeInTheDocument();
    expect(screen.getByText('tos.sideMenu.element4.description')).toBeInTheDocument();
    expect(screen.getByText('tos.postDescription')).toBeInTheDocument();
    expect(screen.getByText('tos.privacy')).toBeInTheDocument();
  });

  test('renders list items in section 2', () => {
    render(<TOSContent sectionRefs={sectionRefs} />);

    expect(screen.getByText('tos.sideMenu.element2.listItem1')).toBeInTheDocument();
    expect(screen.getByText('tos.sideMenu.element2.listItem2')).toBeInTheDocument();
  });

  test('renders links with correct text', () => {
    render(<TOSContent sectionRefs={sectionRefs} />);

    expect(screen.getByText('tos.sideMenu.element2.link')).toBeInTheDocument();
    expect(screen.getByText('tos.sideMenu.element4.link')).toBeInTheDocument();
  });

  test('renders exit and continue buttons', () => {
    render(<TOSContent sectionRefs={sectionRefs} />);

    expect(screen.getByText('exit')).toBeInTheDocument();
    expect(screen.getByText('tos.continue')).toBeInTheDocument();
  });
});
