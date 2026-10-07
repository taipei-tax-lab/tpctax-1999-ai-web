# NEXT_TASK

## Active task

**Enable Production Messenger + GitHub Pages live E2E**

This task is explicitly authorized by the human owner.

Do not modify CX Playbooks, Tools, Data Stores, Router logic, Production versions,
Environment contents, Messenger binding, or allowed domains.

## Confirmed prerequisites

- [x] Frontend source of truth: `taipei-tax-lab/tpctax-1999-ai-web`
- [x] UI frozen
- [x] CX backend: `CX BACKEND LAUNCH READY`
- [x] Production Messenger binding verified
- [x] Production Environment ID:
  `a0c712e8-ab0c-4520-b100-d2abcfc85868`
- [x] Allowed domains include:
  - `taipei-tax-lab.github.io`
  - `services.arpa.tpctax.dof.gov.taipei`
- [x] Production package is arbitrary-subpath safe
- [x] `hostingUrl` is unused runtime metadata
- [x] Gate 3 local audit: CONDITIONAL PASS

## Goal

Enable the frozen production frontend for live Messenger, deploy the exact
production artifact contents to GitHub Pages, run a minimal real-browser
Production Messenger E2E, and if successful regenerate the exact live package
for Revenue Service IT.

## Checklist

### A. Sync and inspect Pages state

- [ ] Pull/sync latest `main`.
- [ ] Read:
  - `AGENTS.md`
  - `README.md`
  - `PROJECT_STATE.md`
  - `NEXT_TASK.md`
  - `docs/DEPLOYMENT_GATES.md`
  - `docs/IT_HANDOFF.md`
  - `docs/PRODUCT_PLAN.md`
  - `docs/RESULT_CONTRACT.md`
- [ ] Determine whether GitHub Pages is already enabled for this repo.
- [ ] Record current Pages source/deployment method.
- [ ] Record actual expected public Pages URL.
- [ ] Confirm whether an existing workflow/branch would be overwritten.

### B. Enable live Messenger candidate

- [ ] Change only `assets/config.js`:
  `liveEnabled: false` → `liveEnabled: true`.
- [ ] Confirm project/agent/location/initialPlaybook/session/reset/timeout/model/
      renderer/UI/Messenger SDK URL remain unchanged.
- [ ] Do not make runtime depend on `hostingUrl`.

### C. Production artifact parity

- [ ] Ensure Pages deploys only production artifact contents.
- [ ] Do not publish:
  - `demo.html`
  - `demo/`
  - tests
  - tools
  - fixtures
  - repository internals
- [ ] Prefer building the existing production package and deploying its extracted
      contents.
- [ ] Confirm Pages runtime files and `hosting.zip` runtime files are byte-equivalent.

### D. Pre-deployment verification

- [ ] Node tests PASS.
- [ ] Offline Chromium tests PASS.
- [ ] Package integrity PASS.
- [ ] Manifest verification PASS.
- [ ] Deterministic repeat build PASS.
- [ ] Secret/credential/token scan PASS.
- [ ] Confirm only intended functional change is live enablement plus Pages
      deployment infrastructure/docs.

### E. GitHub Pages deployment

- [ ] If Pages is not configured, add the smallest standard official GitHub Pages
      Actions deployment.
- [ ] Deploy the production artifact.
- [ ] Record actual GitHub Pages URL.
- [ ] Record deployed commit SHA.
- [ ] Record GitHub Actions workflow/run evidence.
- [ ] Record live production ZIP SHA-256.
- [ ] Do not add the official 1999-site entry link yet.

### F. Real browser Production E2E

- [ ] Live page does not show `服務準備中` in normal ready state.
- [ ] Official Dialogflow Messenger SDK loads successfully.
- [ ] Query button becomes usable.
- [ ] First query:
      `房屋稅自住住家用稅率怎麼申請？`
      returns a non-empty answer.
- [ ] Same-session follow-up returns a non-empty answer.
- [ ] `清除前次問答，重新提問` performs a real session reset.
- [ ] After reset, one new query returns a non-empty answer.
- [ ] No blocking CSP error.
- [ ] No blocking CORS error.
- [ ] No blocking JavaScript error.
- [ ] Capture observed SDK/subresource hosts.
- [ ] Capture observed Messenger connect destinations.
- [ ] Capture relevant response/security headers.
- [ ] 390px mobile live page works without layout regression.

Keep query count minimal. Do not perform bulk tax-answer quality testing.

### G. Gate decision

If E2E PASS:

- [ ] Mark GitHub Pages live validation PASS.
- [ ] Close Gate 3 for the GitHub Pages environment based on observed evidence.
- [ ] Regenerate live `packages/hosting.zip`.
- [ ] Regenerate `packages/hosting.sha256`.
- [ ] Confirm this exact live package is ready for Revenue Service IT.

If E2E FAIL:

- [ ] Record whether failure is Pages / CSP-CORS / SDK / binding-domain / frontend.
- [ ] STOP without modifying Playbooks/Tools or broadly weakening security policy.

### H. Documentation and handoff

- [ ] Update `PROJECT_STATE.md`.
- [ ] Update `docs/DEPLOYMENT_GATES.md`.
- [ ] Update `docs/IT_HANDOFF.md`.
- [ ] Update this `NEXT_TASK.md` checklist with completed items and evidence.
- [ ] Commit/push all changes.
- [ ] STOP for Web ChatGPT review.

## Completion report

At the bottom of this file, add a short completion summary with:

1. actual GitHub Pages test URL;
2. Messenger initialized: PASS/FAIL;
3. E2E checklist result;
4. observed external resource/connect hosts;
5. CSP/CORS/browser-console issues;
6. live production ZIP SHA-256;
7. ready to hand to Revenue Service IT: YES/NO.

## Functional freeze

Do not change without new explicit human instruction:

- CX Playbooks/Tools/Data Stores/Router/Production versions;
- Production Environment contents;
- Messenger binding or allowed domains;
- one-shot `currentPlaybook`;
- session/reset/expiry/timeout semantics;
- normalized result model;
- answer/source/FAQ renderer;
- frozen UI.
