import { Box, Typography } from '@mui/material';
import { MITextField } from '@pagopa/mui-italia/components/MITextField';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholderLabel?: string;
  descriptionLabel?: string;
  showSubmitError?: boolean;
  errorMessage?: string;
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
};

const EmailInputBox = ({
  value,
  onChange,
  placeholderLabel,
  descriptionLabel,
  showSubmitError = false,
  errorMessage,
  onPaste,
}: Props) => {
  return (
    <Box display="flex" flexDirection="column">
      <MITextField
        label={placeholderLabel}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value.replace(/\s/g, ''))}
        error={showSubmitError}
        helperText={showSubmitError ? errorMessage : ''}
        fullWidth
        onPaste={onPaste}
        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
          if (event.key === ' ') {
            event.preventDefault();
          }
        }}
      />
      {descriptionLabel && (
        <Typography variant="caption" mt={1}>
          {descriptionLabel}
        </Typography>
      )}
    </Box>
  );
};

export default EmailInputBox;
