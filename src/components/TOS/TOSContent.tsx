import { Box, Container, Typography, List, ListItem, Link, Button } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { theme } from '@pagopa/mui-italia';

interface Props {
  sectionRefs: React.RefObject<HTMLDivElement>[];
}

export const TOSContent = ({ sectionRefs }: Props) => {
  const { t } = useTranslation();
  
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

        <Typography sx={{ color: theme.palette.primary.main, fontWeight: theme.typography.fontWeightMedium, mb: 4 }}>
          <Link href="" underline="always" target="_blank">
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

        <Typography sx={{ color: theme.palette.primary.main, fontWeight: theme.typography.fontWeightMedium, mb: 4, mt: 2 }}>
          <Link href="" underline="always" target="_blank">
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

        <Typography sx={{ color: theme.palette.text.primary }} mt={5}>
          <Trans
            i18nKey="tos.privacy"
            components={{
              a: <Box component="span" sx={{ color: theme.palette.primary.main, cursor: 'pointer' }} />,
            }}
          />
        </Typography>
      </Box>
      <Box sx={{py: 6, }}>
        <Button variant="outlined" color='error' sx={{mr: {md: 2, sm: 1, xs: 1},}}>{t('exit')}</Button>
        <Button variant="contained">{t('tos.continue')}</Button>
      </Box>
    </Container>
  );
};