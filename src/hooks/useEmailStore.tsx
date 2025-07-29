import { useRef } from 'react';

let emailCache = '';
let confirmEmailCache = '';

export const useEmailStore = () => {
  const emailRef = useRef(emailCache);
  const confirmEmailRef = useRef(confirmEmailCache);

  const setEmail = (val: string) => {
    emailRef.current = val;
    emailCache = val;
  };

  const setConfirmEmail = (val: string) => {
    confirmEmailRef.current = val;
    confirmEmailCache = val;
  };

  return {
    email: emailRef.current,
    confirmEmail: confirmEmailRef.current,
    setEmail,
    setConfirmEmail
  };
};