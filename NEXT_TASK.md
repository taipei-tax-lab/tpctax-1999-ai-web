# NEXT_TASK

## Active task

**Per-query GA4 counting + low-risk page-load performance optimization**

Do not modify CX backend resources, Messenger binding/domains, Playbooks, Tools,
Data Stores, Router, Production mappings, renderer contract, session semantics,
or the frozen visual design.

## Confirmed baseline

- [x] UI frozen.
- [x] Production Messenger live.
- [x] Renderer / Rental parity / follow-up / reset / post-reset PASS.
- [x] Official brand link points to `https://tpctax.gov.taipei/`.
- [x] GA4 Measurement ID: `G-S891SFSMBH`.
- [x] Direct GA4 integration exists in `assets/analytics.js`.
- [x] Current custom event is `ai_question_start`, currently deduplicated once
      per tab/sessionStorage session.

## A. Change analytics meaning to per-query counting

Human decision supersedes the previous once-per-tab rule.

New requirement:

> Every valid user query that is actually accepted/sent to Messenger counts once.

Implement:

- [x] Remove the sessionStorage / in-memory once-per-tab de-duplication behavior.
- [x] Emit one GA4 event for every accepted user query.
- [x] Follow-up query = +1 event.
- [x] Reset itself = no event.
- [x] Post-reset valid query = +1 event.
- [x] Example-button click alone = no event.
- [x] Empty/invalid submission = no event.
- [x] Unsolicited/cancelled Messenger request = no event.
- [x] Analytics failure must never block Messenger query behavior.
- [x] Never send question text, answer text, source, inferred tax topic, IDs,
      contact information or other user content.

### Event naming

Prefer renaming the custom event to:

`ai_query_submit`

because the metric is now **total submitted/accepted queries**, not one
question-start visit.

If renaming would create an unnecessary compatibility issue, document the reason
and keep the existing name, but the event semantics must still be per-query.
Do not emit both names.

Chosen name: **`ai_query_submit`**; no compatibility consumer found in this static
frontend. `ai_question_start` is no longer emitted. App uses the same accepted
non-cancelled pending Messenger boundary; a WeakSet guards only duplicate SDK
notifications for that one pending request, not later queries or tab/session.
Analytics no longer accesses sessionStorage. Each event has zero custom params.

### Reporting definition

- `page_view` = page views.
- custom query event count = **查詢次數**.
- Do not describe this event count as unique people or「發問人次」.
- GA4 Users/Sessions filtered by the query event may later be used separately if
  user/session counts are needed.

## B. Focused analytics tests

Add/update tests for:

- [x] first accepted query emits exactly one event;
- [x] second same-session follow-up emits another event;
- [x] third query after reset emits another event;
- [x] reset itself emits none;
- [x] example click alone emits none;
- [x] invalid/empty submit emits none;
- [x] cancelled/unsolicited request emits none;
- [x] event payload contains no user-entered/query/answer/source data;
- [x] analytics load/send failure never blocks query flow.

Evidence: Node 14 existing + 7 analytics tests PASS; offline Chromium 22 grouped
checks PASS, 0 forwarded external/Production requests, no page errors. First,
follow-up and post-reset events are exactly 1/2/3 calls with only event name;
duplicate SDK notification, example/invalid/unsolicited/cancelled sends do not
inflate count. All three queries can queue before idle gtag loading is released.
Storage-denied, blocked loader, throwing event sender and scheduler fallback
fixtures preserve query behavior. SDK/gtag fixtures do not establish live receipt.

## C. Low-risk page-load performance audit

Goal: improve initial load without large architectural or visual changes.

First measure/inspect the current production page and local package. Record a
small baseline where practical:

- [x] HTML/CSS/JS/image asset sizes.
- [x] external critical requests on startup.
- [x] module dependency/loading order.
- [x] whether GA4 competes with Messenger/first-render resources.
- [x] obvious render-blocking or unnecessarily eager work.
- [x] approximate browser timing/LCP/DOMContentLoaded/resource waterfall if the
      execution environment permits reliable measurement.

Do not claim performance gains without before/after evidence where measurable.

Evidence: synchronized main `198bab784fd34dc94982ece217fd5e7fbc336341`; required
AGENTS/read-order documents and analytics/hosting/workflow contracts read.
Verified production GETs of HTML/five modules/CSS/two active images all 200,
match prior ZIP. Complete payload byte table, graph/startup requests and waterfall
are in `docs/PERFORMANCE.md`. Local controlled cold-start timing measured;
real Pages/SDK/GA timing remains unavailable under Cloud proxy trust/access.

## D. Authorized low-risk optimization scope

Apply only evidence-backed, small changes. Candidates include:

- [x] Defer non-critical GA4 network loading until after the core page/UI has
      initialized or browser idle time, while keeping the gtag queue available
      so early query events are not lost.
- [x] Ensure GA4 loading cannot delay Messenger readiness.
- [x] Evaluate `preconnect` / `dns-prefetch` for confirmed startup origins;
      none added because the local fixtures cannot establish a TLS setup benefit.
