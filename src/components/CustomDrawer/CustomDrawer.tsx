import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Drawer,
  SwipeableDrawer
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useIsMobile } from '../../hooks/useIsMobile';
import { formatCurrency, formatDateTime } from '../../utils/formatUtils';
import { useTranslation } from 'react-i18next';
import { CopyToClipboardButton, theme } from '@pagopa/mui-italia';
import { OperationDTO } from '../../api/generated/onboarding-web/OperationDTO';

export type CustomDrawerProps = {
  open: boolean;
  onClose: () => void;
  onOpen?: () => void;
  operation: OperationDTO | null;
  width?: number | string;
  mobileHeight?: number | string;
  forceMode?: 'drawer' | 'swipeable';
};

export const CustomDrawer: React.FC<CustomDrawerProps> = ({
  open,
  onClose,
  onOpen,
  operation,
  width = 420,
  mobileHeight = '75%',
  forceMode,
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const iOS =
    typeof navigator !== 'undefined' &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  const handleCopyTransactionId = () => {
    if (operation?.eventId) {
      navigator.clipboard.writeText(operation.eventId);
    }
  };

  const Header = (
    <Box position="relative" mb={2} p={2}>
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          color: theme.palette.action.active,
        }}
      >
        <CloseIcon />
      </IconButton>

      <Typography
        variant="h6"
        fontWeight={700}
        fontStyle="bold"
        mt={4}
      >
        {t('common.drawerDetail.title')}
      </Typography>
    </Box>
  );

  const Content = operation ? (
    <Box sx={{ p: 2 }}>
      <Box mb={1}>
        <Typography
          variant="body2"
          color={theme.palette.action.active}
          gutterBottom
        >
          {t('common.drawerDetail.assetAmount')}
        </Typography>
        <Typography variant="h6" fontWeight="bold">
          {formatCurrency(operation.amountCents || 0)}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box mb={4}>
        <Typography
          variant="body2"
          color={theme.palette.action.active}
          gutterBottom
        >
          {t('common.drawerDetail.appliedDiscount')}
        </Typography>
        <Typography variant="h6" fontWeight="bold">
          {formatCurrency(operation.accruedCents || 0)}
        </Typography>
      </Box>

      <Typography
        variant="overline"
        color={theme.palette.text.primary}
        display="block"
        py={3}
      >
        {t('common.drawerDetail.transactionInformation')}
      </Typography>

      <Box mb={2}>
        <Typography
          variant="body2"
          color={theme.palette.action.active}
          gutterBottom
        >
          {t('common.drawerDetail.merchant')}
        </Typography>
        <Typography variant='body2' fontStyle='semibold' fontWeight={600}>
          {operation.businessName || '-'}
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />

      <Box mb={2}>
        <Typography
          variant="body2"
          color={theme.palette.action.active}
          gutterBottom
        >
          {t('common.drawerDetail.status')}

        </Typography>
        <Typography variant='body2' fontStyle='semibold' fontWeight={600}>
          {t(`common.drawerDetail.statusMap.${operation.status}`)}
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />

      <Box mb={2}>
        <Typography
          variant="body2"
          color={theme.palette.action.active}
          gutterBottom
        >
          {t('common.drawerDetail.date')}
        </Typography>
        <Typography variant='body2' fontStyle='semibold' fontWeight={600}>
          {formatDateTime(operation.operationDate) || '-'}
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />

      <Box>
        <Typography
          variant="body2"
          color={theme.palette.action.active}
          gutterBottom
        >
          {t('common.drawerDetail.idTransaction')}
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant='body2' fontStyle='semibold' fontWeight={600} color={theme.palette.primary.main}>
            {operation.eventId || '-'}
          </Typography>
          {operation.eventId && (
            <CopyToClipboardButton
              onFocusVisible={handleCopyTransactionId}
              value={operation.eventId}
            />
          )}
        </Box>
      </Box>
    </Box>
  ) : null;

  if (forceMode === 'drawer' || (!isMobile && forceMode !== 'swipeable')) {
    return (
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{
          paper: {
            sx: {
              width,
              maxWidth: '100vw',
            },
          },
        }}
      >
        {Header}
        {Content}
      </Drawer>
    );
  }

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={onOpen ?? (() => { })}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      slotProps={{
        paper: {
          sx: {
            height: mobileHeight,
            width: '100%',
            maxHeight: '100%',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          },
        },
      }}
    >
      {Header}
      {Content}
    </SwipeableDrawer>
  );
};
