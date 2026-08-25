import { OneTrustNotice } from '../../components/OneTrustNotice/OneTrustNotice';
import { oneTrustConfig } from '../../config/oneTrust';

const TOS = () => {
  return (
    <OneTrustNotice
      noticeId={oneTrustConfig.tosId}
      noticeUrl={oneTrustConfig.tosJsonUrl}
    />
  );
};

export default TOS;
