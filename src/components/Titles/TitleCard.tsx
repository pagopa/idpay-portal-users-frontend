import { Typography } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';

interface TitlesProps {
  title: string;
}
export default function TitleCard(props: TitlesProps) {
    const {title} = props;
    const { t } = useTranslation();
    return (
        <Typography variant="h5" fontWeight={theme.typography.fontWeightBold}>
            {t(title)}
        </Typography>
    )
}
