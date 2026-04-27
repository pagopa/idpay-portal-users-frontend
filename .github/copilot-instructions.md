# Copilot instructions

## Build, test, and lint commands

- Install dependencies: `yarn`
- Start the dev server: `yarn dev`
- Build for production: `yarn build`
- Lint: `yarn lint`
- Run the full Jest suite: `yarn test`
- Run one test file: `yarn test --runInBand src/pages/InsertEmail/__tests__/InsertEmail.test.tsx`
- Run one named test: `yarn test --runInBand src/pages/InsertEmail/__tests__/InsertEmail.test.tsx -t "<test name regex>"`
- Run coverage (the CI workflow does this after `yarn generate`): `yarn test:coverage`
- Regenerate the onboarding API client after editing `openApi/openapi.onboarding.web.yml`: `yarn generate`

## High-level architecture

- This is a Vite + React SPA served under `/utente`. The base path is configured both in `vite.config.ts` (`base: '/utente/'`) and in `src/main.tsx` (`<BrowserRouter basename="/utente">`).
- `src/main.tsx` is the real app bootstrap: it wires MUI Italia, `CssBaseline`, i18n, `AuthProvider`, routing, and OneTrust cookie initialization before rendering `App`.
- `src/App.tsx` splits public and private routes. Private pages are wrapped by `ProtectedRoute`, and route constants are centralized in `src/routes.tsx`.
- Authentication is owned by `src/contexts/AuthContext.tsx`, `src/services/keycloakService.ts`, `src/config/keycloak.ts`, and `src/utils/tokenManager.ts`. That stack handles Keycloak init, silent SSO bootstrap, token persistence via `storageTokenOps`, and scheduled token refresh. `VITE_KEYCLOAK_MOCK_AUTH=true` short-circuits the real auth flow for local work.
- `src/pages/GatewayPage/GatewayPage.tsx` is the post-login decision point. It validates token/user preconditions, calls `OnboardingWebApi.getStatus()`, and routes the user to dashboard, TOS, upcoming-initiative, feedback, or error pages.
- API types and low-level clients under `src/api/generated/onboarding-web/` are generated from `openApi/openapi.onboarding.web.yml`. Application code should normally go through `src/api/onboardingWebApiClient.ts`, which adds bearer auth, common headers, loader/no-loader fetch wrappers, and backend-specific response normalization.
- Global loading is coordinated by `src/components/Layout/Layout.tsx`, `src/utils/loadingOverlay.ts`, and `src/api/buildFetchApiWithLoading.ts`. The layout registers a mutable `loadingRef`, and the wrapped fetch API toggles the shared overlay.
- Status screens are config-driven. `src/components/StatusPageFactory/StatusPageFactory.tsx` renders definitions from `src/pages/ErrorPage/errorStates.tsx` and `src/pages/FeedbackPage/feedbackStates.tsx`, while `src/utils/statusChecker.ts` maps backend status codes onto those screens.
- The onboarding TOS flow (`src/pages/TOS`, `src/components/TOS`) is separate from the legal-content pages (`src/pages/TermsOfService`, `src/pages/PrivacyPolicy`), which render HTML from JSON through `PrivacyAndTosLayout`.

## Key conventions

- Use `src/routes.tsx` for route paths instead of hardcoding URLs, and remember that any absolute link still needs the `/utente` base path.
- The multi-step onboarding flow intentionally carries state through tiny module-level cache hooks: `useCanAccessTOSStore`, `useTOSCheckboxStore`, `useEmailStore`, `useVerifyRequirementStore`, and `useEmailAssistanceStore`. They are not React context or Redux stores; if you change the flow, update both the page logic and the related hook tests/mocks.
- Add or change user-facing copy in `src/locale/it.ts` and consume it with `t()` / `Trans`. This app currently initializes only the Italian locale.
- If you touch the onboarding API contract, rerun `yarn generate`. That pipeline converts the source OpenAPI 3 spec to Swagger 2, patches known schema issues in `openApi/scripts/onboarding-web_fixPreGen.cjs`, and regenerates `src/api/generated/onboarding-web/`.
- Prefer `OnboardingWebApi` plus shared helpers like `extractErrorResponse` / `isSuccessStatus` for backend handling so Gateway, Verify Requirements, Dashboard, Waiting, and Assistance pages keep the same error-routing behavior.
- Tests live next to the code in `__tests__` folders and use Jest + React Testing Library. `jest.config.ts` defines the asset/style mocks, and `jest.setup.ts` adds `@testing-library/jest-dom` plus a small console-error filter for `act(...)` warnings.
- Legal, footer, and cookie-banner links rely on `getBaseUrl()`, `ROUTES`, and the OneTrust loader’s link-fixing logic. Preserve that pattern when changing privacy, terms, or cookie-related navigation.
