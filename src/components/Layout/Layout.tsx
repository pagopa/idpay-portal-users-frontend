import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { loadingRef } from '../../utils/loadingOverlay';
import Overlay from '../Overlay/Overlay';
import Header from '../Header/Header';
import { Footer } from '../Footer/Footer';

type LayoutProps = {
  children: React.ReactNode;
  hasPadding?: boolean;
};

const Layout = ({ children, hasPadding = true }: LayoutProps) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadingRef.setLoading = setLoading;
  }, []);

  return (
    <Box
      display="grid"
      gridTemplateColumns="1fr"
      gridTemplateRows="auto 1fr auto"
      gridTemplateAreas={`"header" "body" "footer"`}
      minHeight="100vh"
    >
      {loading && <Overlay />}

      <Box component="header" gridArea="header">
        <Header />
      </Box>

      <Box component="main" gridArea="body" display='flex' flexGrow={1} minHeight={0}>
        <Box
          flexGrow={1}
          p={hasPadding ? 3 : 0}
          overflow="auto"
          minHeight="100%"
        >
          {children}
        </Box>
      </Box>

      <Box gridArea="footer" id="footerBox">
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;
