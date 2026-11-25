import { Box, Grid } from '@mui/material';
import { MIPaper } from '@pagopa/mui-italia/components/MIPaper';
import DOMPurify from 'dompurify';
import { type ReactNode } from 'react';

type Props =
  | { text: string; children?: never }
  | { text?: never; children: ReactNode };

export const PrivacyAndTosLayout = ({ text, children }: Props) => {

  return (
    <>
      <Box sx={{ width: '100%', backgroundColor: '#F5F5F5' }}>
        <MIPaper variant="flat" sx={{ backgroundColor: '#F5F5F5' }}>
          <Box px={4} pt={2} pb={4}>
            <Grid container>
              <Grid item xs={12}>
                {text !== undefined ? (
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
        </MIPaper>
      </Box>
    </>
  );
};
