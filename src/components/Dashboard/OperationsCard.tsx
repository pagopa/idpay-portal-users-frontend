import { Typography, Card, CardContent, Box } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';

interface Operation {
  label: string;
  date: string;
  cents?: number;
  id: string;
}

interface OperationsCardProps {
  timelineData: Operation[];
  onClick(id: string): void;
}

const OperationsCard: React.FC<OperationsCardProps> = ({ timelineData, onClick }) => {
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
    <Card>
      <CardContent>
        <Typography variant="overline" gutterBottom>
          {t('dashboard.operationsSection.title')}
        </Typography>

        {timelineData.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mt: 2.5,
            }}
          >
            <Box>
              <Typography variant="body2" fontWeight={600} color={theme.palette.text.primary}>
                {item.label}
              </Typography>
              <Typography variant="body2" fontWeight={600} color={theme.palette.text.secondary}>
                {item.date}
              </Typography>
            </Box>

            {item.cents !== undefined && (
              <Typography
                variant="body1"
                color={theme.palette.primary.main}
                fontWeight={600}
                alignSelf="center"
                sx={{cursor: "pointer"}}
                onClick={() => {onClick(item.id!)}}
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

export default OperationsCard;