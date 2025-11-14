import { Box, Typography, Button } from '@mui/material';
import { theme } from '@pagopa/mui-italia';

interface CustomHeroSectionProps {
  title: string;
  description: string;
  buttonLabel: string;
  onButtonClick: () => void;
  backgroundImage?: string;
}

const CustomHeroSection = ({
  title,
  description,
  buttonLabel,
  onButtonClick,
  backgroundImage,
}: CustomHeroSectionProps) => {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        position: 'relative',
        backgroundColor: '#0B3EE3',
        overflow: 'clip',
        color: theme.palette.common.white,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      {backgroundImage && (
        <Box
          component="img"
          src={backgroundImage}
          alt="Background"
          sx={{
            position: 'absolute',
            top: '75%',
            left: '75%',
            scale: 1.5,
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: 'auto',
            zIndex: 0,
            pointerEvents: 'none',
            userSelect: 'none',
            mixBlendMode: 'plus-lighter',
            opacity: 1,
          }}
        />
      )}

      <Box sx={{ position: 'relative', zIndex: 1, display: "flex", justifyContent: "center", alignItems: "start", flexDirection: "column", px: { md: 10, sm: 6, xs: 6 }, py: { md: 15, sm: 6, xs: 6 }, }}>
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{ mb: 2, lineHeight: 1.2, color: theme.palette.background.paper, textAlign: "left" }}
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          sx={{ mb: 3, lineHeight: 1.5, color: theme.palette.background.paper, textAlign: "left" }}
        >
          {description}
        </Typography>

        <Button
          variant="contained"
          disableRipple
          disableElevation
          onClick={onButtonClick}
          sx={{
            backgroundColor: theme.palette.common.white,
            color: theme.palette.primary.main,
            px: 3,
            py: 1.5,
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: theme.shadows[1],
            transition: "background-color 0.25s, transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              backgroundColor: "#f0f0f0 !important",
              boxShadow: theme.shadows[2],
            },
            "&:active": {
              backgroundColor: "#e0e0e0 !important",
              transform: "scale(0.98)",
              boxShadow: theme.shadows[1],
            },
            "&:focusVisible": {
              outline: "none",
              boxShadow: `0 0 0 3px rgba(25, 118, 210, 0.3)`,
            },
            "&.MuiButton-containedPrimary": {
              backgroundColor: theme.palette.common.white,
              color: theme.palette.primary.main,
            },
            "&.MuiButton-containedPrimary:hover": {
              backgroundColor: "#f0f0f0",
            },
            "&.MuiButton-containedPrimary:active": {
              backgroundColor: "#e0e0e0",
            },
          }}
        >
          {buttonLabel}
        </Button>
      </Box>
    </Box>
  );
};

export default CustomHeroSection;