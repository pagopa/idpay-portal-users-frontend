import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import type { ChipProps } from '@mui/material/Chip';
import { theme } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatDate } from '../../utils/formatUtils';
import { WalletStatusDtoVoucherStatusEnum } from '../../api/generated/onboarding-web/api';

interface BonusDetail {
  voucherStatus: WalletStatusDtoVoucherStatusEnum;
  voucherStartDate: string;
  voucherEndDate: string;
  amountCents: number;
}

interface DetailBonusCardProps {
  bonusData: BonusDetail;
  fiscalNumber: string;
}

const getVoucherStatusLabel = (status: WalletStatusDtoVoucherStatusEnum, t: any): string => {
  const labels: Record<WalletStatusDtoVoucherStatusEnum, string> = {
    [WalletStatusDtoVoucherStatusEnum.ACTIVE]: t('common.dashboard.voucherStatus.ACTIVE'),
    [WalletStatusDtoVoucherStatusEnum.EXPIRING]: t('common.dashboard.voucherStatus.EXPIRING'),
    [WalletStatusDtoVoucherStatusEnum.EXPIRED]: t('common.dashboard.voucherStatus.EXPIRED'),
    [WalletStatusDtoVoucherStatusEnum.USED]: t('common.dashboard.voucherStatus.USED'),
  };
  return labels[status] || String(status);
};

const getStatusColor = (status: WalletStatusDtoVoucherStatusEnum): ChipProps['color'] => {
  switch (status) {
    case WalletStatusDtoVoucherStatusEnum.ACTIVE:
      return 'success';
    case WalletStatusDtoVoucherStatusEnum.EXPIRING:
      return 'warning';
    case WalletStatusDtoVoucherStatusEnum.USED:
      return 'default';
    case WalletStatusDtoVoucherStatusEnum.EXPIRED:
      return 'error';
    default:
      return 'default';
  }
};

const DetailRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Box py={1}>
    <Typography variant="body2" color={theme.palette.text.secondary} gutterBottom>
      {label}
    </Typography>
    {children}
  </Box>
);

const DetailBonusCard: React.FC<DetailBonusCardProps> = ({ bonusData, fiscalNumber }) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardContent>
        <Typography variant='overline' gutterBottom>
          {t('common.dashboard.detailBonusSection.bonusDetail')}
        </Typography>

        <DetailRow label={t('common.dashboard.detailBonusSection.amount')}>
          <Typography variant='h6' fontStyle='bold' fontWeight={700}>
            {formatCurrency(bonusData.amountCents)}
          </Typography>
        </DetailRow>

        <DetailRow label={t('common.dashboard.detailBonusSection.status')}>
          <Chip
            label={getVoucherStatusLabel(bonusData.voucherStatus, t)}
            color={getStatusColor(bonusData.voucherStatus)}
          />
        </DetailRow>

        <DetailRow label={t('common.dashboard.detailBonusSection.voucherStartDate')}>
          <Typography variant='body2' fontStyle='semibold' fontWeight={600}>
            {formatDate(bonusData.voucherEndDate)}
          </Typography>
        </DetailRow>

        <DetailRow label={t('common.dashboard.detailBonusSection.voucherEndDate')}>
          <Typography variant='body2' fontStyle='semibold' fontWeight={600}>
            {formatDate(bonusData.voucherStartDate)}
          </Typography>
        </DetailRow>

        <DetailRow label={t('common.dashboard.detailBonusSection.fiscalNumber')}>
          <Typography variant='body2' fontStyle='semibold' fontWeight={600}>
            {fiscalNumber}
          </Typography>
        </DetailRow>
      </CardContent>
    </Card>
  );
};

export default DetailBonusCard;
