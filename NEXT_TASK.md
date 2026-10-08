# NEXT_TASK

## Active task

**Final small frontend polish + minimal GA4 instrumentation**

Do not modify CX backend resources, Messenger binding/domains, Playbooks, Tools,
Data Stores, Router, Production mappings, session semantics, renderer contract,
or frozen visual layout beyond the two approved changes below.

## Human acceptance carried forward — 2026-10-08

Trusted normal-Chrome checks already completed:

- [x] 1999 live query works.
- [x] Renderer Markdown/link/source de-duplication PASS.
- [x] Rental cross-surface native Messenger parity PASS.
- [x] Same-session follow-up works.
- [x] `清除前次問答，重新提問` performs a real reset.
- [x] Post-reset new query works.

Deferred, not blockers for this task:

- [ ] 390px trusted-browser live layout check.
- [ ] Trusted-browser Console/network blocking JS/CSP/CORS check.

## A. Agency logo/home link

Current `index.html` brand link points to `./index.html`.

Approved change:

- [x] Change the upper-left Revenue Service brand/logo link to:
      `https://tpctax.gov.taipei/`
- [x] Same-tab normal navigation.
- [x] Preserve current logo image, header layout and accessibility.
- [x] Apply equivalent brand-link behavior to `demo.html` if it shares the same
      header markup.
- [x] Do not change the existing `返回本府1999常見問答` link.

## B. Minimal GA4 design

Goal: measure **visits that actually ask at least one question**, without
collecting the question/answer content.

Use direct GA4 gtag integration; do not add GTM in this task.

### Analytics contract

- [x] Add a configurable GA4 Measurement ID in frontend config.
- [x] Never invent a Measurement ID.
- [x] If no human-supplied `G-XXXXXXXXXX` value exists, analytics must remain
      safely disabled while implementation/tests can still complete.
- [x] Load GA4 only when a valid-looking configured Measurement ID is present.
- [x] Keep implementation in local external JS/module code; do not add inline
      executable script merely for GA4.
- [x] Default GA4 page_view may be enabled so page visits can be compared with
      actual question-start visits.
- [x] Send exactly one custom business event:
      `ai_question_start`
- [x] Fire it only when the first valid user question in that browser page/tab
      session is actually accepted for sending to Messenger.
- [x] Do not fire again for follow-up questions in the same tab session.
- [x] Use `sessionStorage` or an equivalent minimal browser-session guard to
      prevent follow-up inflation.
- [x] Do not fire on example-button click alone.
- [x] Do not fire on empty/invalid form submission.
- [x] Do not fire merely when the page opens.
- [x] Do not fire on reset itself.
- [x] After reset, keep the same analytics page/tab-session guard; reset must
      not create a second `ai_question_start` event.
- [x] If GA4 fails to load, query/Messenger behavior must continue normally.

### Privacy / data-minimization

The custom event must NOT send:

- [x] question text;
- [x] answer text;
- [x] FAQ/source title or URL;
- [x] tax category inferred from the question;
- [x] Playbook name/ID beyond anything GA4 already sees from the page itself;
- [x] any user-entered identifiers or contact information.

Only the event name and ordinary GA4 page/session context are needed.

## C. Implementation shape

Preferred architecture:

- [x] Add a small local analytics module, e.g. `assets/analytics.js`.
- [x] It conditionally bootstraps official GA4 gtag.js from
      `https://www.googletagmanager.com/gtag/js?id=<MEASUREMENT_ID>`.
- [x] Keep GA4 failure isolated from the main query path.
- [x] Integrate one call at the first accepted Messenger query boundary.
- [x] No analytics dependency inside result rendering.
- [x] No analytics dependency inside CX transport/session reset logic.

Evidence (implementation): synchronized main at
`9ca632ef53cd85b43116b157dab51f90ad30be82`; instructions/project/checklist and
hosting/package contracts read. Both brand links now use the unchanged official
logo/header and same-tab `https://tpctax.gov.taipei/`; FAQ back-link unchanged.
`ga4MeasurementId` is exactly the supplied `G-S891SFSMBH`.
Local analytics module uses official async gtag and sessionStorage keyed to this
page/Measurement ID. App calls its no-argument question marker only after the
existing transport accepts a df-request-sent event; rejected/unsolicited events
are excluded. Transport/renderer/reset code unchanged. Demo disables analytics.
Custom event has no parameters; page URL query/hash and referrer are excluded
from configured page context. Analytics failures are caught independently.

