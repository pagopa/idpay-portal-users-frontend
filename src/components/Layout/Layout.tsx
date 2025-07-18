import { useState } from 'react';
import { Box } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { Outlet, useMatches } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import CustomFooter from '../Footer/Footer';

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed((prev) => !prev);

  const matches = useMatches();
  const lastMatch = matches[matches.length - 1];
  const hasSidebar = (lastMatch?.handle as { hasSidebar?: boolean })?.hasSidebar ?? true;

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      bgcolor={theme.palette.background.default}
    >
      <Box component="header">
        <Header />
      </Box>

      <Box component="main" display="flex" flexGrow={1} minHeight={0}>
        {hasSidebar && 
          <Box
            width={collapsed ? 64 : 240}
            bgcolor={theme.palette.background.paper}
            sx={{
              transition: 'width 0.3s ease'
            }}
          >
            <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
          </Box>
        }

        <Box
          flexGrow={1}
          p={3}
          overflow={'auto'}
          minHeight={'100%'}
        >
          <Outlet />
        </Box>
      </Box>

      <CustomFooter />
    </Box>
  );
};

export default Layout;