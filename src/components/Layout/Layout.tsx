import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { loadingRef } from '../../utils/loadingOverlay';
import Overlay from '../Overlay/Overlay';
import Header from '../Header/Header';
import { Footer } from '../Footer/Footer';

type LayoutProps = {
  children: React.ReactNode;
  hasPadding?: boolean;
  showFooter?: boolean;
  showHeaderProduct?: boolean;
  showUserActions?: boolean;
  bodyOverflow?: 'auto' | 'hidden';
};

const Layout = ({
  children,
  hasPadding = true,
  showFooter = true,
  showHeaderProduct = true,
  showUserActions = true,
  bodyOverflow = 'auto',
}: LayoutProps) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadingRef.setLoading = setLoading;
  }, []);

  return (
    <Box
      display="grid"
      gridTemplateColumns="1fr"
      gridTemplateRows={showFooter ? 'auto 1fr auto' : 'auto 1fr'}
      gridTemplateAreas={showFooter ? `"header" "body" "footer"` : `"header" "body"`}
      minHeight="100vh"
    >
      {loading && <Overlay />}

      <Box component="header" gridArea="header">
        <Header showProduct={showHeaderProduct} showUserActions={showUserActions} />
      </Box>

      <Box component="main" gridArea="body" display='flex' flexGrow={1} minHeight={0}>
        <Box
          flexGrow={1}
          p={hasPadding ? 3 : 0}
          overflow={bodyOverflow}
          minHeight="100%"
        >
          {children}
        </Box>
      </Box>

      {showFooter && (
        <Box gridArea="footer" id="footerBox">
          <Footer />
        </Box>
      )}
    </Box>
  );
};

export default Layout;
