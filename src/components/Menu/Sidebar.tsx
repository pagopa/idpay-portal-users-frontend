import { useState } from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton
} from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import MenuIcon from '@mui/icons-material/Menu';
import { useTranslation } from 'react-i18next';
import { ConfirmationNumberRounded } from '@mui/icons-material';

type SidebarProps = {
  collapsed: boolean;
  toggleSidebar: () => void;
};

const Sidebar = ({ collapsed, toggleSidebar }: SidebarProps) => {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <Box
      width={collapsed ? 64 : 300}
      height={'100%'}
      bgcolor={theme.palette.background.paper}
      borderRight='1px solid #e0e0e0'
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'space-between'}

      sx={{
        transition: 'width 0.3s ease'
      }}
    >
      <List component="nav">
        <ListItemButton
          selected={selectedIndex === 0}
          onClick={() => handleListItemClick(0)}
          sx={{
            justifyContent: collapsed ? 'center' : 'flex-start',
            px: collapsed ? 2 : 3,
            mt: 1.5
          }}
        >
          <ListItemIcon sx={{ minWidth: collapsed ? 'auto' : undefined }}>
            <ConfirmationNumberRounded />
          </ListItemIcon>
          {!collapsed && <ListItemText primary={t('dashboard.title')} />}
        </ListItemButton>
      </List>

      <Box
        sx={{
          p: 1,
          alignSelf: 'flex-start',
        }}
      >
        <IconButton onClick={toggleSidebar}>
          <MenuIcon sx={{ color: theme.palette.text.primary }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Sidebar;