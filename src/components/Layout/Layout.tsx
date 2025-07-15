import { Box, Typography } from '@mui/material';
import { Footer } from '@pagopa/selfcare-common-frontend/lib';

import Header from '../Header/Header';


const Layout = () => {

  return (
    <Box
      display="grid"
      gridTemplateColumns="1fr"
      gridTemplateRows="auto 1fr auto"
      gridTemplateAreas={`"header"
                          "body"
                          "footer"`}
      minHeight="100vh"
      overflow="hidden"
    >
      <Box gridArea="header">
        <Header
          withSecondHeader={false}
          onExit={()=>{}}
        />
      </Box>
      <Box
        gridArea="body"
        display="flex"
        justifyContent="center"
        alignItems="center"
        overflow="hidden"
      >
        <Typography>Portale Utenti</Typography>
      </Box>
      <Box gridArea="footer" overflow="hidden">
        <Footer onExit={() =>{}} loggedUser={true} />
      </Box>
    </Box>
  );
};

export default Layout;