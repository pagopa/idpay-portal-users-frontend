import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import DetailBonusCard from './DetailBonusCard';
import BarcodeCard from './BarcodeCard';
import OperationsCard from './OperationsCard';
import { CustomDrawer } from '../CustomDrawer/CustomDrawer';
import { OperationDTO } from '../../api/generated/onboarding-web/OperationDTO';
import { BonusDetail, TimelineItem } from '../../pages/Dashboard/Dashboard';

type Props = {
  bonusData: BonusDetail;
  timelineData: TimelineItem[];
  trxCode: string;
  fiscalNumber: string;
  showBarcode: boolean;
  drawerOpen: boolean;
  selectedTransaction: OperationDTO | null;
  onOpenDrawer: (operationId: string) => void;
  onCloseDrawer: () => void;
};

const YourBonus = ({
  bonusData,
  timelineData,
  trxCode,
  fiscalNumber,
  showBarcode,
  drawerOpen,
  selectedTransaction,
  onOpenDrawer,
  onCloseDrawer
}: Props) => {
  const { t } = useTranslation();

  const normalizedTimeline = timelineData.map(item =>
    item.label === 'common.dashboard.operationsSection.onboardingInitiative'
      ? { ...item, label: t('common.dashboard.operationsSection.onboardingInitiative') }
      : item
  );

  return (
    <>
      <Box>
        <Typography variant="h4" gutterBottom>
          {t('common.dashboard.title')}
        </Typography>
        <Typography variant="body1" gutterBottom mt={2}>
          {t('common.dashboard.description')}
        </Typography>
      </Box>

      <Box mt={3}>
        {showBarcode ? (
          <>
            <Box
              display="flex"
              flexDirection={{ xs: 'column', md: 'row' }}
              gap={3}
              mt={2}
              alignItems="stretch"
            >
              <Box flex="1 1 50%" minWidth={0}>
                <DetailBonusCard bonusData={bonusData} fiscalNumber={fiscalNumber} />
              </Box>
              <Box flex="1 1 50%" minWidth={0}>
                <BarcodeCard trxCode={trxCode} />
              </Box>
            </Box>

            <Box
              display="flex"
              flexDirection={{ xs: 'column', md: 'row' }}
              gap={3}
              mt={3}
              alignItems="stretch"
            >
              <Box flex="1 1 50%" minWidth={0}>
                <OperationsCard timelineData={normalizedTimeline} onClick={onOpenDrawer} />
              </Box>
              <Box flex="1 1 50%" minWidth={0} />
            </Box>
          </>
        ) : (
          <Box
            display="flex"
            flexDirection={{ xs: 'column', md: 'row' }}
            gap={3}
            mt={2}
            alignItems="stretch"
          >
            <Box flex={1}>
              <DetailBonusCard bonusData={bonusData} fiscalNumber={fiscalNumber} />
            </Box>
            <Box flex={1}>
              <OperationsCard timelineData={normalizedTimeline} onClick={onOpenDrawer} />
            </Box>
          </Box>
        )}
      </Box>

      <CustomDrawer open={drawerOpen} onClose={onCloseDrawer} operation={selectedTransaction} />
    </>
  );
};

export default YourBonus;
