## Active task — 1999 FAQ direct Flow entry release

Backend release plan: `docs/1999_FAQ_SURFACE_DIRECTED_FLOW_RELEASE_PLAN_2026-10-09.md` in `taipei-tax-lab/dialogflow-cx-qa-framework`.

- [ ] Wait for backend to provide the immutable Production FAQ Flow/currentPage resource.
- [ ] Replace `config.initialPlaybook` with `config.faqCurrentPage`.
- [ ] MessengerTransport must set `queryParams.currentPage` for **every accepted user text query**.
- [ ] Remove currentPlaybook override from this 1999 page.
- [ ] Keep timezone/session/error/input-clear/analytics behavior unchanged.
- [ ] Treat each submitted query as an independent search; contextual follow-up is not promised.
- [ ] Keep text-first renderer; support backend multi-result text without depending on richContent parsing.
- [ ] Add regression tests for currentPage request body, first/second query, fallback, multi-result text/links, reset, timeout, and one GA4 event per accepted query.
- [ ] Deploy candidate after backend Production currentPage test PASS.
- [ ] Browser smoke actual request/response + GA4.
- [ ] Rollback by restoring prior currentPlaybook transport if needed.

---

# NEXT_TASK

## Active task

**Clear query input after accepted Messenger send**

This is a small frontend UX revision only.

Do not modify CX backend resources, Messenger binding/domains, Playbooks, Tools,
Data Stores, Router, Production mappings, renderer behavior, session/reset
semantics, GA4 event meaning, or the recently accepted load-performance changes.

## Confirmed baseline

- [x] UI / renderer / Rental parity / follow-up / reset / post-reset behavior PASS.
- [x] GA4 custom event is `ai_query_submit`, one event per accepted query.
- [x] GA4 sends no user-entered question/answer/source content.
- [x] Messenger startup remains ahead of deferred GA4 loader.
- [x] Latest Pages production deployment PASS.

## Goal

After a valid user query has been accepted by Messenger for sending, clear the
textarea so the user can type the next follow-up immediately.

The previous question must still remain visible in the rendered result area once
the answer returns.

## A. Exact interaction contract

Implement:

- [x] User types a valid query and submits it.
- [x] Do **not** clear the textarea merely on form submit.
- [x] Clear the textarea only after the existing accepted
      `df-request-sent` boundary confirms Messenger accepted that pending query.
- [x] Reset the character counter to `0 / 1000` at the same time.
- [x] Preserve the submitted query in local state so the result heading
      (`#result-query`) can still display the exact submitted question when
      the answer returns.
- [x] Follow-up queries behave the same way: each accepted send clears the input.
- [x] Post-reset queries behave the same way.
- [x] Clicking an example still only fills/focuses the textarea; it does not clear
      or submit by itself.
- [x] Invalid/empty/rejected-before-acceptance submissions keep the user's text.
- [x] If Messenger/send fails before acceptance, keep the user's text so they can
      retry.
- [x] If a request is accepted but the later answer fails/returns empty, the input
      may remain cleared because the query was already successfully sent.
- [x] Do not auto-focus the textarea while a request is in-flight if doing so
      changes current UX unexpectedly; preserve current focus/result behavior
      unless a focused test shows a simple safe improvement.
- [x] Reset button behavior remains unchanged: it still clears query/session state
      as a separate explicit action.

Evidence: synced main `4f0fff232c31269b5d7661bf1ec5b79845db5e8f`; AGENTS/read-order
documents and app/transport/analytics/package/workflow contracts read.
Only two lines added to app.js: clear value and dispatch the existing input event
after accepted pending-request validation and duplicate-notification guard,
before the unchanged analytics call. Counter uses its existing listener.
Existing submit-handler `const query = input.value.trim()` already captures the
actual sent question independently of textarea state and supplies `#result-query`.
No new global state, focus action, transport/session/renderer/analytics change.

## B. Keep GA4 behavior aligned

The input-clear action should use the same accepted-query boundary already used
by analytics.

Verify:

- [x] Every accepted query still emits exactly one `ai_query_submit`.
- [x] Clearing the textarea does not emit any extra GA4 event.
- [x] First/follow-up/post-reset query counts remain 1/2/3.
- [x] Reset itself emits none.
- [x] No query text is added to analytics.

