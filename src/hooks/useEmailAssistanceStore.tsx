import { useRef } from 'react';

let emailCache = '';

export const useEmailAssistanceStore = () => {
  const emailRef = useRef(emailCache);

  const setEmail = (val: string) => {
    emailRef.current = val;
    emailCache = val;
  };

  return {
    email: emailRef.current,
    setEmail,
  };
};