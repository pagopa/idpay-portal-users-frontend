import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import type { ChipProps } from '@mui/material/Chip';
import { theme } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import { VoucherStatusEnum } from '../../api/generated/onboarding-web/InitiativeDTO';
import { formatCurrency, formatDate } from '../../utils/formatUtils';

interface BonusDetail {
  voucherStatus: VoucherStatusEnum;
  voucherStartDate: string;
  voucherEndDate: string;
  amountCents: number;
}

interface DetailBonusCardProps {
  bonusData: BonusDetail;
  fiscalNumber: string;
}

const getVoucherStatusLabel = (status: VoucherStatusEnum, t: any): string => {
  const labels: Record<VoucherStatusEnum, string> = {
    [VoucherStatusEnum.ACTIVE]: t('dashboard.voucherStatus.ACTIVE'),
    [VoucherStatusEnum.EXPIRING]: t('dashboard.voucherStatus.EXPIRING'),
    [VoucherStatusEnum.EXPIRED]: t('dashboard.voucherStatus.EXPIRED'),
    [VoucherStatusEnum.USED]: t('dashboard.voucherStatus.USED'),
  };
  return labels[status] || String(status);
};

const getStatusColor = (status: VoucherStatusEnum): ChipProps['color'] => {
  switch (status) {
    case VoucherStatusEnum.ACTIVE:
      return 'success';
    case VoucherStatusEnum.EXPIRING:
      return 'warning';
    case VoucherStatusEnum.USED:
      return 'default';
    case VoucherStatusEnum.EXPIRED:
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
          {t('dashboard.detailBonusSection.bonusDetail')}
        </Typography>

        <DetailRow label={t('dashboard.detailBonusSection.amount')}>
          <Typography variant='h6' fontStyle='bold' fontWeight={700}>
            {formatCurrency(bonusData.amountCents)}
          </Typography>
        </DetailRow>

        <DetailRow label={t('dashboard.detailBonusSection.status')}>
          <Chip
            label={getVoucherStatusLabel(bonusData.voucherStatus, t)}
            color={getStatusColor(bonusData.voucherStatus)}
          />
        </DetailRow>

        <DetailRow label={t('dashboard.detailBonusSection.voucherStartDate')}>
          <Typography variant='body2' fontStyle='semibold' fontWeight={600}>
            {formatDate(bonusData.voucherStartDate)}
          </Typography>
        </DetailRow>

        <DetailRow label={t('dashboard.detailBonusSection.voucherEndDate')}>
          <Typography variant='body2' fontStyle='semibold' fontWeight={600}>
            {formatDate(bonusData.voucherEndDate)}
          </Typography>
        </DetailRow>

        <DetailRow label={t('dashboard.detailBonusSection.fiscalNumber')}>
          <Typography variant='body2' fontStyle='semibold' fontWeight={600}>
            {fiscalNumber}
          </Typography>
        </DetailRow>
      </CardContent>
    </Card>
  );
};

export default DetailBonusCard;