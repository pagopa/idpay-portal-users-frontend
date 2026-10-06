import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Trans, useTranslation } from 'react-i18next';
import { getBaseUrl, getInitiative, getPortalUrl } from '../../utils/env';

interface FaqItem {
  title: string;
  description: string;
}

const isFaqItem = (value: unknown): value is FaqItem => {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<FaqItem>;
  return typeof item.title === 'string' && !!item.title.trim() &&
    typeof item.description === 'string' && !!item.description.trim();
};

const FAQSection: React.FC = () => {
  const { t } = useTranslation();
  const section = t('FAQSection', { returnObjects: true });
  const faqs = typeof section === 'object' && section !== null
    ? Object.entries(section).filter((entry): entry is [string, FaqItem] => isFaqItem(entry[1]))
    : [];
  const linkProps = {
    target: '_blank',
    rel: 'noopener noreferrer',
    sx: { color: '#1976d2', textDecoration: 'none', fontWeight: 500 },
  };

  return (
    <>
      <Box>
        <Typography variant="h4" gutterBottom>
          {t('FAQSection.title')}
        </Typography>
      </Box>

      <Box mt={2}>
        {faqs.map(([key, { title }]) => {
          return (
            <Accordion
              key={key}
              disableGutters
              sx={{
                mb: 3,
                borderRadius: 2,
                boxShadow: 1,
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ px: 2.5, py: 1.5 }}
              >
                <Typography variant="body1" fontWeight={600}>
                  {title}
                </Typography>
              </AccordionSummary>

              <AccordionDetails sx={{ px: 2.5, pt: 0, pb: 2.5 }}>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.6, whiteSpace: 'pre-line' }}
                >
                  <Trans
                    i18nKey={`FAQSection.${key}.description`}
                    components={{
                      products: <Link {...linkProps} href={`${getBaseUrl().replace(/\/+$/, '')}/${getInitiative()}/elenco-prodotti`} />,
                      portal: <Link {...linkProps} href={getPortalUrl('/')} />,
                      decree: <Link {...linkProps} href="https://www.mimit.gov.it/images/stories/normativa/250903___DM_CONTRIBUTO_ACQUISTO_GRANDI_ELETTRODOMESTICI_L_207_2024-nf.pdf" />,
                      eprel: <Link {...linkProps} href="https://eprel.ec.europa.eu/screen/home" />,
                    }}
                  />
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
