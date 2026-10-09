# NEXT_TASK — 1999 FAQ direct Flow web cutover

Date: 2026-10-09 (Asia/Taipei)
Status: **IMPLEMENTED / OFFLINE PASS / DEPLOYMENT IN PROGRESS**

Target after real acceptance: `1999 FAQ SURFACE-DIRECTED FLOW SEARCH LIVE / USABLE`.
Until trusted-browser evidence exists: `DEPLOYED / HUMAN LIVE ACCEPTANCE PENDING`.
Earlier one-shot Playbook/reset tasks are superseded by this checklist; their
results remain historical in PROJECT_STATE/PAGES_DEPLOYMENT.

## A. Authoritative contract and implementation

- [x] Sync Web main `410db6c1891c58d38197fa55d6b2b1d98be9a51a` and read AGENTS/state/task/README/local handoff/product/result docs.
- [x] Read-only verify backend main `39e176ed40a4ad81cb9b39b6a7b15687bbcea4bb`, STATE/TASKS/boundary/release plan and authoritative `1999_FAQ_WEB_FLOW_HANDOFF_2026-10-09.md`; backend READY, no more architecture work.
- [x] Replace initialPlaybook runtime config with exact faqCurrentPage START_PAGE.
- [x] Every accepted text request sets currentPage and Asia/Taipei; deletes currentPlaybook.
- [x] SDK defaults match per-query contract at initialization, before every sendQuery and after internal recovery; never disarm after first query.
- [x] Agent/project/location/language/Production binding/Messenger integration/SDK URL/GA4 ID unchanged.
- [x] Remove reset button, JS listener/state, CSS, accessibility control and unused clear/armed transport code from index/demo.
- [x] Each complete question is an independent semantic search; new result replaces previous; no transcript or contextual follow-up promise.
- [x] Preserve accepted-send input/counter clear, retained pre-acceptance failure text, original result heading and next draft.
- [x] Combine all raw text ResponseMessages and text array items in order; parsed-only fallback, richContent optional.
- [x] Safe text/numbering/newlines/official URL rendering; fixed backend Rental note/link shown normally, no classifier/internal Rental call.
- [x] GA4 G-S891SFSMBH + ai_query_submit, exactly once/accepted query with no business parameters; idle loader/failure isolation unchanged.

Fixed currentPage:
`projects/serviceagent-1150909/locations/asia-northeast1/agents/799426c1-ba69-49dc-85e4-5065985706e2/flows/676409b6-b02f-4a24-9d3a-81e14cb77d4f/pages/START_PAGE`.
Raw text is authoritative when present, avoiding partial parsed-text truncation;
parsed messages are used only when raw has no nonblank text. No card parser added.
Technical session reset remains internal for expiry; timeout never retries and
locks until SDK settles. Backend resources and Rental frontend/CX mutation: **0**.

## B. Offline verification

- [x] Node tests: **28 PASS** (21 transport/result/config + 7 analytics).
- [x] Offline Chromium: **26 grouped PASS**, no page errors, zero forwarded external/Production requests.
- [x] First/second/third request body and pre-event SDK defaults use identical exact currentPage/timeZone; no currentPlaybook, same technical session.
- [x] Demo/mock transport matches contract; 1/2/3/4/5 synthetic complete multi-message texts + interleaved optional cards + fallback.
- [x] 1280/390/320 regression: complete text, numbering, pre-wrap, clickable official URLs/Rental link, no overflow/reset UI.
- [x] New query/fallback replace prior text/metadata; empty response is empty state, service/timeout are errors, not fabricated zero fallback.
- [x] Delayed submit/rejection retains input; acceptance clears before answer; duplicate notification preserves next draft; heading uses actual sent text.
- [x] Internal idle/in-flight expiry and timeout recovery/no retry/ignored late response/locked transport/error alert behavior.
- [x] GA4 counts 1/2/3, no custom parameters or duplicate/cancelled/invalid/recovery event; unavailable/blocked GA does not block query.
- [x] Deterministic hosting/demo rebuild; exact manifest/CRC/source/checksum/integrity and fresh extraction.
- [x] Credential/secret scan of packages and changed text files.

CurrentPage evidence from Chromium's local SDK fixture (not Production):
ordinal 1 / 2 / 3 each has queryParams and pre-event sdkDefaults equal to:
`{currentPage: <full START_PAGE above>, timeZone: 'Asia/Taipei'}`; no Playbook key.
GA queue is only `['event','ai_query_submit']`, lengths 1/2/3. Fixtures do not prove
real SDK dispatch, backend response or GA receipt. Backend's own accepted suite
observed 0/2/5 results; frontend 1–5 coverage here is explicitly synthetic.

Two independent hosting/demo builds byte-identical. Exact12-file production
allowlist/CRC/manifest/source parity/live config/no demo/fresh extraction PASS.
Both archives scanned (9/16 text entries), 23 changed text files scanned, no
credential pattern. Nine protected analytics/image/workflow/packager/performance
files unchanged. Committed checksum PASS. Production ZIP **214,669 bytes**,
SHA-256 `4f322561e9cff0e36f3ec4d44d5c7bef36088fed0902b16694e06a8de29b63e1`.
Demo ZIP **232,535 bytes**, SHA-256
`5e454c7d3b50d7591bf2cebd6327f51716a744f2cbf3d7eba1e816b084130ab8`.

## C. Package and Pages deployment

- [x] Regenerate committed packages/hosting.zip and hosting.sha256.
- [ ] Push source/package commit to main; existing production-only Actions source/build/deploy PASS.
- [ ] Record source/deployed SHA, run, artifact, package bytes/SHA and Pages URL.
- [ ] Hosted 12-file byte parity/MIME and six demo/test/tool/internal exclusions.

## D. Real browser acceptance — never substitute mocks or HTTPS parity

- [ ] Real Messenger first request has exact currentPage and no currentPlaybook.
- [ ] Real Flow text returns complete multi-candidate FAQ answers and clickable official/Rental URLs.
- [ ] Second/third query independently use same currentPage and replace old results.
- [ ] Genuine-zero fallback displays with Rental link and no stale result.
- [ ] Accepted send clears input/counter; answer heading preserves original question.
- [ ] No reset UI; mobile basic display and no new blocking JS/CSP/CORS errors.
- [ ] Real GA4 ai_query_submit exactly once/query with no business text; Realtime/DebugView receipt observed.

If Cloud TLS/proxy prevents browser JS, keep these PENDING/unchecked, never FAIL
or LIVE. Do not bypass trust/proxy, guess policy hosts or mutate backend bindings.

## E. Handoff and rollback

- [x] Update README/AGENTS/product/result/analytics/hosting/IT handoff for independent search and no reset UX; frozen visual assets/startup remain.
- [x] Preserve authoritative handoff fixed parameters; add Web evidence without changing backend truth.
- [x] Document exact prior initialPlaybook resource and frontend-only restore/redeploy procedure in FAQ_FLOW_ROLLBACK_2026-10-09.md.
- [ ] Assess whether launch-critical frontend failure requires rollback; only restore Web, no Rental/Agent/Production changes.
- [ ] Update PROJECT_STATE/checklist/deployment/handoff with final actual test/deploy/live/rollback evidence.
- [ ] Commit/push final report, confirm remote main and clean working tree, STOP for Web ChatGPT review.

## Completion summary

Implementation/offline PASS. Deployment/live/rollback disposition to be recorded
from actual evidence; no current claim of LIVE or formal IT-ready release.
