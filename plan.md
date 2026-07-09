# Problem

Design a POC where the PARI React portal (`pagopa/idpay-portal-users-frontend`) lets users log in with IT Wallet by presenting a PID credential, while PARI remains a normal OIDC client of the existing Keycloak deployed on AKS. The Keycloak OID4VP extension in this repository is the candidate verifier/broker layer.

## Scope decision

- **Confirmed scope:** controlled sandbox or pilot wallet, without official IT Wallet federation onboarding in the first POC iteration.
- **Implication:** the plan should optimize for brokered wallet login success and claim mapping through Keycloak, while treating OpenID Federation onboarding and `/.well-known/openid-federation` publication as a tracked follow-up gap rather than a POC blocker.

## Current findings

- PARI already uses `keycloak-js` with env-driven Keycloak settings (`VITE_KEYCLOAK_URL`, `VITE_KEYCLOAK_REALM`, `VITE_KEYCLOAK_CLIENT_ID`) and a custom `AuthProvider`; no new frontend OIDC library is required.
- The frontend currently hardcodes `idpHint: 'oneid-keycloak'` in `src/services/keycloakService.ts`, so login routing is already broker-driven from Keycloak.
- PARI reads standard profile fields plus custom attributes including `dateOfBirth`; the auth type definition also anticipates `fiscalNumber`.
- This OID4VP extension already supports the browser-facing verifier pieces needed for a web RP: request-object endpoint, response endpoint, same-device and cross-device flows, SSE completion, SD-JWT VC verification, claim mappers, and clustered transient state.
- The Italian PID profile is usable for this extension's supported formats: the current IT Wallet documentation states that the transitional remote-flow PID is SD-JWT VC with `vct=urn:eudi:pid:it:1` (and some pilots may still use the temporary `urn:it-wallet:pid:1`).
- The Italian PID data model exposes the claims PARI is likely to need for a POC: `given_name`, `family_name`, `birthdate`, `tax_id_code` or `personal_administrative_number`, plus other PID metadata.
- The official IT Wallet documentation also requires federation-based RP onboarding and `/.well-known/openid-federation` metadata for a fully onboarded relying party. This repository does **not** implement OpenID Federation endpoints.
- This extension is explicitly marked as under active development and not production-ready; that is acceptable for a POC but must stay a tracked risk.

## Recommended POC architecture

1. PARI remains a standard OIDC web client of Keycloak, using the existing Authorization Code + PKCE flow through `keycloak-js`.
2. Keycloak becomes the wallet verifier and identity broker through this OID4VP extension.
3. The user starts in PARI, is redirected to Keycloak, and chooses IT Wallet login there (or PARI directly hints the new broker alias).
4. Keycloak serves the OID4VP request to the wallet, verifies the PID presentation, and turns the verified claims into a brokered Keycloak user/session.
5. Keycloak then issues the normal OIDC tokens PARI already consumes today. PARI never handles OpenID4VP directly.

This keeps the React portal thin and reuses the existing auth/session model instead of introducing a wallet protocol client into the SPA.

## POC implementation design

### 1. Keycloak on AKS

- Package the extension jar (`target/keycloak-extension-oid4vp.jar`) and deploy it into the Keycloak pods.
- Prefer a custom Keycloak image with the provider baked in. A mounted jar can work for experimentation, but it is a weaker operational pattern on AKS.
- Expose Keycloak on a public HTTPS hostname reachable from mobile wallets.
- Ensure the Keycloak cluster has shared transient state for multi-node flows, because the extension's cross-device SSE completion depends on shared `SingleUseObjectProvider` state.

### 2. Keycloak realm and client model

- Keep PARI as the same Keycloak realm/client if possible so backend token validation stays unchanged.
- Add a dedicated OID4VP IdP alias for IT Wallet, separate from the existing broker configuration.
- Configure the verifier close to HAIP / web-RP expectations unless the pilot wallet forces a relaxation:
  - `responseMode=direct_post.jwt`
  - `sameDeviceEnabled=true`
  - `crossDeviceEnabled=true`
  - verifier certificate/private key in `x509CertificatePem`
  - `clientIdScheme=x509_hash` when the wallet/pilot expects X.509-based verifier identification
- Use an explicit `dcqlQuery` for the POC instead of relying only on mapper-derived generation, so the requested credential type and claims are deterministic.

### 3. PID credential request and claim mapping

- Request an Italian PID SD-JWT VC with:
  - `vct=urn:eudi:pid:it:1`
  - fallback awareness for `urn:it-wallet:pid:1` if the chosen pilot still uses the transitional identifier
- Request only the claims PARI needs for the POC:
  - `given_name`
  - `family_name`
  - `birthdate`
  - `tax_id_code` and/or `personal_administrative_number`
