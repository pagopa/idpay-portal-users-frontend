import { Footer, FooterLinksType, LangCode, type PreLoginFooterLinksType } from '@pagopa/mui-italia';
import { Trans, useTranslation } from 'react-i18next';
import { CONFIG } from '@pagopa/selfcare-common-frontend/lib/config/env';
import { useState } from 'react';
import { LANGUAGES, pagoPALink } from '@pagopa/selfcare-common-frontend/lib/components/Footer/FooterConfig';
import ROUTES from '../../routes';
import i18n from '@pagopa/selfcare-common-frontend/lib/locale/locale-utils';
import { Box } from '@mui/material';
import style from './styleFooter.module.css';
// import { Footer as PreLoginFooter} from '@pagopa/selfcare-common-frontend/lib'


export default function CustomFooter({ isLogged = true }) {

    const { t } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState<LangCode>();

    const preLoginLinks: PreLoginFooterLinksType = {
        // First column
        aboutUs: {
            title: undefined,
            links: [
                // TODO
                // {
                //   label: 'PNRR',
                //   href: 'CONFIG.FOOTER.LINK.PNRR',
                //   ariaLabel: 'Vai al link: PNRR',
                //   linkType: 'internal',
                // },
                {
                    label: t('commons.footer.preLoginLinks.aboutUs.links.aboutUs'),
                    href: CONFIG.FOOTER.LINK.ABOUTUS,
                    ariaLabel: 'Vai al link: Chi siamo',
                    linkType: 'internal',
                },
                {
                    label: t('commons.footer.preLoginLinks.aboutUs.links.media'),
                    href: CONFIG.FOOTER.LINK.MEDIA,
                    ariaLabel: 'Vai al link: Media',
                    linkType: 'internal',
                },
                {
                    label: t('commons.footer.preLoginLinks.aboutUs.links.workwithud'),
                    href: CONFIG.FOOTER.LINK.WORKWITHUS,
                    ariaLabel: 'Vai al link: Lavora con noi',
                    linkType: 'internal',
                },
            ],
        },
        // Third column
        resources: {
            title: t('commons.footer.preLoginLinks.resources.title'),
            links: [
                {
                    label: t('commons.footer.preLoginLinks.resources.links.privacyPolicy'),
                    //   href: isPnpgDev
                    //     ? 'https://imprese.dev.notifichedigitali.it/informativa-privacy'
                    //     : isPnpgUat
                    //     ? 'https://imprese.uat.notifichedigitali.it/informativa-privacy'
                    //     : isPnpg
                    //     ? 'https://imprese.notifichedigitali.it/informativa-privacy'
                    //     : ROUTES.PRIVACY,
                    href: 'https://imprese.dev.notifichedigitali.it/informativa-privacy',
                    ariaLabel: 'Vai al link: Privacy Policy',
                    linkType: 'internal',
                },
                {
                    label: t('commons.footer.preLoginLinks.resources.links.certifications'),
                    href: CONFIG.FOOTER.LINK.CERTIFICATIONS,
                    ariaLabel: 'Vai al link: Certificazioni',
                    linkType: 'internal',
                },
                {
                    label: t('commons.footer.preLoginLinks.resources.links.informationsecurity'),
                    href: CONFIG.FOOTER.LINK.INFORMATIONSECURITY,
                    ariaLabel: 'Vai al link: Sicurezza delle informazioni',
                    linkType: 'internal',
                },
                {
                    label: t('commons.footer.preLoginLinks.resources.links.protectionofpersonaldata'),
                    href: CONFIG.FOOTER.LINK.PROTECTIONOFPERSONALDATA,
                    ariaLabel: 'Vai al link: Diritto alla protezione dei dati personali',
                    linkType: 'internal',
                },
                {
                    label: t('commons.footer.preLoginLinks.resources.links.cookie'),
                    //   onClick: () => window.OneTrust.ToggleInfoDisplay(),
                    onClick: () => console.log("TODO"),
                    ariaLabel: 'Vai al link: Preferenze Cookie',
                    linkType: 'internal',
                },
                {
                    label: t('commons.footer.preLoginLinks.resources.links.termsandconditions'),
                    //   href: isPnpgDev
                    //     ? 'https://imprese.dev.notifichedigitali.it/termini-di-servizio'
                    //     : isPnpgUat
                    //     ? 'https://imprese.uat.notifichedigitali.it/termini-di-servizio'
                    //     : isPnpg
                    //     ? 'https://imprese.notifichedigitali.it/termini-di-servizio'
                    //     : ROUTES.TOS,
                    href: ROUTES.TOS,
                    ariaLabel: 'Vai al link: Termini e Condizioni',
                    linkType: 'internal',
                },
                {
                    label: t('commons.footer.preLoginLinks.resources.links.transparentcompany'),
                    href: CONFIG.FOOTER.LINK.TRANSPARENTCOMPANY,
                    ariaLabel: 'Vai al link: Società trasparente',
                    linkType: 'internal',
                },
                {
                    label: t('commons.footer.preLoginLinks.resources.links.disclosurePolicy'),
                    href: CONFIG.FOOTER.LINK.DISCLOSUREPOLICY,
                    ariaLabel: 'Vai al link: Responsible Disclosure Policy',
                    linkType: 'internal',
                },
                // {
                //   label: t('commons.footer.preLoginLinks.resources.links.Model321'),
                //   href: CONFIG.FOOTER.LINK.MODEL321,
                //   ariaLabel: 'Vai al link: Modello 321',
                //   linkType: 'internal',
                // },
            ],
        },
        // Fourth column
        followUs: {
            title: t('commons.footer.preLoginLinks.followUs.title'),
            socialLinks: [
                {
                    icon: 'linkedin',
                    title: 'LinkedIn',
                    href: CONFIG.FOOTER.LINK.LINKEDIN,
                    ariaLabel: 'Link: vai al sito LinkedIn di PagoPA S.p.A.',
                },
                {
                    title: 'Twitter',
                    icon: 'twitter',
                    href: CONFIG.FOOTER.LINK.TWITTER,
                    ariaLabel: 'Link: vai al sito Twitter di PagoPA S.p.A.',
                },
                {
                    icon: 'instagram',
                    title: 'Instagram',
                    href: CONFIG.FOOTER.LINK.INSTAGRAM,
                    ariaLabel: 'Link: vai al sito Instagram di PagoPA S.p.A.',
                },
                {
                    icon: 'medium',
                    title: 'Medium',
                    href: CONFIG.FOOTER.LINK.MEDIUM,
                    ariaLabel: 'Link: vai al sito Medium di PagoPA S.p.A.',
                },
            ],
            links: [
                // TODO
                // {
                //   label: 'Accessibilità',
                //   href: CONFIG.FOOTER.LINK.ACCESSIBILITY,
                //   ariaLabel: 'Vai al link: Accessibilità',
                //   linkType: 'internal',
                // },
            ],
        },
    };
    const postLoginLinks: Array<FooterLinksType> = [
        {
            label: t('commons.footer.postLoginLinks.privacyPolicy'),
            //   href: isPnpgDev
            //     ? 'https://imprese.dev.notifichedigitali.it/informativa-privacy'
            //     : isPnpgUat
            //     ? 'https://imprese.uat.notifichedigitali.it/informativa-privacy'
            //     : isPnpg
            //     ? 'https://imprese.notifichedigitali.it/informativa-privacy'
            //     : ROUTES.PRIVACY,
            href: 'https://imprese.dev.notifichedigitali.it/informativa-privacy',
            ariaLabel: 'Vai al link: Privacy policy',
            linkType: 'internal',
        },
        {
            label: t('commons.footer.postLoginLinks.protectionofpersonaldata'),
            href: CONFIG.FOOTER.LINK.PROTECTIONOFPERSONALDATA,
            ariaLabel: 'Vai al link: Diritto alla protezione dei dati personali',
            linkType: 'internal',
        },
        {
            label: t('commons.footer.postLoginLinks.termsandconditions'),
            //   href: isPnpgDev
            //     ? 'https://imprese.dev.notifichedigitali.it/termini-di-servizio'
            //     : isPnpgUat
            //     ? 'https://imprese.uat.notifichedigitali.it/termini-di-servizio'
            //     : isPnpg
            //     ? 'https://imprese.notifichedigitali.it/termini-di-servizio'
            //     : ROUTES.TOS,
            href: ROUTES.TOS,
            ariaLabel: 'Vai al link: Termini e condizioni',
            linkType: 'internal',
        },
        // TODO
        // {
        //   label: 'Accessibilità',
        //   href: CONFIG.FOOTER.LINK.ACCESSIBILITY,
        //   ariaLabel: 'Vai al link: Accessibilità',
        //   linkType: 'internal',
        // },
    ];
    const companyLegalInfo = (
        <Trans i18nKey="commons.footer.legalInfoText">
            <strong>PagoPA S.p.A.</strong> - Società per azioni con socio unico - Capitale sociale di euro
            1,000,000 interamente versato - Sede legale in Roma, Piazza Colonna 370, <br />
            CAP 00187 - N. di iscrizione a Registro Imprese di Roma, CF e P.IVA 15376371009
        </Trans>
    );

  return  <Box className={'style.footer.MuiBox-root>.MuiContainer-root>.MuiGrid-root.MuiGrid-container'}>
        {/* { isLogged ? */}
        <Footer
            loggedUser={isLogged? true :false}
            companyLink={pagoPALink}
            legalInfo={companyLegalInfo}
            postLoginLinks={postLoginLinks}
            preLoginLinks={preLoginLinks}
            languages={LANGUAGES as any}
            hideProductsColumn={false}
            currentLangCode={selectedLanguage}
            onLanguageChanged={async (language: LangCode) => {
                await i18n.changeLanguage(language);
                setSelectedLanguage(language);
            }}
           
        />
        {/* : 
            <Footer 
                loggedUser={false}
                onExit={() => {}}
                companyLink={pagoPALink}
                legalInfo={companyLegalInfo}
                postLoginLinks={postLoginLinks}
                preLoginLinks={{} as PreLoginFooterLinksType}
                currentLangCode="it"
                onLanguageChanged={() => { }}
                languages={LANGUAGES}
                hideProductsColumn={false} />
            // <PreLoginFooter loggedUser={false} onExit={() => {}} />
        } */}
    </Box>
};