- [x] Consider `modulepreload` only if it measurably improves the small module
      graph; do not add speculative preload noise.
- [x] Preserve `type="module"` deferred behavior.
- [x] Review above-the-fold official image loading/decoding priority; apply only
      safe HTML hints such as explicit dimensions / decoding / fetch priority if
      appropriate.
- [x] Avoid loading demo/test/development assets in production.
- [x] Keep official image source bytes unchanged unless there is a separately
      justified lossless derivative strategy; do not replace or degrade agency
      branding assets casually.
- [x] Do not introduce a framework, bundler, service worker, CDN migration,
      client-side router, inline critical CSS rewrite, or major DOM/CSS refactor.
- [x] Do not delay Messenger SDK until first submit if that makes the first query
      materially slower or changes current UX.

The target is a modest startup improvement with minimal code risk.

Applied only analytics/app changes: immediate queue; core-ready/unavailable
finally schedules official gtag at idle (1500ms timeout, timer fallback).
SDK starts immediately and never awaits GA4. No HTML/CSS/image/config/renderer/
transport/backend change; existing image dimensions retained. Four-modulepreload
experiment improved ready but delayed first paint 364→424ms, so none shipped.
No new host, speculative preload/preconnect or infrastructure dependency.

## E. Performance regression checks

Verify after changes:

- [x] UI renders identically.
- [x] Messenger initializes normally (offline SDK fixture; prior human live PASS carried forward).
- [x] Query button readiness is not slower in the measured environment.
- [x] GA4 loader is scheduled eventually (offline fixture, including unavailable core; live receipt remains G/PENDING).
- [x] First/second/post-reset queries each emit one query event.
- [x] No new JS errors (offline).
- [x] No new blocking CSP issue in scoped local fixture; no new origin/CORS
      requirement introduced (actual Google CORS remains G/PENDING).
- [x] Desktop and existing offline 390/320 checks remain PASS.
- [x] Production package remains arbitrary-subpath safe.

Evidence: seven serial rotated samples per baseline/applied/preload variant,
fresh 1280×900 context, cache disabled, local assets at 80ms / 200,000 bytes/s,
locally fulfilled external scripts and fixed 200ms SDK-ready fixture. Baseline→
applied median ready 727.6→721.9ms; DCL 518.6→513.2ms; FCP 364→356ms; local LCP
548→540ms. Ranges overlap; these small timing shifts are noise, not a material
speed/field-LCP claim. Verified startup ordering: GA request before query ready
**7/7→0/7**; local JS requests remain 5. Runtime JS +418 bytes, no size reduction
claimed. Baseline/applied screenshots have **0 changed pixels** at 1280/390/320px.
Reproducible measurement tool and exact conditions in `docs/PERFORMANCE.md`.

Freshly extracted production ZIP: shallow/deep/percent-encoded Traditional
Chinese-space paths, directory and explicit index.html entries, 1280/390/320px:
6 entry cases / 18 viewport cases PASS. SDK ready, queries 1/2/3, first-turn/
follow-up/reset routing, eventual single GA loader, five module requests,
unchanged brand/FAQ paths, no overflow/page errors/demo/test/dev requests.
Google scripts were local fixtures; 0 real GA/Production requests.

## F. Tests / package / deployment

Run:

- [x] Node tests PASS.
- [x] Offline Chromium PASS.
- [x] package integrity / manifest PASS.
- [x] deterministic repeat build PASS.
- [x] credential/secret scan PASS.
- [x] regenerate `packages/hosting.zip` + checksum.
- [x] deploy via existing GitHub Actions production-only Pages workflow.
- [x] record deployed SHA/run/ZIP SHA-256.
- [x] confirm hosted runtime files match production package.

Evidence: Node 21 PASS; offline Chromium 22 grouped PASS with synthetic scripts,
no page errors/external/Production requests. New package is exactly 12 files;
CRC/manifest byte/hash/source parity/live config/no-demo verification PASS.
Independent hosting/demo builds are byte-identical; both archives and changed
text credential-pattern scan PASS (0 matches). Production ZIP **215,196 bytes**,
SHA-256 `768190825d260b95d18af44e15ffdabfaa95557b245cf57ad5d18fe34520acc6`;
committed checksum verifies. Demo ZIP 230,859 bytes, SHA-256
`2a0983c4296606e497248dddae3b6316eb41838dc897470b1fa1e6aaaa3a9cf2`.
No packaging/workflow allowlist change required; IT_HANDOFF bytes unchanged.

