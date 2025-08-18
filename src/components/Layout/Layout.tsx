import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import Header from '../Header/Header';
import Sidebar from '../Menu/Sidebar';
import { loadingRef } from '../../utils/loadingOverlay';
import Overlay from '../Overlay/Overlay';
import { Footer } from '@pagopa/selfcare-common-frontend/lib';

type LayoutProps = {
  children: React.ReactNode;
  hasSidebar?: boolean;
  hasSubHeader?: boolean;
  hasPadding?: boolean;
  isLogged?: boolean;
};

const Layout = ({ children, hasSidebar = true, hasSubHeader = true, hasPadding = true, isLogged = true }: LayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const toggleSidebar = () => setCollapsed((prev) => !prev);

  useEffect(() => {
    loadingRef.setLoading = setLoading;
  }, []);



  return (
      <Box
        display="grid"
        gridTemplateColumns="1fr"
        gridTemplateRows="auto 1fr auto"
        gridTemplateAreas={`"header"
                          "body"
                          "footer"`}
        minHeight="100vh"
      >
        {loading && <Overlay />}
        <Box component="header" gridArea="header">
          <Header hasSubHeader={hasSubHeader} />
        </Box>

        <Box component="main" display="flex" gridArea="body" flexGrow={1} minHeight={0}>
          {hasSidebar &&
            <Box
              width={collapsed ? 64 : 240}
              bgcolor={theme.palette.background.paper}
              sx={{
                transition: 'width 0.3s ease'
              }}
            >
              <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
            </Box>}

          <Box
            flexGrow={1}
            p={hasPadding ? 3 : 0}
            overflow={'auto'}
            minHeight={'100%'}
          >
            {children}
          </Box>
        </Box>

        <Box gridArea="footer"  id="footerBox">
          <Footer loggedUser={false} />
        </Box>
      </Box>
  );
};

export default Layout;