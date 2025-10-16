import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import Sidebar from '../../components/Menu/Sidebar';
import Overlay from '../../components/Overlay/Overlay';
import YourBonus from '../../components/Dashboard/YourBonus';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';
import { useAuth } from '../../contexts/AuthContext';
import { OnboardingWebApi } from '../../api/onboardingWebApiClient';
import { VoucherStatusEnum } from '../../api/generated/onboarding-web/InitiativeDTO';
import { TimelineDTO } from '../../api/generated/onboarding-web/TimelineDTO';
import { OperationDTO } from '../../api/generated/onboarding-web/OperationDTO';
import { formatDateTime } from '../../utils/formatUtils';
import { getInitiativeId } from '../../utils/env';
import { useIsMobile } from '../../hooks/useIsMobile';
import DashboardDropdownMenu from '../../components/Dashboard/DashboardDropdownMenu';

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
  const [bonusData, setBonusData] = useState<BonusDetail | null>(null);
  const [timelineData, setTimelineData] = useState<TimelineItem[] | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<OperationDTO[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<OperationDTO | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [trxCode, setTrxCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile()

  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<'bonus' | 'faq'>('bonus');

  const handleSectionChange = (section: 'bonus' | 'faq') => {
    setActiveSection(section);
  };
  const toggleSidebar = () => setCollapsed(prev => !prev);

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

          const onboarding = sortedOperations.find(e => e?.operationType === 'ONBOARDING');
          const onboardingItem: TimelineItem = {
            label: 'dashboard.operationsSection.onboardingInitiative',
            date: formatDateTime(onboarding?.operationDate!),
            id: onboarding?.operationId!
          };

          const operationItems: TimelineItem[] = [];
          const transactionDetailsArray: OperationDTO[] = [];

          for (const operation of sortedOperations) {
            if (operation?.operationType === 'TRANSACTION') {
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
  }, [navigate]);

  if (isLoading) return <Overlay />;

  if (!bonusData || !timelineData) {
    navigate(ROUTES.ERROR_PAGE, { state: { status: 'UNKNOWN_ERROR' } });
    return null;
  }

  const fiscalNumber = user?.attributes?.fiscalNumber?.[0] || '-';
  const showBarcode =
    bonusData.voucherStatus === VoucherStatusEnum.ACTIVE ||
    bonusData.voucherStatus === VoucherStatusEnum.EXPIRING;

  return (
    <>
    { isMobile &&
      <DashboardDropdownMenu
          selectedSection={activeSection}
          onSectionChange={handleSectionChange}
        />
    }
      <Box display="flex" height="100%">
        { !isMobile &&
          <Box
            width={collapsed ? 64 : 300}
            bgcolor={theme.palette.background.paper}
            sx={{
              transition: 'width 0.3s ease',
            }}
          >
            <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} onSectionChange={handleSectionChange} />
          </Box>
        }

        <Box flexGrow={1} p={3} overflow="auto">
        {activeSection === 'bonus' ? (
          <YourBonus
            bonusData={bonusData}
            timelineData={timelineData}
            trxCode={trxCode}
            fiscalNumber={fiscalNumber}
            showBarcode={showBarcode}
            drawerOpen={drawerOpen}
            selectedTransaction={selectedTransaction}
            onOpenDrawer={handleOpenDrawer}
            onCloseDrawer={handleDrawerClose}
          />
        ) : (
          <Box>
            <h2>Domande frequenti</h2>
          </Box>
        )}
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
export type { BonusDetail, TimelineItem };