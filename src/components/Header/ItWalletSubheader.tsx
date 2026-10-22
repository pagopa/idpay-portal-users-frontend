import { Box, Typography } from '@mui/material';
import itWalletIcon from '../../assets/it-wallet-icon-blue.svg';

const ItWalletSubheader = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '24px clamp(16px, 5vw, 80px)',
      bgcolor: '#f2f7fc',
      color: '#0066cc',
    }}
  >
    <Box
      component='img'
      src={itWalletIcon}
      alt=''
      sx={{
        flex: '0 0 25px',
        width: 25,
        height: 30,
        display: 'block',
      }}
    />
    <Typography
      component='span'
      variant='inherit'
      color='inherit'
      sx={{ fontSize: 'clamp(24px, 2.5vw, 28px)', fontWeight: 700, lineHeight: '32px', letterSpacing: 0 }}
    >
      IT-Wallet
    </Typography>
  </Box>
);

export default ItWalletSubheader;