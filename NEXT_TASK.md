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

- [ ] Remove the sessionStorage / in-memory once-per-tab de-duplication behavior.
- [ ] Emit one GA4 event for every accepted user query.
- [ ] Follow-up query = +1 event.
- [ ] Reset itself = no event.
- [ ] Post-reset valid query = +1 event.
- [ ] Example-button click alone = no event.
- [ ] Empty/invalid submission = no event.
- [ ] Unsolicited/cancelled Messenger request = no event.
- [ ] Analytics failure must never block Messenger query behavior.
- [ ] Never send question text, answer text, source, inferred tax topic, IDs,
      contact information or other user content.

### Event naming

Prefer renaming the custom event to:

`ai_query_submit`

because the metric is now **total submitted/accepted queries**, not one
question-start visit.

If renaming would create an unnecessary compatibility issue, document the reason
and keep the existing name, but the event semantics must still be per-query.
Do not emit both names.

### Reporting definition

- `page_view` = page views.
- custom query event count = **查詢次數**.
- Do not describe this event count as unique people or「發問人次」.
- GA4 Users/Sessions filtered by the query event may later be used separately if
  user/session counts are needed.

## B. Focused analytics tests

Add/update tests for:

- [ ] first accepted query emits exactly one event;
- [ ] second same-session follow-up emits another event;
- [ ] third query after reset emits another event;
- [ ] reset itself emits none;
- [ ] example click alone emits none;
- [ ] invalid/empty submit emits none;
- [ ] cancelled/unsolicited request emits none;
- [ ] event payload contains no user-entered/query/answer/source data;
- [ ] analytics load/send failure never blocks query flow.

## C. Low-risk page-load performance audit

Goal: improve initial load without large architectural or visual changes.

First measure/inspect the current production page and local package. Record a
small baseline where practical:

- [ ] HTML/CSS/JS/image asset sizes.
- [ ] external critical requests on startup.
- [ ] module dependency/loading order.
- [ ] whether GA4 competes with Messenger/first-render resources.
- [ ] obvious render-blocking or unnecessarily eager work.
- [ ] approximate browser timing/LCP/DOMContentLoaded/resource waterfall if the
      execution environment permits reliable measurement.

Do not claim performance gains without before/after evidence where measurable.

## D. Authorized low-risk optimization scope

Apply only evidence-backed, small changes. Candidates include:

- [ ] Defer non-critical GA4 network loading until after the core page/UI has
      initialized or browser idle time, while keeping the gtag queue available
      so early query events are not lost.
- [ ] Ensure GA4 loading cannot delay Messenger readiness.
- [ ] Add narrowly useful `preconnect` / `dns-prefetch` only for origins that
      are definitely used during normal startup and where evidence supports it.
- [ ] Consider `modulepreload` only if it measurably improves the small module
      graph; do not add speculative preload noise.
- [ ] Preserve `type="module"` deferred behavior.
- [ ] Review above-the-fold official image loading/decoding priority; apply only
      safe HTML hints such as explicit dimensions / decoding / fetch priority if
      appropriate.
- [ ] Avoid loading demo/test/development assets in production.
- [ ] Keep official image source bytes unchanged unless there is a separately
      justified lossless derivative strategy; do not replace or degrade agency
      branding assets casually.
- [ ] Do not introduce a framework, bundler, service worker, CDN migration,
      client-side router, inline critical CSS rewrite, or major DOM/CSS refactor.
- [ ] Do not delay Messenger SDK until first submit if that makes the first query
      materially slower or changes current UX.

The target is a modest startup improvement with minimal code risk.

## E. Performance regression checks

Verify after changes:

- [ ] UI renders identically.
- [ ] Messenger initializes normally.
- [ ] Query button readiness is not slower in the measured environment.
- [ ] GA4 still initializes eventually.
- [ ] First/second/post-reset queries each emit one query event.
- [ ] No new JS errors.
- [ ] No new blocking CSP/CORS issue.
- [ ] Desktop and existing offline 390/320 checks remain PASS.
- [ ] Production package remains arbitrary-subpath safe.

## F. Tests / package / deployment

Run:

- [ ] Node tests PASS.
- [ ] Offline Chromium PASS.
- [ ] package integrity / manifest PASS.
- [ ] deterministic repeat build PASS.
- [ ] credential/secret scan PASS.
- [ ] regenerate `packages/hosting.zip` + checksum.
- [ ] deploy via existing GitHub Actions production-only Pages workflow.
- [ ] record deployed SHA/run/ZIP SHA-256.
- [ ] confirm hosted runtime files match production package.

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

## H. Documentation / handoff

- [ ] Update `docs/ANALYTICS.md` from once-per-tab semantics to per-query semantics.
- [ ] Record the chosen event name and exact reporting definition.
- [ ] Add a concise performance note/document with baseline, changes and measured
      before/after evidence (or explicitly state which measurements were unavailable).
- [ ] Update `PROJECT_STATE.md`.
- [ ] Update `docs/IT_HANDOFF.md` only if external resource/CSP requirements change.
- [ ] Update this checklist with evidence.
- [ ] Commit/push and STOP for Web ChatGPT review.

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
