import { Box } from '@mui/material';
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
    >
      <Box gridArea="header">
        <Header
          withSecondHeader={false}
          onExit={()=>{}}
        />
      </Box>
      
      <Box gridArea="footer">
        <Footer onExit={() =>{}} loggedUser={false} />
      </Box>
    </Box>
  );
};

export default Layout;