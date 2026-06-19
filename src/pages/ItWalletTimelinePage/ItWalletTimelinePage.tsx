import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Box, Card, CardContent, Typography } from '@mui/material';
import { theme } from '@pagopa/mui-italia';

import { getInitiativeId } from '../../utils/env';
import { ItWalletPaymentApi } from '../../api/itWalletPaymentApiClient';
import { formatDateTime } from '../../utils/formatUtils';

import ROUTES from '../../routes';

interface TimelineItem {
  label: string;
  date: string;
  cents?: number;
  id?: string;
}

interface OperationsCardProps {
  timelineData: TimelineItem[];
}

const OperationsCard: React.FC<OperationsCardProps> = ({ timelineData }) => {
  const { t } = useTranslation();

  const formatCurrency = (value: number) => {
    const invertedValue = -value / 100;
    const sign = invertedValue >= 0 ? '+' : '-';

    const formatted = Math.abs(invertedValue).toLocaleString('it-IT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return `${sign}${formatted} €`;
  };

  return (
    <Card
      sx={{
        width: '100%',
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Typography variant="overline" gutterBottom>
          {t('dashboard.operationsSection.title')}
        </Typography>

        {timelineData.map((item, index) => (
          <Box
            key={item.id ?? index}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mt: 2.5,
            }}
          >
            <Box>
              <Typography
                variant="body2"
                fontWeight={600}
                color={theme.palette.text.primary}
              >
                {item.label}
              </Typography>

              <Typography
                variant="body2"
                fontWeight={600}
                color={theme.palette.text.secondary}
              >
                {item.date}
              </Typography>
            </Box>

            {item.cents !== undefined && (
              <Typography
                variant="body1"
                color={theme.palette.primary.main}
                fontWeight={600}
                alignSelf="center"
              >
                {formatCurrency(item.cents)}
              </Typography>
            )}
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

const ItWalletTimelinePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { fiscalCode } = useParams<{ fiscalCode: string }>();

  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);

  const normalizedTimeline = timelineData.map(item =>
    item.label === 'dashboard.operationsSection.onboardingInitiative'
      ? { ...item, label: t('dashboard.operationsSection.onboardingInitiative') }
      : item
  );

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const timelineResponse = await ItWalletPaymentApi.timeline(
          getInitiativeId(),
          fiscalCode ?? ''
        );

        const operationList = timelineResponse.operationList ?? [];

        const items: TimelineItem[] = operationList.map(operation => ({
          label: operation.businessName ?? operation.operationType ?? '-',
          date: formatDateTime(operation.operationDate),
          cents: operation.accruedCents,
          id: operation.operationId,
        }));

        setTimelineData(items);
      } catch {
        navigate(ROUTES.ERROR_PAGE, {
          state: { status: 'UNKNOWN_ERROR' },
        });
      }
    };

    void fetchTimeline();
  }, [fiscalCode, navigate]);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        bgcolor: theme.palette.background.default,
        p: 3,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 900,
          mx: 'auto',
        }}
      >
        <OperationsCard timelineData={normalizedTimeline} />
      </Box>
    </Box>
  );
};

export default ItWalletTimelinePage;