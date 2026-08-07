import { initializeCookieOneTrust } from './oneTrustLoader';

initializeCookieOneTrust().catch((error: unknown) => {
  console.log('Failed to initialize Cookie OneTrust: ', error);
});
