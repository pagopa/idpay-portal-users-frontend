import { Box } from '@mui/material';
import { useRef, useState, useEffect } from 'react';
import { theme } from '@pagopa/mui-italia';
import { TOSHeader } from '../../components/TOS/TOSHeader';
import { FixedSideMenu } from '../../components/Menu/FixedSideMenu';
import { TOSContent } from '../../components/TOS/TOSContent';
import { useIsMobile } from '../../hooks/useIsMobile';
import { MobileDropdownMenu } from '../../components/Menu/MobileDropdownMenu';
import { OnboardingWebApi } from '../../api/onboardingWebApiClient';
import { CodeEnum, OnboardingErrorDTO } from '../../api/generated/onboarding-web/OnboardingErrorDTO';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';
import { StatusEnum } from '../../api/generated/onboarding-web/OnboardingStatusDTO';

const TOS = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

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

  const isErrorDTO = (data: OnboardingErrorDTO | unknown): data is OnboardingErrorDTO =>
    typeof data === 'object' && data !== null && 'code' in data;

  const isUserNotOnboardedError = (data: OnboardingErrorDTO | unknown): boolean =>
    isErrorDTO(data) && data.code === CodeEnum.ONBOARDING_USER_NOT_ONBOARDED;

  const isValidStatus = (status: any): status is StatusEnum =>
    Object.values(StatusEnum).includes(status);

  const isStatusData = (data: any): data is { status: StatusEnum } =>
    typeof data === 'object' &&
    data !== null &&
    'status' in data &&
    isValidStatus(data.status);

  useEffect(() => {
    const initiativeId = '688ba02b2542210740f7ca48'; //TODO retrieve and store initiativeId

    const fetchData = async () => {
      try {
        const statusResponse = await OnboardingWebApi.getStatus(initiativeId);
        const { status, data: statusData } = statusResponse;

        if (status === 200 && isStatusData(statusData)) {
          const statusString = (statusData as any).status;
          navigate(ROUTES.FEEDBACK, { state: { status: statusString } });
          return;
        }

        if (status === 404 && isUserNotOnboardedError(statusData)) {
          return;
        }
      } catch (error) {
        console.log('Error: ', error);
        //TODO handle generic error
      };
    };

    fetchData();
  }, []);

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
      {isMobile && <MobileDropdownMenu selectedIndex={selectedIndex} onItemClick={handleListItemClick} items={items} />}
      <TOSHeader />
      <Box sx={{ display: 'flex' }}>
        {!isMobile && <FixedSideMenu selectedIndex={selectedIndex} onItemClick={handleListItemClick} items={items}/>}
        <TOSContent sectionRefs={sectionRefs} />
      </Box>
    </Box>
  );
};

export default TOS;
