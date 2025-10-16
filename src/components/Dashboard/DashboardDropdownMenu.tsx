import { useState } from 'react';
import {
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { ButtonNaked } from '@pagopa/mui-italia';

type DashboardDropdownMenuProps = {
  selectedSection: 'bonus' | 'faq';
  onSectionChange: (section: 'bonus' | 'faq') => void;
};

const DashboardDropdownMenu = ({ selectedSection, onSectionChange }: DashboardDropdownMenuProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const toggleDrawer = (value: boolean) => () => setOpen(value);

  const menuItems = [
    { id: 'bonus', label: t('dashboard.title') },
    { id: 'faq', label: t('dashboard.faq') },
  ];

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        sx={{
          px: 3,
          py: 1.5,
          borderBottom: '1px solid #E5E5E5',
          backgroundColor: 'white',
        }}
      >
        <ButtonNaked onClick={toggleDrawer(true)} startIcon={<MenuIcon sx={{ color: '#17324D' }} />} sx={{fontSize: "16px"}}>{t('dashboard.menu')}</ButtonNaked>
      </Box>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: '100%',
            backgroundColor: '#fff',
          },
        }}
      >
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          sx={{ p: 2, borderBottom: '1px solid #E5E5E5' }}
        >
          <IconButton onClick={toggleDrawer(false)}>
            <CloseIcon sx={{ color: '#17324D' }} />
          </IconButton>
        </Box>

        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.id}
              selected={selectedSection === item.id}
              onClick={() => {
                onSectionChange(item.id as 'bonus' | 'faq');
                setOpen(false);
              }}
              sx={{
                py: 1.5,
                px: 3,
                backgroundColor: selectedSection === item.id ? '#E8F1FF' : 'transparent',
                borderRight: selectedSection === item.id ? '3px solid #0073E6' : '3px solid transparent',
                '&:hover': { backgroundColor: '#F4F6F8' },
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: selectedSection === item.id ? 600 : 400,
                  color: selectedSection === item.id ? '#17324D' : '#334155',
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default DashboardDropdownMenu;