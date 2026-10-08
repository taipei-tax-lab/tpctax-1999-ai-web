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

- [x] Pull/sync latest `main`.
- [x] Read:
  - `AGENTS.md`
  - `README.md`
  - `PROJECT_STATE.md`
  - `NEXT_TASK.md`
  - `docs/DEPLOYMENT_GATES.md`
  - `docs/IT_HANDOFF.md`
  - `docs/PRODUCT_PLAN.md`
  - `docs/RESULT_CONTRACT.md`
- [x] Determine whether GitHub Pages is already enabled for this repo.
- [x] Record current Pages source/deployment method.
- [x] Record actual expected public Pages URL.
- [x] Confirm whether an existing workflow/branch would be overwritten.

Evidence (2026-10-08): fast-forward synced `main` at
`bcb49fcd34fd2420c31ed98df4eafc6465e8b270`; all listed documents read.
Repository metadata reports `has_pages=true`. Existing successful run
[37700742476](https://github.com/taipei-tax-lab/tpctax-1999-ai-web/actions/runs/37700742476)
shows dynamic branch publication: checkout `main`, Jekyll source `.`, upload
`_site`; deploy logs confirm URL
`https://taipei-tax-lab.github.io/tpctax-1999-ai-web/`.
No checked-in workflow, gh-pages branch or CNAME exists. The existing artifact
includes demo/tests/tools and repository documentation; it does not meet this
task's production-only requirement. Replacing that publication method requires
Pages source migration, not merely adding a second racing workflow.
Direct Pages settings API read via `gh api .../pages` is Forbidden; the connector
has no Pages administration endpoint. Runtime network policy also rejects the
Pages hostname: HEAD at 2026-10-08 00:59:27 UTC returned proxy CONNECT 403
(curl 56), before the page origin. This is not an origin CSP/CORS failure.

### B. Enable live Messenger candidate

- [x] Change only `assets/config.js`:
  `liveEnabled: false` → `liveEnabled: true`.
- [x] Confirm project/agent/location/initialPlaybook/session/reset/timeout/model/
      renderer/UI/Messenger SDK URL remain unchanged.
- [x] Do not make runtime depend on `hostingUrl`.

Evidence: source candidate changes exactly one config value, `liveEnabled=true`.
All other runtime files/config fields match synchronized baseline; no CX mutation.
Repository search finds `hostingUrl` only as config metadata, never a runtime read.
Publishing this candidate to `main` is held until the existing branch-based Pages
source is migrated, to avoid automatically republishing the full repository.

### C. Production artifact parity

- [ ] Ensure Pages deploys only production artifact contents.
- [ ] Do not publish:
  - `demo.html`
  - `demo/`
  - tests
  - tools
  - fixtures
  - repository internals
- [x] Prefer building the existing production package and deploying its extracted
      contents.
- [ ] Confirm Pages runtime files and `hosting.zip` runtime files are byte-equivalent.

Evidence: `.github/workflows/pages.yml` prepares the official Actions route,
checks Pages `build_type=workflow` first, rebuilds the production ZIP twice,
compares it with the committed ZIP, verifies the checksum/allowlist/manifest/
source bytes/credential scan, then uploads only a new directory extracted from
that ZIP. No repository-root upload. Local extraction is byte-equivalent for all
11 payload files. Actual Pages deployment parity remains unchecked until a
successful new workflow/artifact and hosted readback. Existing branch-based
publication still violates the required production-only scope.

### D. Pre-deployment verification

- [x] Node tests PASS.
- [x] Offline Chromium tests PASS.
- [x] Package integrity PASS.
- [x] Manifest verification PASS.
- [x] Deterministic repeat build PASS.
- [x] Secret/credential/token scan PASS.
- [x] Confirm only intended functional change is live enablement plus Pages
      deployment infrastructure/docs.

Evidence: Node **10 PASS**; offline Chromium **12 grouped checks PASS**;
extracted live candidate at 3 local directory paths × directory/index entries
= **6 cases / 18 viewport checks** (1280/390/320px), with the exact SDK URL
fulfilled locally by a synthetic no-query SDK, correct module/CSS/image MIME,
zero CSP violations/page errors/forwarded external requests. Disabled-mode
coverage now explicitly injects disabled config only for that fixture; the
shipped config is live. Production queries **0**; these are not live E2E results.
ZIP CRC, exact 11-file allowlist, complete manifest bytes/hash/source parity,
all unchanged official image hashes and credential-pattern scan PASS.
Two independent hosting/demo builds are byte-identical. Release verifier also
correctly rejects extra demo payload, stale config and synthetic credential.
Only runtime diff from baseline is `liveEnabled=false` → `true`; all HTML/CSS/
images/app/transport/model/demo bytes and other config fields remain unchanged.

### E. GitHub Pages deployment

- [ ] If Pages is not configured, add the smallest standard official GitHub Pages
      Actions deployment.
- [ ] Deploy the production artifact.
- [x] Record actual GitHub Pages URL.
- [ ] Record deployed commit SHA.
- [ ] Record GitHub Actions workflow/run evidence.
- [x] Record live production ZIP SHA-256.
- [x] Do not add the official 1999-site entry link yet.

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

Evidence: normal Chromium at the confirmed Pages URL (390px) failed document
GET with `net::ERR_TUNNEL_CONNECTION_FAILED`; zero origin responses and zero
Production queries. HEAD separately returned proxy CONNECT 403, curl 56.
Effective restricted runtime revision 6 has custom hosts only
`services.arpa.tpctax.dof.gov.taipei`, `www.gstatic.com`; Pages host is absent.
HEAD to `dialogflow.cloud.google.com` and `fonts.googleapis.com` at
2026-10-08 01:02:56 UTC also returned CONNECT 403 (no API/query request).
No hosted SDK/subresources/connect destinations, origin security headers,
CSP/CORS behavior or page JavaScript execution were observed in this attempt.
All F acceptance checks remain unchecked, including mobile live behavior;
offline mobile PASS is not a substitute.

### G. Gate decision

If E2E PASS:

- [ ] Mark GitHub Pages live validation PASS.
- [ ] Close Gate 3 for the GitHub Pages environment based on observed evidence.
- [ ] Regenerate live `packages/hosting.zip`.
- [ ] Regenerate `packages/hosting.sha256`.
- [ ] Confirm this exact live package is ready for Revenue Service IT.

If E2E FAIL:

- [x] Record whether failure is Pages / CSP-CORS / SDK / binding-domain / frontend.
- [x] STOP without modifying Playbooks/Tools or broadly weakening security policy.

Decision: **BLOCKED — Pages source migration and execution-environment network
access**. No demonstrated frontend / SDK / Production binding / origin CSP-CORS
failure. Gate 3 remains CONDITIONAL PASS; Pages closure and IT readiness are
pending. Prepared archive is a candidate only; conditional PASS release steps
above remain unchecked. No CX/UI/session/security change is proposed.

### H. Documentation and handoff

- [x] Update `PROJECT_STATE.md`.
- [x] Update `docs/DEPLOYMENT_GATES.md`.
- [x] Update `docs/IT_HANDOFF.md`.
- [x] Update this `NEXT_TASK.md` checklist with completed items and evidence.
- [x] Commit/push all changes.
- [x] STOP for Web ChatGPT review.

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


## Completion summary — 2026-10-08

- Candidate prepared and offline checks PASS; deployment and live E2E **BLOCKED**.
- Actual previous/expected Pages URL:
  `https://taipei-tax-lab.github.io/tpctax-1999-ai-web/`; browser cannot reach it.
- Live candidate deployed SHA / new Actions run: **NONE**. Existing successful
  baseline `bcb49fcd34fd2420c31ed98df4eafc6465e8b270`, run `37700742476`, is not
  candidate E2E evidence.
- Messenger initialization and first/followup/reset/new-session answers:
  **UNVERIFIED / BLOCKED**, not PASS or a demonstrated Messenger failure.
- This attempt observed only the Pages document GET, blocked at proxy; **no
  hosted SDK/subresource/connect inventory**. No origin CSP/CORS/headers or page
  JS execution; **0 Production queries**. Offline synthetic SDK checks remain
  explicitly separate.
- Candidate live ZIP SHA-256:
  `c19ad3e5ebfc5d3a97c45aaf1cdd3f36dec33cf2b854b59d5be35335c57a4ebd`.
- Revenue Service IT delivery ready: **NO**. Candidate archive is not an
  E2E-verified formal release. Gate 3 retains local **CONDITIONAL PASS**.
- Required next input: change Pages Source from branch to GitHub Actions; publish
  effective runtime access for Pages and actual SDK/API resource destinations.
  Requested Pages/API hosts remain unavailable; do not bypass the proxy, change
  CX resources or speculate a broad CSP allowlist. Google Fonts access/necessity
  must be assessed from SDK capture rather than assumed a release requirement.
- Candidate branch `live-pages-candidate` is used to avoid automatically
  publishing the full repo via main/root Jekyll. Review this branch's diff before
  replacing main. Main and current Pages baseline remain unchanged.
- Candidate implementation commit/push confirmed: `fbc3814778d68bb4bd55ee74ef8e5face71e0163`
  on `origin/live-pages-candidate`; final checklist reporting follows in a small
  documentation commit.
- STOP for Web ChatGPT review after candidate commit/push. Unchecked acceptance
  items intentionally remain pending; no live PASS is claimed.
