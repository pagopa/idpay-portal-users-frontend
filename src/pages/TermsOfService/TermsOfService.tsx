import { useEffect, useState } from 'react';
import { PrivacyAndTosLayout } from '../../components/PrivacyAndTosLayout/PrivacyAndTosLayout';

const TOS = () => {
  const [html, setHtml] = useState('');

  useEffect(() => {
    fetch('/utente/tos.html')
      .then((res) => res.text())
      .then((text) => setHtml(text));
  }, []);

  return <PrivacyAndTosLayout text={html} />
};

export default TOS