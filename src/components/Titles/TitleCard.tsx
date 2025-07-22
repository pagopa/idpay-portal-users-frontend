import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface TitlesProps {
  title: string;
}
export default function TitleCard(props: TitlesProps) {
    const {title} = props;
    const { t } = useTranslation();
    return (
        <Typography
            sx={{ fontWeight: 700, fontSize: '24px' }}
            component="h2"
        >
            {t(title)}
        </Typography>
    )
}