Deployment: [Actions run 37743130011](https://github.com/taipei-tax-lab/tpctax-1999-ai-web/actions/runs/37743130011)
PASS, deployed SHA `49ade8ed9904b8f5f379fe5e1d61ff40ba4e6fca`, success
2026-10-08 **15:23:50 Asia/Taipei**, github-pages artifact `11534411703`.
URL <https://taipei-tax-lab.github.io/tpctax-1999-ai-web/>. Source guard confirms
`build_type=workflow`; configure-pages, Node 14+7, deterministic rebuild/committed
ZIP/checksum/manifest/source/credential and production-only build/deploy PASS.
Post-deployment HTTPS GETs at 15:24:38: **12/12 files HTTP 200 and byte-identical**
to ZIP; correct runtime MIME. Six demo/test/tool/repo-internal probes return 404.
Online app/analytics contain only the new event wiring; ID/header unchanged.

## G. GA4 live verification

Where a trusted browser is available:

- [ ] page load emits/queues normal GA4 page measurement;
- [ ] first valid query emits one custom query event;
- [ ] follow-up emits a second;
- [ ] post-reset query emits a third;
- [ ] reset alone emits none;
- [ ] event payload does not contain question text;
- [ ] no GA4 failure blocks AI query.

If Codex Cloud cannot access GA4 or cannot trust the browser proxy certificate,
leave these human-only items unchecked and clearly mark them PENDING rather than
FAIL.

**All seven live items PENDING, not FAIL.** Fresh official gtag HTTPS probe
at 2026-10-08 15:24:14 Asia/Taipei gets Cloud proxy CONNECT HTTP 403 (curl 56),
before origin. Actual deployed Pages Chromium 151 at 15:24:38, 390×844,
inherited proxy/TLS verification enabled, no mocked network, stops at document
GET with `net::ERR_CERT_AUTHORITY_INVALID`. Zero browser origin responses;
page JS/SDK/gtag never execute, **0 Production queries / 0 observed GA4 collection
requests**. No page_view/custom-event delivery, follow-up/reset GA count or real
Google CSP/CORS can be claimed from this run. Ordinary HTTPS file parity and
offline queue fixtures do not substitute for these checks. Current environment
policy excludes gtag host; no TLS/proxy bypass, policy broadening or backend
mutation. Existing human renderer/Rental/session PASS is carried forward.
Trusted-browser 1/2/3/no-reset/no-content/failure checks remain unchecked.

## H. Documentation / handoff

- [x] Update `docs/ANALYTICS.md` from once-per-tab semantics to per-query semantics.
- [x] Record the chosen event name and exact reporting definition.
- [x] Add a concise performance note/document with baseline, changes and measured
      before/after evidence (or explicitly state which measurements were unavailable).
- [x] Update `PROJECT_STATE.md`.
- [x] Audit `docs/IT_HANDOFF.md`: external resource/CSP requirements unchanged,
      so file remains byte-identical as required; old count description historical.
- [x] Update this checklist with evidence.
- [x] Commit/push and STOP for Web ChatGPT review.

Implementation/package commit `49ade8ed9904b8f5f379fe5e1d61ff40ba4e6fca` pushed
to main and deployed. Final reporting-only commit updates checklist/state and
analytics/performance/deployment docs; no ZIP payload or runtime change and no
second deployment. STOP after push for Web ChatGPT review.

## Completion summary

Record:

1. final GA4 custom event name;
2. per-query counting tests PASS/FAIL;
3. exact performance changes made;
4. before/after evidence;
5. Node/Chromium/package results;
6. Pages deployed SHA/run/ZIP SHA-256;
7. GA4 live verification PASS/PENDING;
8. ready for Revenue Service IT: YES/NO.

### Result — 2026-10-08 (Asia/Taipei)

| Item | Result |
| --- | --- |
| Final custom event | `ai_query_submit` only; event count = 查詢次數, not unique people/發問人次 |
| Per-query behavior | PASS — first/follow-up/post-reset = 1/2/3; reset/example/invalid/cancelled/unsolicited = 0; no custom content parameters |
| Performance change | Immediate queue; official GA loader after core settles, then idle/1500ms or timer fallback. SDK remains eager; no visual/modulepreload/host/image change |
| Verified before/after | GA request before ready 7/7→0/7; median ready 727.6→721.9ms within noise, no material speed claim; 0 screenshot pixel changes at 1280/390/320px |
| Tests/package | PASS — Node 21, Chromium 22 grouped, 18 extracted-subpath viewport cases; exact 12-file manifest/source/credential and repeat builds |
| Pages | PASS — deployed `49ade8ed9904b8f5f379fe5e1d61ff40ba4e6fca`, run `37743130011`, ZIP `768190825d260b95d18af44e15ffdabfaa95557b245cf57ad5d18fe34520acc6`, 12/12 hosted parity |
| GA4 live | PENDING — all G items unchecked; Cloud CONNECT 403 / Chromium proxy CA trust, no observed collection hosts/receipt |
| Revenue Service IT ready | NO — formal GA4-verified release pending trusted-browser evidence; agency final-path headers still need readback |

Required docs and durable evidence updated; IT resource handoff unchanged because
no resource/CSP requirement changes. Human core acceptance remains PASS. Final
docs commit/push then **STOP**, waiting for Web ChatGPT review.
