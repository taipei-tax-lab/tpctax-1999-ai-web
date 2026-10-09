## Post-live follow-up（2026-10-09）

Status: **LIVE / USABLE**

- [x] Backend Production FAQ Flow v1 ready and mapped.
- [x] Web currentPage cutover deployed.
- [x] Per-query independent semantic search implemented.
- [x] currentPlaybook removed from 1999 runtime.
- [x] Visible reset conversation UI removed.
- [x] Multi-result complete text rendering and official links implemented.
- [x] Pages deployment/package integrity/offline regression PASS.
- [x] No Rental/Agent/backend regression requiring rollback.
- [ ] Non-blocking: confirm real GA4 `ai_query_submit` receipt later in a normal trusted browser using Realtime/DebugView; do not send query/answer/source text.
- [ ] Future quality work: improve official FAQ corpus from real search misses (for example citizen-facing entertainment-tax amendment wording) rather than adding runtime aliases by default.
- [ ] Future cross-service work: Rental↔1999 stays guided-link-only when revised; no internal handoff orchestration.

---

# NEXT_TASK — 1999 FAQ direct Flow web cutover

Date: 2026-10-09 (Asia/Taipei)
Status: **DEPLOYED / HUMAN LIVE ACCEPTANCE PENDING**

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
- [x] Push source/package commit to main; existing production-only Actions source/build/deploy PASS.
- [x] Record source/deployed SHA, run, artifact, package bytes/SHA and Pages URL.
- [x] Hosted 12-file byte parity/MIME and six demo/test/tool/internal exclusions.

Source and deployed commit: `6b79ba571b5d0b2d66b1494d59f0ef157b813362`.
[Actions run 37875482165](https://github.com/taipei-tax-lab/tpctax-1999-ai-web/actions/runs/37875482165)
**PASS**, success 2026-10-09 **10:38:14 Asia/Taipei** (02:38:14 UTC),
github-pages artifact `11592311095`. Pages:
<https://taipei-tax-lab.github.io/tpctax-1999-ai-web/>.
ZIP SHA-256 `4f322561e9cff0e36f3ec4d44d5c7bef36088fed0902b16694e06a8de29b63e1`.
Actions source guard (`build_type=workflow`), configure/build/deploy, Node 28,
deterministic rebuild/committed ZIP/checksum/manifest/source/credential/fresh
production extraction PASS. HTTPS parity completed **10:39:26 Asia/Taipei**:
12/12 files 200, exact package bytes and correct MIME; no reset HTML, exact Flow
config/GA4 ID verified. Six excluded demo/test/tool/internal URLs return 404.

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

Fresh real deployed Chromium151 at **2026-10-09 10:39:19 Asia/Taipei**, 390×844,
inherited Cloud proxy, TLS verification enabled and no mocked network, stops on
Pages document GET with `net::ERR_CERT_AUTHORITY_INVALID`. No origin browser
responses or page JS/SDK/GA4 execution: **0 Production queries / 0 observed GA4
collection requests**. Official gtag HEAD at **10:39:17** gets Cloud CONNECT403
(curl56) before origin. This is existing Cloud trust/access limitation, not
frontend/SDK/binding/CSP/CORS failure. No certificate/proxy bypass or policy change.
All seven browser-only checks stay PENDING/unchecked; GA Realtime/DebugView receipt
unobserved. Backend Production proof and offline fixtures do not establish Web LIVE.

Trusted browser can reuse backend Q15/Q16/Q17: `印花稅有哪些課徵範圍？` →
`使用牌照稅什麼時候開徵？` → `我想詢問火星獨角獸光量子傳送門的維修密碼。`.
Backend accepted suite observed 5/5/0 for these, not a Web receipt guarantee. Verify
same exact currentPage/no currentPlaybook on all three, original complete queries,
new text replacing previous, genuine fallback/Rental URL, accepted clear/no reset,
mobile/console/network and real GA4 counts1/2/3 with no business payload.

## E. Handoff and rollback

- [x] Update README/AGENTS/product/result/analytics/hosting/IT handoff for independent search and no reset UX; frozen visual assets/startup remain.
- [x] Preserve authoritative handoff fixed parameters; add Web evidence without changing backend truth.
- [x] Document exact prior initialPlaybook resource and frontend-only restore/redeploy procedure in FAQ_FLOW_ROLLBACK_2026-10-09.md.
- [x] Assess whether launch-critical frontend failure requires rollback; only restore Web, no Rental/Agent/Production changes.
- [x] Update PROJECT_STATE/checklist/deployment/handoff with final actual test/deploy/live/rollback evidence.
- [x] Commit/push final report, confirm remote main and clean working tree, STOP for Web ChatGPT review.

Rollback assessment: **AVAILABLE / NOT EXECUTED**. No launch-critical frontend
issue observed in executable checks; Cloud browser limitation alone is not a
rollback trigger. Frozen prior Web baseline 410db6c / deployed edd5012 and exact old
Playbook resource retained in rollback doc; no Rental/Agent/backend rollback.

## Completion summary

- Status: **DEPLOYED / HUMAN LIVE ACCEPTANCE PENDING**; do not yet claim target
  `1999 FAQ SURFACE-DIRECTED FLOW SEARCH LIVE / USABLE` or formal IT-ready.
- Every accepted query + SDK defaults use exact FAQ START_PAGE/currentPage and
  Asia/Taipei; no initialPlaybook runtime or sent currentPlaybook. Fixed binding
  and GA4 untouched; no CX/Rental mutation.
- Reset UI/handler/state/CSS/a11y/unused armed/clear removed; independent latest
  search, complete ordered raw text, safe URLs/Rental link, accepted input clear.
- Node **28 PASS**, Chromium **26 grouped PASS**, 1280/390/320, deterministic
  two builds/exact 12 manifest/source/CRC/checksum/credential checks **PASS**.
- Source/deployed **6b79ba571b5d0b2d66b1494d59f0ef157b813362**;
  [run 37875482165](https://github.com/taipei-tax-lab/tpctax-1999-ai-web/actions/runs/37875482165),
  package SHA **4f322561e9cff0e36f3ec4d44d5c7bef36088fed0902b16694e06a8de29b63e1**,
  12/12 hosted bytes match, six exclusions 404.
- GA4 local exactly-once/privacy **PASS**; actual Messenger/browser GA4 receipt
  **PENDING** under exact TLS/proxy blockers above; seven unchecked items remain.
- Rollback **AVAILABLE / NOT EXECUTED**; no demonstrated launch-critical trigger.
- Final report-only commit updates NEXT_TASK/PROJECT_STATE/backend handoff/
  PAGES_DEPLOYMENT and preserves production ZIP bytes/deployed SHA. Main HEAD
  differs from deployed implementation; final push then **STOP for Web review**.

Scratch reports/screenshots are outside Git under `/workspace/work/faq-flow/`;
durable evidence is here and in [PAGES_DEPLOYMENT](docs/PAGES_DEPLOYMENT.md).
