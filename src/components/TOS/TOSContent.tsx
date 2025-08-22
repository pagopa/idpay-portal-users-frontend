import { Box, Container, Typography, List, ListItem, Link, Button, Checkbox, FormControl } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { theme } from '@pagopa/mui-italia';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';
import { useState } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  sectionRefs: React.RefObject<HTMLDivElement>[];
}

export const TOSContent = ({ sectionRefs }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState(false);
  const isMobile = useIsMobile();
  const { logout } = useAuth();

  const handleContinue = () => {
    if (!checked) {
      setError(true);
    } else {
      //TODO call API
      navigate(ROUTES.INSERT_EMAIL);
    }
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
              {t('tos.sideMenu.element2.listItem1')}
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
              {t('tos.sideMenu.element2.listItem2')}
            </Typography>
          </ListItem>
        </List>

        <Typography sx={{ color: theme.palette.primary.main, fontWeight: theme.typography.fontWeightMedium, mb: 4, cursor: "pointer" }}>
          <Link onClick={() => { }} underline="always" target="_blank">
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
          <Link onClick={() => { }} underline="always" target="_blank">
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

        <Box mt={5} display="flex" alignItems="center">
          <FormControl sx={{ mr: isMobile ? 2 : 0 }}>
            <Checkbox
              checked={checked}
              onChange={(e) => {
                setChecked(e.target.checked);
                if (e.target.checked) setError(false);
              }}
              color="primary" />
          </FormControl>

          <Box display="flex" flexWrap="wrap" alignItems="center">
            <Typography
              variant='body1'
              sx={{
                lineHeight: '24px',
                color: theme.palette.text.secondary,
              }}
            >
              {t('tos.privacy_part1')}
            </Typography>

            <Link
              onClick={() => { }}
              underline="hover"
              component="button"
              sx={{
                lineHeight: '24px',
                mx: 0.5,
              }}
            >
              <Typography
                variant='body1'
                sx={{
                  lineHeight: '24px',
                  color: theme.palette.primary.main
                }}
              >
                {t('tos.privacy_terms')}
              </Typography>
            </Link>

            <Typography
              variant='body1'
              sx={{
                lineHeight: '24px',
                color: theme.palette.text.secondary,
              }}
            >
              {t('tos.privacy_part2')}
            </Typography>

            <Link
              component="button"
              onClick={() => { }}
              underline="hover"
              sx={{
                lineHeight: '24px',
                mx: 0,
              }}
            >
              <Typography
                variant='body1'
                sx={{
                  lineHeight: '24px',
                  color: theme.palette.primary.main
                }}
              >
                {t('tos.privacy_policy')}
              </Typography>
            </Link>
          </Box>
        </Box>

        {error && (
          <Typography
            variant="caption"
            sx={{ color: theme.palette.error.main, display: "block", mt: 0.5 }}
          >
            {t('commons.mandatoryField')}
          </Typography>
        )}
      </Box>
      <Box sx={{ py: 6 }}>
        <Button variant="outlined" onClick={handleLogout} sx={{ mr: { md: 2, sm: 1, xs: 1 } }}>{t('exit')}</Button>
        <Button variant="contained" onClick={handleContinue}>{t('tos.continue')}</Button>
      </Box>
    </Container>
  );
};