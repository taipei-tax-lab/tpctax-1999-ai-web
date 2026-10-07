# NEXT_TASK

## Active task

**Enable Production Messenger + deploy exact production artifact to GitHub Pages + run real browser E2E**

This task is explicitly authorized by the human owner.

Do not modify CX Playbooks, Tools, Data Stores, Router logic, Production versions,
Environment contents, Messenger binding, or allowed domains.

## Confirmed prerequisites

- frontend source of truth: `taipei-tax-lab/tpctax-1999-ai-web`
- UI frozen
- CX backend: `CX BACKEND LAUNCH READY`
- Production Messenger binding: PASS
- Production Environment ID:
  `a0c712e8-ab0c-4520-b100-d2abcfc85868`
- Messenger allowed domains already include:
  - `taipei-tax-lab.github.io`
  - `services.arpa.tpctax.dof.gov.taipei`
- production package is arbitrary-subpath safe
- `hostingUrl` is unused runtime metadata
- Gate 3 local audit: CONDITIONAL PASS

## Goal

Create one live production candidate with Dialogflow Messenger enabled, deploy
**exactly the production package contents** to GitHub Pages, and perform a small
real-browser Production Messenger E2E. If it passes, regenerate/commit the same
production ZIP for Revenue Service IT.

## 1. Inspect GitHub Pages state first

Determine, from repository/GitHub configuration:

- whether GitHub Pages is already enabled for this repo;
- current source/deployment method;
- actual expected public Pages URL;
- whether an existing workflow/branch would be overwritten.

Do not guess the Pages path.

If Pages is not configured, implement the smallest standard GitHub Actions Pages
deployment needed for this repo. Prefer official GitHub Pages actions.

The deployment must publish only the **production artifact contents**, not the
whole repository.

## 2. Enable Messenger in the production candidate

Make the smallest config change necessary:

- set `config.liveEnabled = true`.

Do not alter:
- project/agent/location IDs;
- initial 1999 Playbook;
- session/reset/timeout behavior;
- renderer/model;
- UI;
- Messenger SDK URL;
- expected Production Environment;
- allowed-domain settings.

`hostingUrl` is unused metadata. Do not make runtime depend on it.

## 3. Artifact parity rule

GitHub Pages must serve the same production files that will be delivered to IT.

Use the existing production packager/allowlist as the artifact source of truth.
Do not expose:
- `demo.html`
- `demo/`
- tests
- tools
- source-only deployment documents other than the intentional IT handoff file
- repository internals

If practical, have the Pages workflow build the production package and deploy
its extracted contents so Pages and `hosting.zip` are byte-equivalent for
runtime files.

## 4. Pre-live verification

Before deployment:

- run Node tests;
- run offline Chromium suite;
- verify production ZIP integrity/manifest/reproducibility;
- confirm no secrets/credentials/tokens;
- confirm only intended functional change is live enablement plus Pages deployment
  infrastructure/docs.

## 5. Deploy to GitHub Pages

Deploy the live candidate.

Record:
- actual Pages URL;
- workflow/run evidence;
- deployed commit SHA;
- production ZIP SHA-256.

Do not add the official 1999-site entry link yet.

## 6. Real browser Production E2E

Using the actual GitHub Pages URL, run a deliberately small Production test set.

Minimum required checks:

1. Page loads with no `服務準備中` idle panel.
2. Official Messenger SDK loads successfully.
3. Query button becomes usable.
4. First query:
   `房屋稅自住住家用稅率怎麼申請？`
   returns a non-empty answer.
5. Same-session follow-up returns a non-empty answer and does not require a reset.
6. `清除前次問答，重新提問` performs the real session reset.
7. After reset, one new query returns a non-empty answer.
8. No blocking CSP/CORS/JS errors.
9. Capture actual SDK/subresource/connect destinations and relevant response
   headers/console errors.
10. Verify 390px mobile layout still works on the live page.

Keep query count minimal. Do not run bulk tax-answer quality testing; backend
smoke is already complete.

## 7. Gate decisions

If E2E passes:
- mark GitHub Pages live validation PASS;
- close Gate 3 for the GitHub Pages environment based on observed evidence;
- regenerate/commit the live `packages/hosting.zip` + checksum;
- state that this exact live package is the IT handoff candidate.

If E2E fails:
- stop;
- diagnose whether failure is Pages, CSP/CORS/resource loading, Messenger SDK,
  binding/domain, or frontend;
- do not modify CX Playbooks/Tools or broaden security policy without evidence.

## 8. Documentation

Update:
- `PROJECT_STATE.md`
- `docs/DEPLOYMENT_GATES.md`
- `docs/IT_HANDOFF.md`
- `NEXT_TASK.md`

Commit/push and STOP.

Final report must clearly provide:
1. actual GitHub Pages test URL;
2. whether live Messenger initialized;
3. E2E PASS/FAIL with each minimal check;
4. observed external resource/connect hosts;
5. any CSP/CORS/browser-console issue;
6. final live production ZIP SHA-256;
7. whether the same ZIP is ready to hand to Revenue Service IT.
