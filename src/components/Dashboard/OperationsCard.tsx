import { Typography, Card, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';

const OperationsCard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent>
        <Typography variant="overline" gutterBottom>
          {t('dashboard.operationsSection.title')}
        </Typography>
        {/* TODO */}
      </CardContent>
    </Card>
  );
};

export default OperationsCard;