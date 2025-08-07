import { Box, TextField, Typography } from '@mui/material';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholderLabel?: string;
  descriptionLabel?: string;
  showSubmitError?: boolean;
  errorMessage?: string;
};

const EmailInputBox = ({
  value,
  onChange,
  placeholderLabel,
  descriptionLabel,
  showSubmitError = false,
  errorMessage,
}: Props) => {
  return (
    <Box display="flex" flexDirection="column">
      <TextField
        label={placeholderLabel}
        variant="outlined"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={showSubmitError}
        helperText={showSubmitError ? errorMessage : ''}
        fullWidth
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
