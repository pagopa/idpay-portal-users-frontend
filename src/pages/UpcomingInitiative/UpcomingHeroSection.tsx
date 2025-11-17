import { Box, Typography, Button } from '@mui/material';
import HeroBackground from '../../assets/upcomingInitiative.png';

interface UpcomingHeroSectionProps {
    title: string;
    subtitle: string;
    buttonLabel: string;
    onButtonClick: () => void;
    backgroundImage?: string;
}

const UpcomingHeroSection = ({
                                 title,
                                 subtitle,
                                 buttonLabel,
                                 onButtonClick,
                             }: UpcomingHeroSectionProps) => {
    return (
        <Box
            sx={{
                width: { md: '78%', sm: '95%', xs: '95%' },
                mb: 4,
                position: 'relative',
                backgroundColor: '#f0faff',
                border: '1px solid #E3E7EB',
                overflow: 'hidden',
                color: 'black',
                display: 'flex',
                flexDirection: { md: 'row', sm: 'column', xs: 'column' },
                justifyContent: 'space-between',
                alignItems: 'stretch',
                borderRadius: '24px',
            }}
        >
            <Box
                sx={{
                    width: { md: '60%', sm: '100%', xs: '100%' },
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    flexDirection: 'column',
                    px: { md: 4, sm: 3, xs: 2 },
                    py: { md: 10, sm: 4, xs: 4 },
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ mb: 2, lineHeight: 1.2, textAlign: 'left' }}
                >
                    {title}
                </Typography>

                <Typography
                    variant="body1"
                    sx={{ mb: 3, lineHeight: 1.5, textAlign: 'left', width: '100%' }}
                >
                    {subtitle}
                </Typography>

                <Button
                    variant="contained"
                    onClick={onButtonClick}
                    sx={{
                        px: 3,
                        py: 1.5,
                        my: 3,
                        fontWeight: 600,
                        borderRadius: 2,
                        backgroundColor: '#0B3EE3',
                        '&:hover': { backgroundColor: '#0A36C0' },
                    }}
                >
                    {buttonLabel}
                </Button>
            </Box>

            <Box
                sx={{
                    width: { md: '40%', sm: '100%', xs: '100%' },
                    alignSelf: 'stretch',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    px: { md: 4, sm: 2, xs: 2 },
                    pt: {md: 2, sm: 2, xs: 0}
                }}
            >
                <Box
                    component="img"
                    src={HeroBackground}
                    alt="Hero Background"
                    sx={{
                        maxWidth: '100%',
                        height: 'auto',
                        objectFit: 'contain',
                        display: 'block',
                    }}
                />
            </Box>
        </Box>
    );
};

export default UpcomingHeroSection;