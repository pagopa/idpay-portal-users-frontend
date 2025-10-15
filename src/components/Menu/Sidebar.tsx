import { useState } from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import MenuIcon from '@mui/icons-material/Menu';
import { useTranslation } from 'react-i18next';
import { ConfirmationNumberRounded, HelpRounded } from '@mui/icons-material';

type SidebarProps = {
  collapsed: boolean;
  toggleSidebar: () => void;
  onSectionChange: (section: 'bonus' | 'faq') => void;
};

const Sidebar = ({ collapsed, toggleSidebar, onSectionChange }: SidebarProps) => {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (index: number, section: 'bonus' | 'faq') => {
    setSelectedIndex(index);
    onSectionChange(section);
  };

  return (
    <Box
      width={collapsed ? 64 : 300}
      height="100%"
      bgcolor={theme.palette.background.paper}
      borderRight="1px solid #e0e0e0"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      sx={{
        minHeight: '80vh',
        transition: 'width 0.3s ease',
      }}
    >
      <List component="nav">
        <ListItemButton
          selected={selectedIndex === 0}
          onClick={() => handleListItemClick(0, 'bonus')}
          sx={{
            justifyContent: 'flex-start',
            px: 2,
            mt: 1.5,
          }}
        >
          <ListItemIcon sx={{ minWidth: collapsed ? 'auto' : undefined }}>
            <ConfirmationNumberRounded />
          </ListItemIcon>
          {!collapsed && <ListItemText primary={t('dashboard.title')} slotProps={{
            primary: {
              noWrap: true,
              sx: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
            },
          }} />}
        </ListItemButton>

        <ListItemButton
          selected={selectedIndex === 1}
          onClick={() => handleListItemClick(1, 'faq')}
          sx={{
            justifyContent: 'flex-start',
            px: 2,
            mt: 0.5,
          }}
        >
          <ListItemIcon sx={{ minWidth: collapsed ? 'auto' : undefined }}>
            <HelpRounded />
          </ListItemIcon>
          {!collapsed && <ListItemText primary={t('dashboard.faq')} slotProps={{
            primary: {
              noWrap: true,
              sx: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
            },
          }} />}
        </ListItemButton>
      </List>

      <Box sx={{ p: 1, mt: 'auto' }}>
        <IconButton onClick={toggleSidebar}>
          <MenuIcon sx={{ color: theme.palette.text.primary }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Sidebar;