Evidence: real Chromium with local SDK/gtag fixtures verifies exact no-parameter
event arrays after first/follow-up/post-reset sends (1/2/3), no reset/invalid/
cancelled/unsolicited events, retained early queue and duplicate guard. Analytics
module and accepted-query definition are byte-identical to baseline.

## C. Implementation constraints

Prefer the smallest change in `assets/app.js`.

- [x] Do not move the existing accepted-query definition to a weaker
      click/form-submit boundary.
- [x] Do not change MessengerTransport/session logic unless strictly necessary.
- [x] Do not change result renderer or Markdown behavior.
- [x] Do not change the frozen visual design/CSS unless required for a bug fix.
- [x] Do not undo GA4 idle deferral or other accepted performance behavior.
- [x] Do not introduce a new dependency.

## D. Tests

Add/update focused tests for:

- [x] accepted first query clears textarea and resets counter;
- [x] submitted question still appears in result header after answer;
- [x] same-session follow-up clears textarea again;
- [x] post-reset accepted query clears textarea;
- [x] empty/invalid submit keeps current behavior and does not falsely clear;
- [x] send failure before accepted boundary preserves typed query;
- [x] accepted query followed by answer error/empty state does not restore the
      cleared query automatically;
- [x] example click fills but does not clear/submit;
- [x] GA4 per-query counts remain correct;
- [x] reset/session/currentPlaybook semantics unchanged.

Run:

- [x] Node tests PASS.
- [x] Offline Chromium PASS.
- [x] desktop/390/320 regression checks PASS.
- [x] package integrity/manifest/repeat-build PASS.
- [x] credential/secret scan PASS.

Evidence: Node **21 PASS**; offline Chromium **24 grouped PASS**, no page errors,
0 forwarded external/Production requests. Controlled delayed SDK proves text
retained after submit and async rejection; acceptance clears before answer,
counter zero and focus unchanged. A newly typed draft survives duplicate SDK
notification and later answer; result displays original sent text (including
internal newline), not that draft. Sync pre-acceptance throw/cancel and whitespace/
overlength input retain text. Accepted empty/error demo responses stay cleared.
Existing desktop/390/320, IME, renderer, first-turn/follow-up/reset/expiry/GA4/idle
and scoped local CSP regression PASS. These fixtures do not prove live SDK/GA.

Two independent production/demo builds are byte-identical. Production verifier
PASS: exact 12-file allowlist, CRC, manifest hashes/byte counts, source parity,
live config, no demo payload and fresh extraction. Committed checksum PASS.
Credential-pattern scan PASS on both archives (9/16 text entries) and all five
changed text files; 16 protected runtime/config/resource/workflow/docs files
remain byte-identical. Production ZIP 215,245 bytes, SHA-256
`86e3fe7256f5464e599c2e8ec488338b98d1fa8de97dc5ab7273e9239c0373bd`.

## E. Deployment

- [x] Regenerate `packages/hosting.zip` + checksum.
- [x] Deploy via existing GitHub Actions production-only Pages workflow.
- [x] Record deployed SHA/run/ZIP SHA-256.
- [x] Confirm hosted runtime files match production package.

