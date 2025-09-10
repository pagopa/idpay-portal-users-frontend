import React from 'react';
import { Box, Typography, Button, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FeedbackState } from '../../pages/FeedbackPage/feedbackStates';
import { useAuth } from '../../contexts/AuthContext';
import ROUTES from '../../routes';

const FeedbackContent: React.FC<FeedbackState> = ({
  icon,
  title,
  description,
  buttonLabel,
  buttonRedirect,
  supportLinkLabel,
  supportLinkUrl,
}) => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const showButton = buttonLabel && buttonRedirect;
  const showSupportLink = supportLinkLabel && supportLinkUrl;

  const handleClick = () => {
    if (buttonRedirect === '__LOGOUT__') {
      if(isAuthenticated){
        logout();
      }else{
        navigate(ROUTES.HOME)
      }
    }
  };

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
          component={buttonRedirect !== "__LOGOUT__" ? RouterLink : 'button'}
          to={buttonRedirect !== "__LOGOUT__" ? buttonRedirect : undefined}
          onClick={buttonRedirect === "__LOGOUT__" ? handleClick : undefined}
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
