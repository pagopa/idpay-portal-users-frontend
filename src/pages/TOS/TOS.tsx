import { Box, Button } from '@mui/material';
import { useRef, useState, useEffect } from 'react';
import { theme } from '@pagopa/mui-italia';
import { TOSHeader } from '../../components/TOS/TOSHeader';
import { TOSSideMenu } from '../../components/TOS/TOSSideMenu';
import { TOSContent } from '../../components/TOS/TOSContent';
import { useTranslation } from 'react-i18next';

const TOS = () => {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const sectionRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null)
  ];

  const handleListItemClick = (index: number) => {
    setSelectedIndex(index);
    sectionRefs[index].current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      const offsets = sectionRefs.map(ref => {
        if (!ref.current) return Infinity;
        return Math.abs(ref.current.getBoundingClientRect().top);
      });

      const minIndex = offsets.indexOf(Math.min(...offsets));
      setSelectedIndex(minIndex);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box
      sx={{
        overflowX: 'clip',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.paper
      }}
    >
      <TOSHeader />
      <Box sx={{ display: 'flex' }}>
        <TOSSideMenu selectedIndex={selectedIndex} onItemClick={handleListItemClick} />
        <TOSContent sectionRefs={sectionRefs} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
        <Button variant="contained">{t('tos.continue')}</Button>
      </Box>
    </Box>
  );
};

export default TOS;
