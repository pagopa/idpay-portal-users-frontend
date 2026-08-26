import { OneTrustNotice } from '../../components/OneTrustNotice/OneTrustNotice';
import { oneTrustConfig } from '../../config/oneTrust';

const PrivacyPolicy = () => {
  return (
    <OneTrustNotice
      noticeId={oneTrustConfig.privacyPolicyId}
      noticeUrl={oneTrustConfig.privacyPolicyJsonUrl}
    />
  );
};

export default PrivacyPolicy;
