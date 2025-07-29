import React from 'react';
import { Box, Typography, Button, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

type FeedbackContentProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonLabel?: string;
  buttonRedirect?: string;
  supportLinkLabel?: string;
  supportLinkUrl?: string;
};

const FeedbackContent: React.FC<FeedbackContentProps> = ({
  icon,
  title,
  description,
  buttonLabel,
  buttonRedirect,
  supportLinkLabel,
  supportLinkUrl,
}) => {
  const showButton = buttonLabel && buttonRedirect;
  const showSupportLink = supportLinkLabel && supportLinkUrl;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
    >
      <Box mb={3}>{icon}</Box>

      <Typography variant="h4" mb={3}>
        {title}
      </Typography>

      {description.includes('\n') ?
        description.split('\n').map((line, i) => (
          <Typography
            key={i}
            variant="body1"
          >
            {line}
          </Typography>
        ))
        : (
          <Typography variant="body1">
            {description}
          </Typography>
        )}

      {showButton && (
        <Button
          variant="contained"
          component={RouterLink}
          to={buttonRedirect}
          sx={{ mt: 4, mb: showSupportLink ? 2 : 0 }}
        >
          {buttonLabel}
        </Button>
      )}

      {showSupportLink && (
        <Link
          component={RouterLink}
          to={supportLinkUrl!}
          variant="body2"
        >
          {supportLinkLabel}
        </Link>
      )}
    </Box>
  );
};

export default FeedbackContent;
