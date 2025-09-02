import { useRef } from 'react';

let tosAcceptedCache = false;

export const useTOSCheckboxStore = () => {
  const ref = useRef(tosAcceptedCache);
  const setTosAccepted = (val: boolean) => {
    ref.current = val;
    tosAcceptedCache = val;
  };
  
  return { tosAccepted: ref.current, setTosAccepted };
};
