import React from 'react';
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Link
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import { getBaseUrl } from '../../utils/env';

interface FaqLink {
    text: string;
    href: string;
}

interface FaqItem {
    key: string;
    links?: FaqLink[];
}

const FAQSection: React.FC = () => {
    const { t } = useTranslation();

    const faqs: FaqItem[] = [
        { key: 'firstAccordion' },
        { key: 'secondAccordion' },
        {
            key: 'thirdAccordion',
            links: [
                {
                    text: 'Decreto interministeriale',
                    href: 'https://www.mimit.gov.it/images/stories/normativa/250903___DM_CONTRIBUTO_ACQUISTO_GRANDI_ELETTRODOMESTICI_L_207_2024-nf.pdf'
                },
                {
                    text: 'in questa lista',
                    href: `${getBaseUrl()}/elenco-informatico-elettrodomestici`
                }
            ]
        },
        { key: 'fourthAccordion' },
        { key: 'fifthAccordion' },
        { key: 'sixthAccordion' },
        { key: 'seventhAccordion' },
        { key: 'eighthAccordion' },
        {
            key: 'ninthAccordion',
            links: [
                {
                    text: 'EPREL',
                    href: 'https://eprel.ec.europa.eu/screen/home'
                }
            ]
        },
        {
            key: 'tenthAccordion',
            links: [
                {
                    text: 'bonuselettrodomestici.it',
                    href: getBaseUrl()
                }
            ]
        },
        { key: 'eleventhAccordion' },
        { key: 'twelfthAccordion' }
    ];

    const renderDescription = (text: string, links?: FaqLink[]): React.ReactNode => {
        if (!links || links.length === 0) return text;

        const parts: React.ReactNode[] = [];
        let lastIndex = 0;

        links.forEach((link) => {
            const index = text.indexOf(link.text, lastIndex);
            if (index === -1) return;

            parts.push(text.slice(lastIndex, index));

            parts.push(
                <Link
                    key={link.text}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                        color: '#1976d2',
                        textDecoration: 'none',
                        fontWeight: 500
                    }}
                >
                    {link.text}
                </Link>
            );

            lastIndex = index + link.text.length;
        });

        parts.push(text.slice(lastIndex));

        return parts;
    };

    return (
        <>
            <Box>
                <Typography variant="h4" gutterBottom>
                    {t('FAQSection.title')}
                </Typography>
            </Box>

            <Box mt={2}>
                {faqs.map(({ key, links }) => {
                    const title = t(`FAQSection.${key}.title`);
                    const description = t(`FAQSection.${key}.description`);

                    return (
                        <Accordion
                            key={key}
                            disableGutters
                            sx={{
                                mb: 3,
                                borderRadius: 2,
                                boxShadow: 1,
                                '&:before': { display: 'none' }
                            }}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2.5, py: 1.5 }}>
                                <Typography variant="body1" fontWeight={600}>
                                    {title}
                                </Typography>
                            </AccordionSummary>

                            <AccordionDetails sx={{ px: 2.5, pt: 0, pb: 2.5 }}>
                                <Typography variant="body1" sx={{ lineHeight: 1.6, whiteSpace: 'pre-line', }}>
                                    {renderDescription(description, links)}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
            </Box>
        </>
    );
};

export default FAQSection;