## D. Tests

Add focused tests for:

- [x] analytics disabled when Measurement ID missing;
- [x] invalid ID does not load/send;
- [x] valid ID requests the official gtag.js script;
- [x] first accepted question emits exactly one `ai_question_start`;
- [x] follow-up emits no second event;
- [x] reset + new question emits no second event in same tab session;
- [x] example click alone emits no event;
- [x] invalid/empty submit emits no event;
- [x] GA4 load/send failure does not block Messenger/query behavior;
- [x] no user question/answer/source content is included in event payload;
- [x] brand/logo link points to `https://tpctax.gov.taipei/`.

Then run:

- [x] Node tests PASS.
- [x] Offline Chromium PASS.
- [x] package integrity/manifest/repeat-build PASS.
- [x] secret/credential scan PASS.

Evidence: `npm test` runs 14 existing + 5 focused analytics tests, all PASS.
Offline Chromium against the checkout on local port 8772: 19 grouped checks
PASS; no page errors and 0 forwarded external/Production requests. Both official
brand links, unchanged FAQ return link, accepted request boundary, follow-ups,
real SDK-reset fixture, refresh persistence, example/invalid/unsolicited exclusion,
loader abort and event-send exception verified. gtag/SDK were intercepted local
fixtures; no real GA delivery is claimed. Custom event is exactly
`['event', 'ai_question_start']`, no parameters. Storage-denied fallback guards
the current document only; refresh persistence in that case is not guaranteed.

Package evidence: two independent hosting/demo builds are byte-identical.
`tools/verify_hosting.py` verifies exact 12-file production allowlist, CRC,
manifest bytes/hashes, every packaged source byte, liveEnabled=true, excluded
demo entry and credential patterns, then extracts into a fresh directory: PASS.
Hosting ZIP 215,048 bytes, SHA-256
`526239f69199a5b94370a04a034dc9b477e4eeae58b4c3f4e62a80fc458ee086`.
Demo ZIP 230,710 bytes, SHA-256
`aef4351cdec49da1e971497b5f029c62d15ff70a1283ec92f38d8c3f6668ad86`.
Both archives and changed runtime/test text credential-pattern scan PASS.

## E. Deployment / measurement-ID gate

- [x] Regenerate production package after code changes.
- [x] GA4 Measurement ID has been supplied by the human owner.
- [x] Configure exactly `G-S891SFSMBH`.
- [x] Deploy to GitHub Pages and record run/deployed SHA/URL.
- [ ] Verify actual GA4 script/collection network requests in a normal browser.
- [x] Record the observed bootstrap probe and distinguish unobserved analytics
      collection/subresource hosts; do not guess wildcard CSP rules.
- [x] Update `docs/IT_HANDOFF.md` only with evidence-backed GA4 resource facts.

Network evidence: official gtag URL probe at 2026-10-08 12:54:12 Asia/Taipei
was rejected by the Cloud proxy with CONNECT HTTP 403 (curl 56), before origin.
Known required bootstrap script origin: `https://www.googletagmanager.com`.
No real gtag code/subresources/collection destinations observed. This Cloud
restriction is not a demonstrated Pages/GA4/CSP/CORS failure. Live GA4 remains
PENDING; no guessed collect host or broad CSP expansion is proposed.

