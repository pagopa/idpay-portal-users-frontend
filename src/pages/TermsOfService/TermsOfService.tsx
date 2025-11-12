import { PrivacyAndTosLayout } from '../../components/PrivacyAndTosLayout/PrivacyAndTosLayout';
import tos from './tos.json'

const TOS = () => {
  return <PrivacyAndTosLayout text={tos.html} />
};

export default TOS