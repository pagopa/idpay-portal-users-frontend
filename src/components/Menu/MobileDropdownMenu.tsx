import { useState } from 'react';
import {
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { ButtonNaked, theme } from '@pagopa/mui-italia';

interface Props {
  selectedIndex: number;
  onItemClick: (index: number) => void;
  items: string[];
}

export const MobileDropdownMenu = ({ selectedIndex, onItemClick, items }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const toggleDrawer = (value: boolean) => () => setOpen(value);

  const handleClick = (index: number) => {
    onItemClick(index);
    setOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          px: 3,
          pl: 2,
          py: 1,
          bgcolor: theme.palette.background.paper,
          color: theme.palette.common.white,
          borderStyle: 'solid',
          borderBottomWidth: 1,
          borderBottomColor: theme.palette.divider,
        }}
      >
        <ButtonNaked
          startIcon={<MenuIcon />}
          color="text"
          onClick={toggleDrawer(true)}
        >
          <Typography sx={{ fontWeight: theme.typography.fontWeightMedium }}>
            {t('dashboard.menu')}
          </Typography>
        </ButtonNaked>
      </Box>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: '100%',
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}
        >
          <IconButton
            onClick={toggleDrawer(false)}
            sx={{ color: theme.palette.text.primary }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <List component="nav" disablePadding data-testid="menu-list">
          {items.map((element, i) => (
            <ListItemButton
              key={i}
              selected={selectedIndex === i}
              onClick={() => handleClick(i)}
              data-testid={`menu-item-${i}`}
              sx={{
                justifyContent: 'flex-start',
                pr: 3,
                pl: 6,
                py: 1.5,
                backgroundColor:
                  selectedIndex === i ? '#E8F1FF' : 'transparent',
                borderRight:
                  selectedIndex === i
                    ? '3px solid #0073E6'
                    : '3px solid transparent',
                '&:hover': { backgroundColor: '#F4F6F8' },
              }}
            >
              <ListItemText
                primary={t(element)}
                primaryTypographyProps={{
                  fontWeight: selectedIndex === i ? 600 : 400,
                  color:
                    selectedIndex === i
                      ? theme.palette.text.primary
                      : '#334155',
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
};