- Add Keycloak IdP mappers so the verified PID becomes usable by PARI:
  - `given_name -> firstName`
  - `family_name -> lastName`
  - `birthdate -> dateOfBirth`
  - `tax_id_code -> fiscalNumber` (attribute or session note, depending token strategy)

### 4. Stable user identity strategy

This is the most important functional choice for the POC:

- **Recommended if PARI/backend state must survive across logins:** use a stable identifying PID claim for the brokered Keycloak user, not transient users.
- `tax_id_code` is the most business-relevant candidate for PARI, but it is documented with the `TINIT-` prefix. If PARI or its backend expects the raw codice fiscale without the prefix, plan a normalization step before using it as the stable subject/business key.
- `personal_administrative_number` is another stable option if exposed by the selected issuer, but it is less obviously aligned with existing PARI semantics.
- Avoid `doNotStoreUsers=true` unless the whole POC can rely only on token-time claims; otherwise PARI may lose stable identity correlation across sessions.

### 5. PARI frontend changes

- No frontend OpenID4VP or wallet library should be added for this POC.
- Reuse the existing `keycloak-js` integration.
- Minimal change path:
  - replace the hardcoded `idpHint` with the new IT Wallet IdP alias
- Better change path:
  - make the broker alias configurable via env (for example `VITE_KEYCLOAK_IDP_HINT`)
  - optionally add a second login button if the current `oneid-keycloak` path must coexist
- Keep the current redirect target (`ROUTES.GATEWAY`), because PARI should only observe an authenticated Keycloak session and mapped user profile.

### 6. Backend and token compatibility

- Verify that PARI backend APIs continue trusting access tokens from the same Keycloak realm/client after wallet login.
- If the backend identifies users by `sub`, make sure the resulting Keycloak subject is stable and business-meaningful.
- If the backend needs PID data inside the access token, add protocol mappers from Keycloak user attributes or session notes into JWT claims.
- Email is not a mandatory PID attribute, so the POC must tolerate missing email and continue the existing post-login data completion flow if needed.

## Gap analysis versus the official IT Wallet ecosystem

The current repository is sufficient for a **controlled verifier POC** but likely not for a fully onboarded national IT Wallet relying party:

- The extension covers the OpenID4VP verifier endpoints and credential validation path that a web relying party needs.
- The official IT Wallet docs also require federation onboarding and RP metadata publication through `/.well-known/openid-federation`.
- This repository does not expose OpenID Federation metadata endpoints or federation onboarding flows.

### Consequence

- **Chosen for this POC:** use a controlled sandbox / pilot wallet where verifier trust is configured out-of-band. Under this assumption, the current Keycloak + extension approach is viable.
- **Deferred follow-up:** if the initiative later needs the official IT Wallet onboarding and trust infrastructure, plan an additional workstream for a federation façade / metadata service or another verifier component that publishes the required OpenID Federation entity configuration.

No extra library is required on the React side. For the federation gap, I have **not** selected a repository-vetted library yet; treat that as separate implementation work rather than an assumed drop-in dependency.

## What is needed to make the POC successful

- A wallet sandbox or pilot issuer that can issue an Italian PID in SD-JWT VC format.
- The exact issuer/trust inputs for that sandbox:
  - issuer identifier
  - credential type identifier (`urn:eudi:pid:it:1` or transitional value)
  - trust list / X.509 / issuer-metadata requirements
- A public HTTPS Keycloak endpoint from AKS.
- A Keycloak deployment method that allows adding the provider jar.
- A Keycloak subject/claim mapping choice that PARI backend can live with.
- A frontend login-entry decision: replace the current OneID path or make both available.
- Agreement that official federation onboarding is out of scope for the first POC cut.

## POC success criteria

1. A user starts from the PARI web portal and reaches Keycloak through the existing OIDC login flow.
2. Keycloak offers IT Wallet login and completes a same-device and/or cross-device PID presentation.
3. Keycloak validates the SD-JWT VC PID and returns a successful OIDC session to PARI.
4. PARI reads the mapped profile data it needs (`firstName`, `lastName`, `dateOfBirth`, and a stable fiscal/business identifier).
5. PARI protected API calls succeed with the Keycloak access token after wallet login.
6. Any remaining official-federation requirement is isolated as a clearly named follow-up gap, not confused with the brokered-login POC itself.

## Suggested execution breakdown

1. Confirm whether the POC targets a controlled sandbox or the official IT Wallet onboarding/trust path.
2. Deploy the OID4VP provider into AKS Keycloak.
3. Configure the new IT Wallet OID4VP IdP and the PID DCQL request.
4. Map PID claims into the Keycloak user/token surface needed by PARI.
5. Adjust PARI login triggering (`idpHint` or dual-button UX).
6. Run end-to-end wallet verification tests.
7. If official onboarding is required, design the federation façade / metadata service as a separate workstream.
