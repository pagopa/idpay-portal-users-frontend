import {
  HeaderAccount,
  HeaderProduct,
  JwtUser,
  type ProductEntity,
  type RootLinkType
} from '@pagopa/mui-italia';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';

export type HeaderProps = {
  onAssistanceClick?: () => void;
  showProduct?: boolean;
  showUserActions?: boolean;
};

export const Header = (props: HeaderProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const {
    onAssistanceClick = () => navigate(ROUTES.ASSISTANCE),
    showProduct = true,
    showUserActions = true,
  } = props;


  const product: ProductEntity = {
    id: '0',
    title: t('commons.header.productTitle'),
    productUrl: '',
    linkType: 'internal'
  };

  const pagopaLink: RootLinkType = {
    label: t('commons.header.pagopaLinkLabel'),
    href: 'https://www.pagopa.it/',
    ariaLabel: t('commons.header.pagopaLinkAriaLabel'),
    title: t('commons.header.pagopaLinkTitle')
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
        enableLogin={showUserActions && isAuthenticated}
        loggedUser={showUserActions && isAuthenticated ? authUser : undefined}
        onAssistanceClick={showUserActions ? onAssistanceClick : () => undefined}
        enableAssistanceButton={showUserActions && isAuthenticated}
        onLogout={showUserActions ? logout : undefined}
      />
      {showProduct && <HeaderProduct productsList={[product]} />}
    </>
  );
};

export default Header;