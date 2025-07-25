import { Box } from '@mui/material';
import VerifyRequirementForm from '../../components/VerifyRequirement/VerifyRequirementForm';


const VerifyRequirements: React.FC = () => {



    return (
        <Box
            sx={{
                overflowX: 'clip',
                flexDirection: 'column',
                justifyContent: 'center',
                py: 4,
            }}
        >
            <VerifyRequirementForm />
        </Box>
    );
};

export default VerifyRequirements;