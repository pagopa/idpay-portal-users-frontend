import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';

const FAQSection = () => {
    const { t } = useTranslation();

    const faqs = [
        { key: 'firstAccordion' },
        { key: 'secondAccordion' },
        { key: 'thirdAccordion' },
    ];

    return (
        <>
            <Box mb={4}>
                <Typography variant="h4" gutterBottom>
                    {t('FAQSection.title')}
                </Typography>
            </Box>

            <Box mt={4}>
                {faqs.map(({ key }) => (
                    <Accordion
                        key={key}
                        disableGutters
                        sx={{ mb: 3, borderRadius: 2, boxShadow: 1, '&:before': { display: 'none' } }}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2.5, py: 1.5 }}>
                            <Typography variant='body1' fontWeight={600}>
                                {t(`FAQSection.${key}.title`)}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: 2.5, pt: 0, pb: 2.5 }}>
                            <Typography variant="body1">
                                {t(`FAQSection.${key}.description`)}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </>
    );
};

export default FAQSection;