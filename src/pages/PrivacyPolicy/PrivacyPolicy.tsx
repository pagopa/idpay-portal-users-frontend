import { PrivacyAndTosLayout } from '../../components/PrivacyAndTosLayout/PrivacyAndTosLayout';
import privacyPolicy from './privacyPolicy.json'

const PrivacyPolicy = () => {
  return <PrivacyAndTosLayout text={privacyPolicy.html} />
};

export default PrivacyPolicy