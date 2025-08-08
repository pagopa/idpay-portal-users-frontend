import { Footer, type PreLoginFooterLinksType } from '@pagopa/mui-italia';
import { Footer as PreLoginFooter} from '@pagopa/selfcare-common-frontend/lib'

const pagoPALink = {
    href: 'https://www.pagopa.it/',
    ariaLabel: 'Vai al sito di PagoPA',
};

const companyLegalInfo = (
    <>
        <strong>PagoPA S.p.A.</strong> - Società per azioni con socio unico -
        Capitale sociale di euro 1,000,000 interamente versato -
        Sede legale in Roma, Piazza Colonna 370, CAP 00187 -
        N. di iscrizione a Registro Imprese di Roma, CF e P.IVA 15376371009
    </>
);

const postLoginLinks = [
    {
        label: 'Informativa Privacy',
        ariaLabel: 'Informativa Privacy',
        href: '',
        linkType: 'external' as const
    },
    {
        label: 'Diritto alla protezione dei dati personali',
        ariaLabel: 'Diritto alla protezione dei dati personali',
        href: '',
        linkType: 'external' as const
    },
    {
        label: 'Termini e condizioni d’uso',
        ariaLabel: 'Termini e condizioni d’uso',
        href: '',
        linkType: 'external' as const
    },
    {
        label: 'Accessibilità',
        ariaLabel: 'Accessibilità',
        href: '',
        linkType: 'external' as const
    }
];

const LANGUAGES = {
    it: {
        it: 'Italiano'
    },
};

const CustomFooter = ({isLogged = true}) => (
    <>
        { isLogged ?
            <Footer
                loggedUser={true}
                companyLink={pagoPALink}
                legalInfo={companyLegalInfo}
                postLoginLinks={postLoginLinks}
                preLoginLinks={{} as PreLoginFooterLinksType}
                currentLangCode="it"
                onLanguageChanged={() => { }}
                languages={LANGUAGES}
                hideProductsColumn={false}
            />
            : 
            <PreLoginFooter loggedUser={false} onExit={() => {}} />
        }
    </>
);

export default CustomFooter;
