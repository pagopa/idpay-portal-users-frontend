import { Box, Grid, Paper } from '@mui/material';
import DOMPurify from 'dompurify';
import { type ReactNode } from 'react';

type Props =
  | { text: string; children?: never }
  | { text?: never; children: ReactNode };

export const PrivacyAndTosLayout = ({ text, children }: Props) => {

  return (
    <>
      <Box sx={{ width: '100%'}}>
        <Paper elevation={1} square={true}>
          <Box px={4} pt={2} pb={4}>
            <Grid container>
              <Grid size={{ xs: 12 }}>
                {text ? (
                  <div
                    className="content"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }}
                  />
                ) : (
                  children
                )}
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </>
  );
};
