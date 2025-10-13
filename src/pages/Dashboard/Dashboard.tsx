import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { OnboardingWebApi } from '../../api/onboardingWebApiClient';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';
import Overlay from '../../components/Overlay/Overlay';
import { VoucherStatusEnum } from '../../api/generated/onboarding-web/InitiativeDTO';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import DetailBonusCard from '../../components/Dashboard/DetailBonusCard';
import BarcodeCard from '../../components/Dashboard/BarcodeCard';
import OperationsCard from '../../components/Dashboard/OperationsCard';
import { TimelineDTO } from '../../api/generated/onboarding-web/TimelineDTO';
import { OperationDTO } from '../../api/generated/onboarding-web/OperationDTO';
import { CustomDrawer } from '../../components/CustomDrawer/CustomDrawer';
import { formatDateTime } from '../../utils/formatUtils';
import { getInitiativeId } from '../../utils/env';

interface BonusDetail {
  voucherStatus: VoucherStatusEnum;
  voucherStartDate: string;
  voucherEndDate: string;
  amountCents: number;
}

interface TimelineItem {
  label: string;
  date: string;
  cents?: number;
  id: string;
}

const Dashboard = () => {
  const { t } = useTranslation();
  const [bonusData, setBonusData] = useState<BonusDetail | null>(null);
  const [timelineData, setTimelineData] = useState<TimelineItem[] | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<OperationDTO[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<OperationDTO | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [trxCode, setTrxCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleOpenDrawer = (operationId: string) => {
    const transaction = transactionDetails.find(t => t.operationId === operationId);
    if (transaction) {
      setSelectedTransaction(transaction);
      setDrawerOpen(true);
    }
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedTransaction(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      const initiativeId = getInitiativeId();
      try {
        const detailResponse = await OnboardingWebApi.getBonusDetail(initiativeId);
        const detailData = detailResponse.data as unknown as BonusDetail;
        setBonusData(detailData);

        if (
          detailData?.voucherStatus === VoucherStatusEnum.ACTIVE ||
          detailData?.voucherStatus === VoucherStatusEnum.EXPIRING
        ) {
          const barcodeResponse = await OnboardingWebApi.getBarCode(initiativeId);
          setTrxCode(barcodeResponse.data?.trxCode || '');
        }

        const timelineResponse = await OnboardingWebApi.timeline(initiativeId);
        if (timelineResponse?.status && timelineResponse.status === 200) {
          const timelineList = (timelineResponse.data as TimelineDTO).operationList as OperationDTO[];
          const sortedOperations = [...timelineList].sort(
            (a, b) => new Date(b.operationDate).getTime() - new Date(a.operationDate).getTime()
          );

          const onboarding = sortedOperations?.find(e => e?.operationType === "ONBOARDING");
          const onboardingItem: TimelineItem = {
            label: t('dashboard.operationsSection.onboardingInitiative'),
            date: formatDateTime(onboarding?.operationDate!),
            id: onboarding?.operationId!
          };

          let operationItems: TimelineItem[] = [];
          let transactionDetailsArray: OperationDTO[] = [];

          for (const operation of sortedOperations) {
            if (operation?.operationType === "TRANSACTION") {
              operationItems.push({
                label: operation.businessName ?? '-',
                date: formatDateTime(operation.operationDate!),
                cents: operation.accruedCents,
                id: operation.operationId
              });

              transactionDetailsArray.push(operation);
            }
          }

          setTimelineData([...operationItems, onboardingItem]);
          setTransactionDetails(transactionDetailsArray);
        }
        setIsLoading(false);
      } catch {
        navigate(ROUTES.ERROR_PAGE, { state: { status: 'UNKNOWN_ERROR' } });
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <Overlay />;

  if (!bonusData) {
    navigate(ROUTES.ERROR_PAGE, { state: { status: 'UNKNOWN_ERROR' } });
    return null;
  }

  const fiscalNumber = user?.attributes?.fiscalNumber?.[0] || '-';
  const showBarcode =
    (bonusData.voucherStatus === VoucherStatusEnum.ACTIVE ||
      bonusData.voucherStatus === VoucherStatusEnum.EXPIRING);

  return (
    <>
      <Box>
        <Typography variant='h4' gutterBottom>
          {t('dashboard.title')}
        </Typography>
        <Typography variant='body1' gutterBottom mt={2}>
          {t('dashboard.description')}
        </Typography>
      </Box>

      <Box mt={3}>
        {showBarcode ? (
          <>
            <Box
              display='flex'
              flexDirection={{ xs: 'column', md: 'row' }}
              gap={3}
              mt={2}
              alignItems='stretch'
            >
              <Box flex='1 1 50%' minWidth={0}>
                <DetailBonusCard bonusData={bonusData} fiscalNumber={fiscalNumber} />
              </Box>
              <Box flex='1 1 50%' minWidth={0}>
                <BarcodeCard trxCode={trxCode} />
              </Box>
            </Box>

            <Box
              display='flex'
              flexDirection={{ xs: 'column', md: 'row' }}
              gap={3}
              mt={3}
              alignItems='stretch'
            >
              <Box flex='1 1 50%' minWidth={0}>
                <OperationsCard timelineData={timelineData!} onClick={handleOpenDrawer}/>
              </Box>
              <Box flex='1 1 50%' minWidth={0} />
            </Box>
          </>
        ) : (
          <Box
            display='flex'
            flexDirection={{ xs: 'column', md: 'row' }}
            gap={3}
            mt={2}
            alignItems='stretch'
          >
            <Box flex={1}>
              <DetailBonusCard bonusData={bonusData} fiscalNumber={fiscalNumber} />
            </Box>
            <Box flex={1}>
              <OperationsCard timelineData={timelineData!} onClick={handleOpenDrawer}/>
            </Box>
          </Box>
        )}
      </Box>

      <CustomDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        operation={selectedTransaction}
      />
    </>
  );
};

export default Dashboard;