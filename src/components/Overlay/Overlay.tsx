import { Box, CircularProgress } from "@mui/material";
import { theme } from '@pagopa/mui-italia';

const Overlay = () => (
    <Box
        height={'50vh'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        bgcolor={theme.palette.background.default}
    >
        <CircularProgress />
    </Box>
);

export default Overlay;
