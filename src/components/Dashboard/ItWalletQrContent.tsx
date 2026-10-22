import { Box, Typography } from '@mui/material';
import QRCode from 'react-qr-code';
import type { ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import walletIconBlue from '../../assets/wallet-icon-blue.svg';

type Props = {
  deepLink: string;
  actionSlot?: ReactNode;
  variant?: 'modal' | 'page';
};

const ItWalletQrContent = ({ deepLink, actionSlot, variant = 'modal' }: Props) => {
  const { t } = useTranslation();
  const isPage = variant === 'page';

  return (
    <>
      <Typography
        component={isPage ? 'h1' : 'h5'}
        variant={isPage ? 'inherit' : 'h5'}
        fontWeight={700}
        mb={isPage ? '10px' : 1}
        sx={isPage ? { fontSize: 32, lineHeight: 1.2, letterSpacing: 0, color: '#17324d' } : undefined}
      >
        {t(isPage
          ? 'dashboard.barcodeSection.walletAccessTitle'
          : 'dashboard.barcodeSection.walletModalTitle')}
      </Typography>
      <Typography
        variant={isPage ? 'body1' : 'body2'}
        color={isPage ? 'text.primary' : 'text.secondary'}
        mb={isPage ? '32px' : 3}
        sx={isPage ? {
          fontSize: 24,
          fontWeight: 400,
          lineHeight: '32px',
          letterSpacing: 0,
          color: '#17324d',
          whiteSpace: 'pre-line',
        } : { whiteSpace: 'pre-line' }}
      >
        <Trans
          i18nKey={isPage
            ? 'dashboard.barcodeSection.walletAccessDescription'
            : 'dashboard.barcodeSection.walletModalDescription'}
          components={{ bold: <Box component='span' fontWeight={700} /> }}
        />
      </Typography>

      {actionSlot && <Box mb={3}>{actionSlot}</Box>}

      <Box sx={{
        width: isPage ? 256 : 220,
        height: isPage ? 256 : 220,
        mx: 'auto',
        bgcolor: 'white',
        p: isPage ? 0 : 1,
        position: 'relative',
        ...(isPage && { display: 'flex', alignItems: 'center', justifyContent: 'center' }),
      }}>
        <QRCode
          value={deepLink}
          size={isPage ? 234 : 204}
          bgColor='#FFFFFF'
          fgColor='#000000'
          level={isPage ? 'L' : 'Q'}
          shapeRendering={isPage ? 'crispEdges' : undefined}
          style={isPage ? { display: 'block', flexShrink: 0 } : undefined}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isPage ? 45 : 34,
            height: isPage ? 45 : 34,
            borderRadius: '50%',
            bgcolor: '#fff',
          }}
        />
        <Box
          component='img'
          src={walletIconBlue}
          alt=''
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isPage ? 24 : 18,
            height: isPage ? 24 : 15,
          }}
        />
      </Box>
    </>
  );
};

export default ItWalletQrContent;