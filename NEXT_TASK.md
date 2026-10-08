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

- [ ] Change the upper-left Revenue Service brand/logo link to:
      `https://tpctax.gov.taipei/`
- [ ] Same-tab normal navigation.
- [ ] Preserve current logo image, header layout and accessibility.
- [ ] Apply equivalent brand-link behavior to `demo.html` if it shares the same
      header markup.
- [ ] Do not change the existing `返回本府1999常見問答` link.

## B. Minimal GA4 design

Goal: measure **visits that actually ask at least one question**, without
collecting the question/answer content.

Use direct GA4 gtag integration; do not add GTM in this task.

### Analytics contract

- [ ] Add a configurable GA4 Measurement ID in frontend config.
- [ ] Never invent a Measurement ID.
- [ ] If no human-supplied `G-XXXXXXXXXX` value exists, analytics must remain
      safely disabled while implementation/tests can still complete.
- [ ] Load GA4 only when a valid-looking configured Measurement ID is present.
- [ ] Keep implementation in local external JS/module code; do not add inline
      executable script merely for GA4.
- [ ] Default GA4 page_view may be enabled so page visits can be compared with
      actual question-start visits.
- [ ] Send exactly one custom business event:
      `ai_question_start`
- [ ] Fire it only when the first valid user question in that browser page/tab
      session is actually accepted for sending to Messenger.
- [ ] Do not fire again for follow-up questions in the same tab session.
- [ ] Use `sessionStorage` or an equivalent minimal browser-session guard to
      prevent follow-up inflation.
- [ ] Do not fire on example-button click alone.
- [ ] Do not fire on empty/invalid form submission.
- [ ] Do not fire merely when the page opens.
- [ ] Do not fire on reset itself.
- [ ] After reset, keep the same analytics page/tab-session guard; reset must
      not create a second `ai_question_start` event.
- [ ] If GA4 fails to load, query/Messenger behavior must continue normally.

### Privacy / data-minimization

The custom event must NOT send:

- [ ] question text;
- [ ] answer text;
- [ ] FAQ/source title or URL;
- [ ] tax category inferred from the question;
- [ ] Playbook name/ID beyond anything GA4 already sees from the page itself;
- [ ] any user-entered identifiers or contact information.

Only the event name and ordinary GA4 page/session context are needed.

## C. Implementation shape

Preferred architecture:

- [ ] Add a small local analytics module, e.g. `assets/analytics.js`.
- [ ] It conditionally bootstraps official GA4 gtag.js from
      `https://www.googletagmanager.com/gtag/js?id=<MEASUREMENT_ID>`.
- [ ] Keep GA4 failure isolated from the main query path.
- [ ] Integrate one call at the first accepted Messenger query boundary.
- [ ] No analytics dependency inside result rendering.
- [ ] No analytics dependency inside CX transport/session reset logic.

## D. Tests

Add focused tests for:

- [ ] analytics disabled when Measurement ID missing;
- [ ] invalid ID does not load/send;
- [ ] valid ID requests the official gtag.js script;
- [ ] first accepted question emits exactly one `ai_question_start`;
- [ ] follow-up emits no second event;
- [ ] reset + new question emits no second event in same tab session;
- [ ] example click alone emits no event;
- [ ] invalid/empty submit emits no event;
- [ ] GA4 load/send failure does not block Messenger/query behavior;
- [ ] no user question/answer/source content is included in event payload;
- [ ] brand/logo link points to `https://tpctax.gov.taipei/`.

Then run:

- [ ] Node tests PASS.
- [ ] Offline Chromium PASS.
- [ ] package integrity/manifest/repeat-build PASS.
- [ ] secret/credential scan PASS.

## E. Deployment / measurement-ID gate

- [ ] Regenerate production package after code changes.
- [ ] If GA4 Measurement ID has NOT been supplied:
      keep GA4 disabled, deploy only if human explicitly authorizes a no-GA4
      interim build, and clearly record analytics as pending.
- [ ] If GA4 Measurement ID HAS been supplied:
      configure it, deploy to GitHub Pages, and verify actual GA4 script/network
      requests in a normal browser where possible.
- [ ] Record actual observed analytics external hosts for later IT CSP handoff;
      do not guess broad wildcard CSP rules.
- [ ] Update `docs/IT_HANDOFF.md` only with evidence-backed GA4 resource hosts.

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

- [ ] Create/update `docs/ANALYTICS.md` with the minimal contract above.
- [ ] Update `PROJECT_STATE.md`.
- [ ] Update `docs/IT_HANDOFF.md` if deployment/CSP facts change.
- [ ] Update this checklist with evidence.
- [ ] Commit/push and STOP for Web ChatGPT review.

## Required human input

Before GA4 can be live-enabled, obtain the actual GA4 Web Data Stream
Measurement ID in the form:

`G-XXXXXXXXXX`

Do not substitute a GTM Container ID and do not invent one.

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
