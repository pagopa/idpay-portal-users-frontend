import { useRef } from 'react';

let canAccessTOSCache = false;

export const useCanAccessTOSStore = () => {
  const ref = useRef(canAccessTOSCache);
  
  const setCanAccessTOS = (val: boolean) => {
    ref.current = val;
    canAccessTOSCache = val;
  };
  
  return { canAccessTOS: ref.current, setCanAccessTOS };
};