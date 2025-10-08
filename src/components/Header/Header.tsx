import {
  HeaderAccount,
  HeaderProduct,
  JwtUser,
  type ProductEntity,
  type RootLinkType
} from '@pagopa/mui-italia';
import { useAuth } from '../../contexts/AuthContext';

export type HeaderProps = {
  onAssistanceClick?: () => void;
  hasSubHeader: boolean;
};

export const Header = (props: HeaderProps) => {
  const { isAuthenticated, logout, user } = useAuth();
  const { onAssistanceClick = () => null, hasSubHeader } = props;


  const product: ProductEntity = {
    id: '0',
    title: 'Bonus Elettrodomestici',
    productUrl: '',
    linkType: 'internal'
  };

  const pagopaLink: RootLinkType = {
    label: 'PagoPA S.p.A.',
    href: 'https://www.pagopa.it/',
    ariaLabel: 'Link: vai al sito di PagoPA S.p.A.',
    title: 'Sito di PagoPA S.p.A.'
  };

  const authUser: JwtUser = {
    id: user?.id || '1',
    name: user?.firstName,
    surname: user?.lastName,
    email: user?.email
  };

  return (
    <>
      <HeaderAccount
        rootLink={pagopaLink}
        enableLogin={isAuthenticated}
        loggedUser={isAuthenticated ? authUser : undefined}
        onAssistanceClick={onAssistanceClick}
        onLogout={logout}
      />
      {hasSubHeader &&
        <HeaderProduct
          productsList={[product]}
        />
      }
    </>
  );
};

export default Header;