Deployment PASS: [Actions run 37748612115](https://github.com/taipei-tax-lab/tpctax-1999-ai-web/actions/runs/37748612115),
deployed SHA `edd501268216e57c1f5b0eaa1f295f9c19f78ca0`, success 2026-10-08
16:15:40 Asia/Taipei (08:15:40 UTC), github-pages artifact `11535839849`.
Pages URL: <https://taipei-tax-lab.github.io/tpctax-1999-ai-web/>.
Production ZIP SHA-256:
`86e3fe7256f5464e599c2e8ec488338b98d1fa8de97dc5ab7273e9239c0373bd`.
Actions source guard (`build_type=workflow`), configure/build/deploy PASS; Node
21, deterministic rebuild, committed ZIP/checksum and exact production extraction
checks PASS. Verified HTTPS GETs completed 16:16:04 Asia/Taipei: all **12/12**
files return 200 with correct MIME and match committed ZIP bytes, including
app.js, analytics.js, config and manifest. Six demo/test/tool/internal paths 404.
HTTP file parity does not establish live browser execution.

## F. Human/browser acceptance

Where possible verify in a normal trusted browser:

- [ ] Submit first query → textarea clears immediately after accepted send.
- [ ] Answer still shows the submitted question in the result area.
- [ ] Submit a follow-up → textarea clears again.
- [ ] Reset → new query → textarea clears again after accepted send.
- [ ] No new blocking JS/CSP/CORS issue.
- [ ] GA4 `ai_query_submit` still increments once per accepted query.

If Codex Cloud cannot perform the live checks due its existing proxy/CA
limitations, leave them PENDING rather than FAIL.

All six live checks remain **PENDING / unchecked**. Fresh real deployed Chromium
151, 390×844, at 2026-10-08 16:16:00 Asia/Taipei, inherited Cloud proxy and TLS
verification enabled, no mocked network, fails at the document GET with
`net::ERR_CERT_AUTHORITY_INVALID`. Zero origin browser responses; page JavaScript,
Messenger and GA4 never execute. **0 Production queries and 0 observed GA4
collection requests**. This is the existing Cloud browser trust blocker, not an
observed frontend/SDK/CSP/CORS failure. No TLS/proxy bypass or policy expansion.
Trusted browser must still verify first/follow-up/post-reset clear + original
question, console/network and real GA4 per-query delivery. Earlier human renderer/
Rental/session PASS remains accepted; it does not prove this new live UX behavior.

## G. Documentation / handoff

- [x] Update `PROJECT_STATE.md`.
- [x] Update this checklist with evidence.
- [x] Audit `docs/ANALYTICS.md`: accepted-query analytics contract unchanged;
      leave file byte-identical as required.
- [x] Audit performance/handoff docs: no resource/loading change; leave unchanged.
- [x] Commit/push and STOP for Web ChatGPT review.

Implementation/package/checklist commit `edd501268216e57c1f5b0eaa1f295f9c19f78ca0`
pushed to main and deployed. Final reporting-only commit updates this checklist,
PROJECT_STATE and PAGES_DEPLOYMENT; no ZIP payload changes or second deployment.
Main HEAD is distinct from the deployed SHA. STOP after its push for Web review.

## Completion summary

1. Clear point: existing accepted `df-request-sent` listener in app.js, after
   transport pending/sent, cancellation and duplicate guards; dispatch existing
   input event for the counter. Captured actual sent query still supplies heading.
2. First/follow-up/post-reset clear + `0 / 1000`: offline **PASS**.
3. Form submit alone, invalid/cancelled/sync/async pre-acceptance failure retain
   text: **PASS**. Accepted later empty/error stays cleared; next draft retained.
4. GA4 regression: **PASS**, one parameter-free `ai_query_submit` per accepted
   query, counts 1/2/3, none for reset/clearing/invalid/duplicate notification.
5. Node **21 PASS**, offline Chromium **24 grouped PASS**, desktop/390/320,
   deterministic production/demo build, exact package/manifest/credential scan
   **PASS**. No transport/renderer/session/backend/loading-resource change.
6. Pages **PASS**: SHA `edd501268216e57c1f5b0eaa1f295f9c19f78ca0`,
   [run 37748612115](https://github.com/taipei-tax-lab/tpctax-1999-ai-web/actions/runs/37748612115),
   ZIP SHA-256 `86e3fe7256f5464e599c2e8ec488338b98d1fa8de97dc5ab7273e9239c0373bd`;
   hosted 12/12 bytes match, six exclusions 404.
7. New live UX/GA4 browser verification **PENDING** under Cloud certificate trust
   blocker; all six acceptance boxes unchecked, no Production query sent.
8. Ready for formal Revenue Service IT release: **NO**, pending trusted-browser
   new UX/GA4 acceptance. Existing human renderer/Rental/session PASS carried.

Scratch evidence remains outside Git under `/workspace/work/clear-input/`;
durable deployment details are in [PAGES_DEPLOYMENT.md](docs/PAGES_DEPLOYMENT.md).
No official entry integration or CX backend changes. STOP for Web ChatGPT review.
