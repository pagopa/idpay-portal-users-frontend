import { useRef } from 'react';
import { normalizeEmail } from '../utils/validateEmail';

let emailCache = '';
let confirmEmailCache = '';

export const useEmailStore = () => {
  const emailRef = useRef(emailCache);
  const confirmEmailRef = useRef(confirmEmailCache);

  const setEmail = (val: string) => {
    const normalizedEmail = normalizeEmail(val);
    emailRef.current = normalizedEmail;
    emailCache = normalizedEmail;
  };

  const setConfirmEmail = (val: string) => {
    const normalizedEmail = normalizeEmail(val);
    confirmEmailRef.current = normalizedEmail;
    confirmEmailCache = normalizedEmail;
  };

  return {
    email: emailRef.current,
    confirmEmail: confirmEmailRef.current,
    setEmail,
    setConfirmEmail
  };
};