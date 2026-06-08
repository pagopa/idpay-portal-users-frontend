import { Box, Typography } from '@mui/material';
import QRCode from 'react-qr-code';
import type { ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import walletIconBlue from '../../assets/wallet-icon-blue.svg';

type Props = {
  deepLink: string;
  actionSlot?: ReactNode;
};

const ItWalletQrContent = ({ deepLink, actionSlot }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant='h5' fontWeight={700} mb={1}>
        {t('dashboard.barcodeSection.walletModalTitle')}
      </Typography>
      <Typography variant='body2' color='text.secondary' mb={3}>
        <Trans
          i18nKey='dashboard.barcodeSection.walletModalDescription'
          components={{ bold: <Box component='span' fontWeight={700} /> }}
        />
      </Typography>

      {actionSlot && <Box mb={3}>{actionSlot}</Box>}

      <Box sx={{ width: 220, height: 220, mx: 'auto', bgcolor: 'white', p: 1, position: 'relative' }}>
        <QRCode
          value={deepLink}
          size={204}
          bgColor='#FFFFFF'
          fgColor='#000000'
          level='Q'
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 34,
            height: 34,
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
            width: 18,
            height: 15,
          }}
        />
      </Box>
    </>
  );
};

export default ItWalletQrContent;