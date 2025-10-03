import { Box } from "@mui/material";
import WaitingContent from "../../components/WaitingPage/WaitingContent";
import { useLocation } from "react-router-dom";

const WaitingPage = () => {
    const location = useLocation()
    const payload = location.state;

    return (
      <Box
        sx={{ py: { xs: 4, sm: 6 }, height: "100%" }}
        display="flex"
        justifyContent="center"
        alignItems="center"
        maxWidth="sm"
        mx="auto"
      >
        <WaitingContent payload={payload} /> 
      </Box>
    );
}
export default WaitingPage;