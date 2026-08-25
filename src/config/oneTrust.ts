export const oneTrustConfig = {
  noticeScriptUrl: import.meta.env.VITE_ONE_TRUST_OTNOTICE_CDN_URL,
  noticeScriptSettings: import.meta.env.VITE_ONE_TRUST_OTNOTICE_CDN_SETTINGS,
  privacyPolicyId: import.meta.env.VITE_ONE_TRUST_PRIVACY_POLICY_ID,
  privacyPolicyJsonUrl: import.meta.env.VITE_ONE_TRUST_PRIVACY_POLICY_JSON_URL,
  tosId: import.meta.env.VITE_ONE_TRUST_TOS_ID,
  tosJsonUrl: import.meta.env.VITE_ONE_TRUST_TOS_JSON_URL,
} as const;
