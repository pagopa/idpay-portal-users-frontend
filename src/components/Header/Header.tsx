import {
  HeaderAccount,
  HeaderProduct,
  type ProductEntity,
  type RootLinkType
} from '@pagopa/mui-italia';

export type HeaderProps = {
  onAssistanceClick?: () => void;
  hasSubHeader: boolean;
};

export const Header = (props: HeaderProps) => {
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

  return (
    <>
      <HeaderAccount
        rootLink={pagopaLink}
        enableLogin={false}
        enableDropdown
        onAssistanceClick={onAssistanceClick}
      />
      { hasSubHeader &&
        <HeaderProduct
          productsList={[product]}
        />
      }
    </>
  );
};

export default Header;