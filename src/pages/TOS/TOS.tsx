import { Box } from '@mui/material';
import { useRef, useState, useEffect } from 'react';
import { theme } from '@pagopa/mui-italia';
import { TOSHeader } from '../../components/TOS/TOSHeader';
import { FixedSideMenu } from '../../components/Menu/FixedSideMenu';
import { TOSContent } from '../../components/TOS/TOSContent';
import { useIsMobile } from '../../hooks/useIsMobile';
import { MobileDropdownMenu } from '../../components/Menu/MobileDropdownMenu';
import { useCanAccessTOSStore } from '../../hooks/useCanAccessTOSStore';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';

const TOS = () => {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isMobile = useIsMobile();
  const { canAccessTOS } = useCanAccessTOSStore();

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

  const items = [
    `tos.sideMenu.element1.title`,
    `tos.sideMenu.element2.title`,
    `tos.sideMenu.element3.title`,
    `tos.sideMenu.element4.title`,
  ]

  useEffect(() => {
    if (!canAccessTOS) {
      navigate(ROUTES.GATEWAY, { replace: true });
    };

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
  }, [canAccessTOS]);

  if (!canAccessTOS) {
    return null;
  }

  return (
    <Box
      sx={{
        overflowX: 'clip',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.paper
      }}
    >
      {isMobile && <MobileDropdownMenu selectedIndex={selectedIndex} onItemClick={handleListItemClick} items={items} />}
      <TOSHeader />
      <Box sx={{ display: 'flex' }}>
        {!isMobile && <FixedSideMenu selectedIndex={selectedIndex} onItemClick={handleListItemClick} items={items} />}
        <TOSContent sectionRefs={sectionRefs} />
      </Box>
    </Box>
  );
};

export default TOS;