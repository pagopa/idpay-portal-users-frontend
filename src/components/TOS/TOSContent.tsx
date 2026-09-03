import { Box, Container, Typography, List, ListItem, Link, Button } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { theme } from '@pagopa/mui-italia';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';
import { useAuth } from '../../contexts/AuthContext';
import { useTOSCheckboxStore } from '../../hooks/useTOSCheckboxStore';
import { getBaseUrl, getInitiative, getPortalUrl } from '../../utils/env';

interface Props {
  sectionRefs: React.RefObject<HTMLDivElement>[];
}

export const TOSContent = ({ sectionRefs }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setTosAccepted } = useTOSCheckboxStore();
  const { logout } = useAuth();

  const handleContinue = () => {
    setTosAccepted(true);
    navigate(ROUTES.INSERT_EMAIL);
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <Container sx={{ width: '100%', px: '10%' }}>
      <Box ref={sectionRefs[0]}>
        <Typography variant="h6" sx={{ fontWeight: theme.typography.fontWeightBold, color: theme.palette.text.primary }}>
          {t('tos.sideMenu.element1.title')}
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.primary }} mt={2} mb={4}>
          <Trans
            i18nKey="tos.sideMenu.element1.description"
            components={{
              bold: <Box component="span" sx={{ fontWeight: theme.typography.fontWeightBold }} />,
              br: <br />
            }}
          />
        </Typography>
      </Box>

      <Box ref={sectionRefs[1]}>
        <Typography variant="h6" sx={{ fontWeight: theme.typography.fontWeightBold, color: theme.palette.text.primary }}>
          {t('tos.sideMenu.element2.title')}
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.primary }} mt={2}>
          <Trans
            i18nKey="tos.sideMenu.element2.description"
            components={{
              bold: <Box component="span" sx={{ fontWeight: theme.typography.fontWeightBold }} />,
              br: <br />
            }}
          />
        </Typography>

        <List sx={{ pl: 2 }}>
          <ListItem sx={{ display: 'flex', pl: 0 }}>
            <Box
              sx={{
                width: 6,
                height: 6,
                bgcolor: 'text.primary',
                mr: 1,
                flexShrink: 0,
              }}
            />
            <Typography variant="body1">
              <Trans
                i18nKey="tos.sideMenu.element2.listItem1"
                components={{
                  bold: <Box component="span" sx={{ fontWeight: theme.typography.fontWeightBold }} />,
                  br: <br />
                }}
              />
            </Typography>
          </ListItem>
          <ListItem sx={{ display: 'flex', pl: 0 }}>
            <Box
              sx={{
                width: 6,
                height: 6,
                bgcolor: 'text.primary',
                mr: 1,
                flexShrink: 0,
              }}
            />
            <Typography variant="body1">
              <Trans
                i18nKey="tos.sideMenu.element2.listItem2"
                components={{
                  bold: <Box component="span" sx={{ fontWeight: theme.typography.fontWeightBold }} />,
                  br: <br />
                }}
              />
            </Typography>
          </ListItem>
        </List>

        <Typography variant="body1" sx={{ color: theme.palette.text.primary }} mb={2}>
          {t('tos.sideMenu.element2.subDescription')}
        </Typography>

        <Typography sx={{ color: theme.palette.primary.main, fontWeight: theme.typography.fontWeightMedium, mb: 4, cursor: "pointer" }}>
          <Link
            onClick={() => {
              const fullUrl = `${getBaseUrl()}/elenco-informatico-elettrodomestici`;
              window.open(fullUrl, '_blank')?.focus();
            }}
            underline="always"
            sx={{ cursor: 'pointer' }}
          >
            {t('tos.sideMenu.element2.link')}
          </Link>
        </Typography>
      </Box>

      <Box ref={sectionRefs[2]}>
        <Typography variant="h6" sx={{ fontWeight: theme.typography.fontWeightBold, color: theme.palette.text.primary }}>
          {t('tos.sideMenu.element3.title')}
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.primary }} mt={2} mb={4}>
          <Trans
            i18nKey="tos.sideMenu.element3.description"
            components={{
              bold: <Box component="span" sx={{ fontWeight: theme.typography.fontWeightBold }} />,
              br: <br />
            }}
          />
        </Typography>
      </Box>

      <Box ref={sectionRefs[3]}>
        <Typography variant="h6" sx={{ fontWeight: theme.typography.fontWeightBold, color: theme.palette.text.primary }}>
          {t('tos.sideMenu.element4.title')}
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.primary }} mt={2}>
          <Trans
            i18nKey="tos.sideMenu.element4.description"
            components={{
              bold: <Box component="span" sx={{ fontWeight: theme.typography.fontWeightBold }} />,
              br: <br />
            }}
          />
        </Typography>

        <Typography sx={{ color: theme.palette.primary.main, fontWeight: theme.typography.fontWeightMedium, mb: 4, mt: 2, cursor: "pointer" }}>
          <Link
            onClick={() => {
              const fullUrl = `${getBaseUrl()}/${getInitiative()}/lista-punti-vendita`;
              window.open(fullUrl, '_blank')?.focus();
            }}
            underline="always"
            sx={{ cursor: 'pointer' }}
          >
            {t('tos.sideMenu.element4.link')}
          </Link>
        </Typography>

        <Typography sx={{ color: theme.palette.text.primary }} my={5}>
          <Trans
            i18nKey="tos.postDescription"
            components={{
              bold: <Box component="span" sx={{ fontWeight: theme.typography.fontWeightBold }} />,
            }}
          />
        </Typography>

        <Box mt={5} mb={4}>
          <Typography
            component="div"
            variant='body1'
            sx={{
              lineHeight: '24px',
              color: theme.palette.text.primary,
              '& a': {
                display: 'inline',
                margin: 0,
                padding: 0,
              }
            }}
          >
            {t('tos.privacy_part1')}{' '}
            <Link
              onClick={() => { 
                const fullUrl = getPortalUrl(ROUTES.TERMS_OF_SERVICE);
                window.open(fullUrl, '_blank')?.focus();
              }}
              underline="always"
              component="span"
              sx={{
                fontWeight: theme.typography.fontWeightMedium,
                color: theme.palette.primary.main,
                cursor: "pointer",
              }}
            >
              {t('tos.privacy_terms')}
            </Link>
            {' '}{t('tos.privacy_part2')}
            <Link
              component="span"
              onClick={() => { 
                const fullUrl = getPortalUrl(ROUTES.PRIVACY_POLICY);
                window.open(fullUrl, '_blank')?.focus();
              }}
              underline="always"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: theme.typography.fontWeightMedium,
                cursor: "pointer",
              }}
            >
              {t('tos.privacy_policy')}
            </Link>
            {' '}{t('tos.privacy_part3')}
          </Typography>
        </Box>

      </Box>
      <Box sx={{ py: 6 }}>
        <Button variant="outlined" onClick={handleLogout} sx={{ mr: { md: 2, sm: 1, xs: 1 } }}>{t('common.exit')}</Button>
        <Button variant="contained" onClick={handleContinue}>{t('tos.continue')}</Button>
      </Box>
    </Container>
  );
};
