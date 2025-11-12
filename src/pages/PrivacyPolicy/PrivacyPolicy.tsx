import { useEffect, useState } from 'react';
import { PrivacyAndTosLayout } from '../../components/PrivacyAndTosLayout/PrivacyAndTosLayout';

const PrivacyPolicy = () => {
   const [html, setHtml] = useState('');
    
    useEffect(() => {
      fetch('/utente/privacyPolicy.html')
        .then((res) => res.text())
        .then((text) => setHtml(text));
    }, []);

  return <PrivacyAndTosLayout text={html} />
};

export default PrivacyPolicy