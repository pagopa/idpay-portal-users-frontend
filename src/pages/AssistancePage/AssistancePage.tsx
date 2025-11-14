import {Box, Typography} from '@mui/material';
import {theme} from '@pagopa/mui-italia';
import {useTranslation} from "react-i18next";
import AssistanceEmailForm from "./assistanceEmailForm.tsx";

const AssistancePage = () => {
    const {t} = useTranslation();

    return (
        <Box
            sx={{
                height: '100%',
                overflowX: 'clip',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: theme.palette.background.default,
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    px: {md: "23%", sm: 2, xs: 2},
                    py: {md: 8, sm: 6, xs: 2},
                    mx: {md: 0, sm: 1, xs: 0},
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: "center",
                    textAlign: 'left',
                }}
            >
                <Typography variant="h3" fontWeight="bold" sx={{ width: "100%"}} gutterBottom>
                    {t('assistance.title')}
                </Typography>
                <Typography variant="body1" mb={3} sx={{ width: "100%"}}>
                    {t('assistance.subtitle')}
                </Typography>

                <AssistanceEmailForm />
            </Box>
        </Box>
    );
};

export default AssistancePage;
