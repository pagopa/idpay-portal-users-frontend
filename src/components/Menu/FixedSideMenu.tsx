import { Box, List, ListItemButton, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '@pagopa/mui-italia';

interface Props {
  selectedIndex: number;
  onItemClick: (index: number) => void;
  items: string[];
}

export const FixedSideMenu = ({ selectedIndex, onItemClick, items }: Props) => {
  const { t } = useTranslation();

  return (
    <Box
      width={{ md: '20%', sm: '30%', xs: '40%' }}
      bgcolor={theme.palette.background.paper}
    >
      <Box
        width="100%"
        height="100%"
        bgcolor={theme.palette.background.paper}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <List component="nav">
          {items.map((element, i) => (
            <ListItemButton
              key={i}
              selected={selectedIndex === i}
              onClick={() => onItemClick(i)}
              sx={{ justifyContent: 'flex-start', px: 3 }}
            >
              <ListItemText primary={t(element)} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Box>
  );
};
