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

    return (
        <>
            <Box mb={4}>
                <Typography variant="h4" gutterBottom>
                    {t('FAQSection.title')}
                </Typography>
            </Box>

            <Box mt={4}>
                <Accordion disableGutters sx={{ mb: 3, borderRadius: 2, boxShadow: 1, '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2.5, py: 1.5 }}>
                        <Typography variant='body1' fontWeight={600}>
                            {t('FAQSection.firstAccordion.title')}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 2.5, pt: 0, pb: 2.5 }}>
                        <Typography variant="body1">
                            {t('FAQSection.firstAccordion.description')}
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion disableGutters sx={{ mb: 3, borderRadius: 2, boxShadow: 1, '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2.5, py: 1.5 }}>
                        <Typography variant='body1' fontWeight={600}>
                            {t('FAQSection.secondAccordion.title')}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 2.5, pt: 0, pb: 2.5 }}>
                        <Typography variant="body1">
                            {t('FAQSection.secondAccordion.description')}
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion disableGutters sx={{ mb: 3, borderRadius: 2, boxShadow: 1, '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2.5, py: 1.5 }}>
                        <Typography variant='body1' fontWeight={600}>
                            {t('FAQSection.thirdAccordion.title')}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 2.5, pt: 0, pb: 2.5 }}>
                        <Typography variant="body1">
                            {t('FAQSection.thirdAccordion.description')}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </>
    );
};

export default FAQSection;