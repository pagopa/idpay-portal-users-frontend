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
  const [timeline, setTimeline] = useState<OperationDTO[] | null>(null)
  const [timelineData, setTimelineData] = useState<TimelineItem[] | null>(null)
  const [timelineDetailData] = useState<OperationDTO | null>(null)
  const [trxCode, setTrxCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  function formatDate(dateString: string): string {
    const date = new Date(dateString);

    const formatter = new Intl.DateTimeFormat("it-IT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return formatter.format(date).replace(/\./g, "");
  }

  useEffect(() => {
    const fetchData = async () => {
      const initiativeId = '68dd003ccce8c534d1da22bc';
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
        if(timelineResponse?.status && timelineResponse.status === 200) {
          const timelineList = (timelineResponse.data as TimelineDTO).operationList as OperationDTO[];
          const sortedOperations = [...timelineList].sort(
            (a, b) => new Date(b.operationDate).getTime() - new Date(a.operationDate).getTime()
          );
          setTimeline(sortedOperations);
          const onboarding = sortedOperations?.find(e => e?.operationType === "ONBOARDING")
          const onboardingItem: TimelineItem = {label: "Adesione iniziativa", date: formatDate(onboarding?.operationDate!), id: onboarding?.operationId!}
          var operationItems: TimelineItem[] = []

          for (const operation of sortedOperations) {
            if (operation?.operationType === "TRANSACTION") {
              operationItems.push({
                label: operation.businessName ?? "N/A",
                date: formatDate(operation.operationDate!),
                cents: operation.accruedCents,
                id: operation.operationId
              });
            }
          }
          setTimelineData([...operationItems, onboardingItem]);
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
      bonusData.voucherStatus === VoucherStatusEnum.EXPIRING) && Boolean(trxCode);
      console.log(timelineData, timelineDetailData, timeline)
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
              <Box flex={1}>
                <DetailBonusCard bonusData={bonusData} fiscalNumber={fiscalNumber} />
              </Box>
              <Box flex={1}>
                <BarcodeCard trxCode={trxCode} />
              </Box>
            </Box>

            <Box
              display='flex'
              flexDirection={{ xs: 'column', md: 'row' }}
              gap={3}
              mt={3}
            >
              <Box flex={1}>
                <OperationsCard />
              </Box>
              <Box flex={1} />
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
              <OperationsCard />
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Dashboard;