Deployment evidence: [Actions run 37730302359](https://github.com/taipei-tax-lab/tpctax-1999-ai-web/actions/runs/37730302359)
completed successfully. Source guard confirms Pages `build_type=workflow`;
configure-pages, Node 14+5 tests, deterministic rebuild/committed ZIP comparison,
checksum/12-file verification and production-only build/deploy all PASS.
Deployed SHA `9cd6aabad0862b34127211e98550e9b987aefcc7`; github-pages artifact
`11529761004`; deployment success 2026-10-08 13:01:49 Asia/Taipei.
URL: <https://taipei-tax-lab.github.io/tpctax-1999-ai-web/>.
Post-deployment verified HTTPS GETs at 13:02:25 Asia/Taipei: all 12 files HTTP 200,
byte-identical to hosting.zip, correct HTML/JS/CSS/image/JSON MIME. Online brand
href and approved GA4 config/module match. Six demo/test/tool/repo-internal probes
return 404; repository root is not published.

Live blocker: real Chromium 151 at the deployed URL, 390×844, inherited Cloud
proxy, TLS verification enabled, no mocked network, stops at document GET with
`net::ERR_CERT_AUTHORITY_INVALID` at 13:02:19 Asia/Taipei. Zero origin browser
responses, no page JS/SDK/gtag execution, **0 Production queries / 0 observed GA4
collection requests**. Existing carried-forward human renderer/Rental/session
PASS remains valid; this run does not revalidate it. Browser file retrieval
failure plus separate gtag CONNECT 403 prevent actual GA4 network/receipt PASS.
No TLS bypass, proxy bypass, CX mutation or broader CSP/domain change performed.

## F. GA4 reporting definition

Document the intended reporting meaning:

- `page_view` = page visits.
- `ai_question_start` = one page/tab session that actually asked at least one
  valid question.
- Event count of `ai_question_start` is the simplest operational
  「發問人次」 measure for this implementation.
- GA4 user/session metrics filtered to this event may later be used for unique
  users or sessions if desired.

No additional custom events are authorized in this task.

## G. Documentation / handoff

- [x] Create/update `docs/ANALYTICS.md` with the minimal contract above.
- [x] Update `PROJECT_STATE.md`.
- [x] Update `docs/IT_HANDOFF.md` if deployment/CSP facts change.
- [x] Update this checklist with evidence.
- [x] Commit/push and STOP for Web ChatGPT review.

Implementation/package commit `9cd6aabad0862b34127211e98550e9b987aefcc7` pushed
to main and deployed. Final reporting-only commit updates this checklist,
PROJECT_STATE, ANALYTICS and PAGES_DEPLOYMENT; it does not modify a ZIP payload
or trigger another artifact deployment. STOP after push for Web ChatGPT review.

## Required human input

GA4 Web Data Stream Measurement ID supplied by the human owner:

`G-S891SFSMBH`

This is the approved GA4 Measurement ID for this task.

- [x] Human-supplied GA4 Measurement ID received.
- [x] Configure the frontend with exactly `G-S891SFSMBH`.
- [x] Do not substitute a GTM Container ID.
- [x] Do not invent or derive any other analytics identifier.

## Completion summary

Record:

1. brand-link PASS/FAIL;
2. analytics implementation PASS/FAIL;
3. configured Measurement ID present: YES/NO (do not record secrets; GA4 ID is
   non-secret but record only if human supplied it);
4. `ai_question_start` once-per-tab-session tests PASS/FAIL;
5. package/tests PASS/FAIL;
6. Pages deployment status;
7. GA4 live network verification PASS/PENDING;
8. ready for Revenue Service IT: YES/NO.

### Result — 2026-10-08 (Asia/Taipei)

| Item | Result |
| --- | --- |
| Brand/logo link | PASS — both headers use same-tab official homepage; logo/layout/FAQ return unchanged |
| Minimal GA4 implementation | PASS — direct official gtag, no GTM, only no-parameter `ai_question_start` |
| Human-supplied Measurement ID configured | YES — `G-S891SFSMBH`, also verified in hosted config |
| Once-per-tab-session tests | PASS — first accepted query only; follow-up/reset/post-reset/refresh guarded; failures isolated |
| Tests/package | PASS — Node 19, offline Chromium 19 groups, deterministic builds/12-file integrity/manifest/source/credential scan |
| Pages deployment | PASS — run `37730302359`, deployed `9cd6aabad0862b34127211e98550e9b987aefcc7`, hosted 12/12 byte parity, exclusions 404 |
| GA4 live network/receipt | PENDING — unchecked; Cloud gtag CONNECT 403 and Chromium proxy CA trust failure, not demonstrated GA4/site failure |
| Ready for Revenue Service IT | NO — formal GA4-verified release pending trusted-browser loader/collect evidence; authorized Pages deployment complete |

The two deferred trusted-browser layout/console items remain unchecked and are
not blockers for this task. Do not reopen completed human renderer/Rental/session
acceptance or change the CX backend. Final docs/push then STOP for Web review.
