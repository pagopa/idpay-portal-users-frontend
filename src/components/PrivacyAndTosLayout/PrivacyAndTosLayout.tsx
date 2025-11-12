import { Box, Grid, Paper } from '@mui/material';
import DOMPurify from 'dompurify';

export const PrivacyAndTosLayout = ({ text }: { text: string }) => {

  return (
    <>
      <Box sx={{ width: '100%'}}>
        <Paper elevation={1} square={true}>
          <Box px={4} pt={2} pb={4}>
            <Grid container>
              <Grid size={{ xs: 12 }}>
                <div
                  className="content"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }}
                />
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </>
  );
};