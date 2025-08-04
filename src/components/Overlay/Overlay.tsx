import { Box, CircularProgress } from "@mui/material";
import { theme } from '@pagopa/mui-italia';

const Overlay = () => (
  <Box
    position="fixed"
    top={0}
    left={0}
    width="100vw"
    height="100vh"
    display="flex"
    alignItems="center"
    justifyContent="center"
    bgcolor={theme.palette.action.disabledBackground}
  >
    <CircularProgress />
  </Box>
);

export default Overlay;