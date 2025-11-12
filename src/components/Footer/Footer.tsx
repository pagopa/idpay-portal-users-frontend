import { useTranslation } from 'react-i18next';
import { FooterPostLogin, FooterLegal } from '@pagopa/mui-italia';
import ROUTES from '../../routes';
import { getBaseUrl } from '../../utils/env';

const FOOTER_LINKS = {
    COMPANY: 'https://www.pagopa.it/it/',
    PERSONAL_DATA: 'https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8',
    A11Y: 'https://form.agid.gov.it/view/9b5c6ed0-bbbb-11f0-a7e5-9bac06d781c9'
} as const;

const openExternalLink = (url: string) => window.open(url, '_blank')?.focus();

export const Footer = () => {
    const { t } = useTranslation();

    return (
        <>
            <FooterPostLogin
                companyLink={{
                    ariaLabel: 'PagoPA SPA',
                    href: FOOTER_LINKS.COMPANY,
                    onClick: () => openExternalLink(FOOTER_LINKS.COMPANY)
                }}
                links={[
                    {
                        label: t('commons.footer.privacy'),
                        ariaLabel: t('commons.footer.privacy'),
                        href: `${getBaseUrl()}/utente${ROUTES.PRIVACY_POLICY}`,
                        linkType: 'external',
                        onClick: () => openExternalLink(`${getBaseUrl()}/utente${ROUTES.PRIVACY_POLICY}`)
                    },
                    {
                        label: t('commons.footer.personalData'),
                        ariaLabel: t('commons.footer.personalData'),
                        linkType: 'external',
                        href: FOOTER_LINKS.PERSONAL_DATA,
                        onClick: () => openExternalLink(FOOTER_LINKS.PERSONAL_DATA)
                    },
                    {
                        label: t('commons.footer.termsAndConditions'),
                        ariaLabel: t('commons.footer.termsAndConditions'),
                        href: `${getBaseUrl()}/utente${ROUTES.TERMS_OF_SERVICE}`,
                        linkType: 'external',
                        onClick: () => openExternalLink(`${getBaseUrl()}/utente${ROUTES.TERMS_OF_SERVICE}`)
                    },
                    {
                        label: t('commons.footer.a11y'),
                        ariaLabel: t('commons.footer.a11y'),
                        linkType: 'external',
                        onClick: () => openExternalLink(FOOTER_LINKS.A11Y)
                    }
                ]}
                currentLangCode={'it'}
                languages={{
                    it: {
                        it: 'Italiano'
                    }
                }}
                onLanguageChanged={() => { }}
            />
            <FooterLegal
                content={
                    <span style={{ whiteSpace: 'pre-line' }}>
                        <b>{t('commons.footer.PagoPA')}</b> - {t('commons.footer.legalInfo')}
                    </span>
                }
            />
        </>
    );
};