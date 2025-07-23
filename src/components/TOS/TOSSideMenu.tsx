import { Box, List, ListItemButton, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '@pagopa/mui-italia';

interface Props {
  selectedIndex: number;
  onItemClick: (index: number) => void;
}

export const TOSSideMenu = ({ selectedIndex, onItemClick }: Props) => {
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
          {[0, 1, 2, 3].map((i) => (
            <ListItemButton
              key={i}
              selected={selectedIndex === i}
              onClick={() => onItemClick(i)}
              sx={{ justifyContent: 'flex-start', px: 3 }}
            >
              <ListItemText primary={t(`tos.sideMenu.element${i + 1}.title`)} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Box>
  );
};
