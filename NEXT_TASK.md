# NEXT_TASK

## Resume status — 2026-10-08 (Asia/Taipei)

The owner changed Pages Source to GitHub Actions. Resumed existing
`live-pages-candidate` at `f0a239488a6f52ddea0aa91b97efd44fe84105f6`; no completed implementation
or offline verification was redone. Fast-forwarded this exact candidate to
`main` as prescribed by the prior handoff.

- [x] Verify Pages Source switched successfully: Actions run's
  `Require Actions Pages source` passed `build_type=workflow`.
- [x] Complete production artifact deployment: build and deploy jobs PASS.
- [x] Record Actions run / deployed SHA / Pages URL (see E).
- [x] Continue available live validation: HTTPS hosted-file parity, exclusion
  checks and response/security headers obtained; browser attempted twice.
- [x] Leave blocked live acceptance items unchecked and record exact blockers.

Direct `gh api .../pages` still returns Forbidden; verification comes from the
successful fail-closed source guard in [37714645831](https://github.com/taipei-tax-lab/tpctax-1999-ai-web/actions/runs/37714645831), not a
claim of direct administration access. Real-browser E2E remains BLOCKED by the
Cloud Chromium proxy-CA trust failure; this is not a deployed-site FAIL.
Next action is trusted-browser live validation of unchecked F/G items,
then Web ChatGPT review. Do not repeat B/D or change CX/UI/session settings.

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
The prior hold is resolved: the owner switched Pages Source, and the unchanged
candidate was fast-forwarded to `main`; the workflow source guard passed.

### C. Production artifact parity

- [x] Ensure Pages deploys only production artifact contents.
- [x] Do not publish:
  - `demo.html`
  - `demo/`
  - tests
  - tools
  - fixtures
  - repository internals
- [x] Prefer building the existing production package and deploying its extracted
      contents.
- [x] Confirm Pages runtime files and `hosting.zip` runtime files are byte-equivalent.

Evidence (resume): successful build/deploy [37714645831](https://github.com/taipei-tax-lab/tpctax-1999-ai-web/actions/runs/37714645831)
rebuilds twice, compares committed ZIP, verifies checksum/manifest/allowlist/
source parity/credential scan and uploads the fresh ZIP extraction only.
Actual hosted GETs of all 11 payload files are HTTP 200 and byte-identical to
`hosting.zip`, including `MANIFEST.json`; correct HTML/JS/CSS/image MIME.
Hosted exclusion probes return 404 for `demo.html`, `demo/mock-messenger.js`,
`tests/phase7e3a.test.mjs`, `tools/package_static.py`, `AGENTS.md` and the workflow.
No repository-root/Jekyll upload. Prior offline checks in D remain valid.

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

- [x] If Pages is not configured, add the smallest standard official GitHub Pages
      Actions deployment.
- [x] Deploy the production artifact.
- [x] Record actual GitHub Pages URL.
- [x] Record deployed commit SHA.
- [x] Record GitHub Actions workflow/run evidence.
- [x] Record live production ZIP SHA-256.
- [x] Do not add the official 1999-site entry link yet.

- [x] Prepared official Actions workflow with a fail-closed Pages source guard.
- [x] Generated candidate live ZIP/checksum (not an E2E-approved IT release).

Evidence (resume): Pages already exists, so no new-site setup was required.
The owner's source migration is verified by the Actions `build_type=workflow`
guard and `configure-pages` success. Standard prepared workflow deployed only
production ZIP contents; both jobs succeeded.

- Initial deployed SHA: `f0a239488a6f52ddea0aa91b97efd44fe84105f6`.
- Initial run: [37714645831](https://github.com/taipei-tax-lab/tpctax-1999-ai-web/actions/runs/37714645831); deployment reported success at
  **2026-10-08 09:47:50 Asia/Taipei** (01:47:50 UTC).
- Pages URL: `https://taipei-tax-lab.github.io/tpctax-1999-ai-web/`.
- Artifact ID: `11523054017` (`github-pages`).
- Initial ZIP: 211,148 bytes, SHA-256
  `c19ad3e5ebfc5d3a97c45aaf1cdd3f36dec33cf2b854b59d5be35335c57a4ebd`.
- Updated handoff documentation is also packaged; the subsequent documentation
  artifact/run/hash are recorded in `docs/PAGES_DEPLOYMENT.md` and the final
  completion summary. Runtime bytes remain identical.

Official entry link remains absent. Artifact deployment PASS does not mean
Messenger E2E PASS or formal IT release approval.

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
- [x] Capture relevant response/security headers.
- [ ] 390px mobile live page works without layout regression.

Keep query count minimal. Do not perform bulk tax-answer quality testing.

Evidence (resume): hosted Pages document, all 11 payloads and official SDK
script are reachable using inherited proxy + verified TLS (HTTP 200).
Pages headers: `Access-Control-Allow-Origin: *`,
`Strict-Transport-Security: max-age=31556952`, `Cache-Control: max-age=600`;
no CSP/CSP-Report-Only, X-Frame-Options, Referrer-Policy, Permissions-Policy,
COOP/COEP/CORP present in captured document headers. SDK script:
`Access-Control-Allow-Origin: *`, `X-Content-Type-Options: nosniff`,
CORP `cross-origin`, COOP `same-origin; report-to="dialogflow-console"`,
CSP-Report-Only `require-trusted-types-for 'script'` with Google's reporting URL.
Actual headers and results are summarized in `docs/PAGES_DEPLOYMENT.md`.

Chromium 151 at 390px attempted document GET twice (09:48:20 / 09:49:33
Asia/Taipei); both stopped before origin response with
`net::ERR_CERT_AUTHORITY_INVALID`. The inherited Cloud proxy issues certificates
under its environment CA: curl reports `SSL certificate verify ok`; Chromium
cannot trust that CA in this execution profile. A workspace-local NSS trust
database with the environment-provided CA and XDG_DATA_HOME was attempted but
did not resolve browser trust. TLS verification was kept enabled; no global
certificate bypass, proxy bypass, backend or production policy change.

`dialogflow.cloud.google.com/` HEAD is reachable (200) but is not a Messenger
API/session test. `fonts.googleapis.com/` HEAD at 09:50:32 Asia/Taipei is blocked
by proxy CONNECT 403 (curl 56). This probe is not an observed SDK request and
does not establish that Fonts is required. Existing prior network-denial evidence
is historical; this environment has improved Pages/SDK/API-host reachability.

**0 Production queries**; no browser SDK initialization, query/reset/session,
subresource/connect inventory, CSP/CORS/console behavior or mobile live layout
could be observed. HTTP SDK retrieval is not browser SDK-load PASS. All F
acceptance checks except the captured headers remain unchecked. Do not diagnose
this as origin CSP/CORS, binding-domain, SDK or frontend failure.

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

Decision: **DEPLOYMENT PASS — REAL-BROWSER E2E BLOCKED BY CLOUD BROWSER CA
TRUST**. Pages source migration and artifact parity are complete. Gate 3 remains
CONDITIONAL PASS until a trusted real browser verifies F; IT readiness remains
NO. No demonstrated frontend/SDK/binding/origin CSP-CORS failure. Updating the
packaged handoff requires a deterministic candidate archive refresh; it does
not check off the conditional E2E-PASS formal-release steps above.

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


## Historical completion summary — initial candidate attempt, 2026-10-08

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


## Completion summary — resumed deployment, 2026-10-08 (Asia/Taipei)

- Pages Source migration verified; production-only deployment and hosted-byte
  parity PASS. Exact run / SHA / final ZIP are in `docs/PAGES_DEPLOYMENT.md`.
- Actual URL: `https://taipei-tax-lab.github.io/tpctax-1999-ai-web/`.
- Messenger initialized: UNVERIFIED / BLOCKED, not a demonstrated failure.
- F: headers captured; all remaining acceptance checks pending. Browser document
  GET fails `ERR_CERT_AUTHORITY_INVALID` at the Cloud proxy CA trust boundary;
  Fonts hostname HEAD separately gets CONNECT 403. **0 Production queries**.
- Observed HTTPS retrieval hosts: Pages and `www.gstatic.com`; API root HEAD
  also reachable. No browser SDK/subresource/connect inventory was observed.
- CSP/CORS/page-console behavior unverified because page JS never executed.
- Gate 3 CONDITIONAL PASS; Revenue Service IT release ready: NO. Conditional
  E2E-PASS release regeneration/readiness checks remain unchecked.
- No CX/UI/session changes or official entry link. Updated checklist/state/
  deployment/handoff documentation committed and pushed; STOP for review.
