import { Box, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { validateEmail } from '../../utils/validateEmail';

type Props = {
  onChange?: (email: string, isValid: boolean) => void;
  placeholderLabel?: string;
  descriptionLabel?: string;
  showSubmitError?: boolean;
  errorMessage?: string;
};

const EmailInputBox = ({
  onChange,
  placeholderLabel,
  descriptionLabel,
  showSubmitError = false,
  errorMessage,
}: Props) => {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isValid = validateEmail(value);
    setValue(value);
    onChange?.(value, isValid);
  };

  return (
    <Box display="flex" flexDirection="column">
      <TextField
        label={placeholderLabel}
        variant="outlined"
        value={value}
        onChange={handleChange}
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
