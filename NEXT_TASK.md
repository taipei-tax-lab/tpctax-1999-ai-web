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

- [ ] User types a valid query and submits it.
- [ ] Do **not** clear the textarea merely on form submit.
- [ ] Clear the textarea only after the existing accepted
      `df-request-sent` boundary confirms Messenger accepted that pending query.
- [ ] Reset the character counter to `0 / 1000` at the same time.
- [ ] Preserve the submitted query in local state so the result heading
      (`#result-query`) can still display the exact submitted question when
      the answer returns.
- [ ] Follow-up queries behave the same way: each accepted send clears the input.
- [ ] Post-reset queries behave the same way.
- [ ] Clicking an example still only fills/focuses the textarea; it does not clear
      or submit by itself.
- [ ] Invalid/empty/rejected-before-acceptance submissions keep the user's text.
- [ ] If Messenger/send fails before acceptance, keep the user's text so they can
      retry.
- [ ] If a request is accepted but the later answer fails/returns empty, the input
      may remain cleared because the query was already successfully sent.
- [ ] Do not auto-focus the textarea while a request is in-flight if doing so
      changes current UX unexpectedly; preserve current focus/result behavior
      unless a focused test shows a simple safe improvement.
- [ ] Reset button behavior remains unchanged: it still clears query/session state
      as a separate explicit action.

## B. Keep GA4 behavior aligned

The input-clear action should use the same accepted-query boundary already used
by analytics.

Verify:

- [ ] Every accepted query still emits exactly one `ai_query_submit`.
- [ ] Clearing the textarea does not emit any extra GA4 event.
- [ ] First/follow-up/post-reset query counts remain 1/2/3.
- [ ] Reset itself emits none.
- [ ] No query text is added to analytics.

## C. Implementation constraints

Prefer the smallest change in `assets/app.js`.

- [ ] Do not move the existing accepted-query definition to a weaker
      click/form-submit boundary.
- [ ] Do not change MessengerTransport/session logic unless strictly necessary.
- [ ] Do not change result renderer or Markdown behavior.
- [ ] Do not change the frozen visual design/CSS unless required for a bug fix.
- [ ] Do not undo GA4 idle deferral or other accepted performance behavior.
- [ ] Do not introduce a new dependency.

## D. Tests

Add/update focused tests for:

- [ ] accepted first query clears textarea and resets counter;
- [ ] submitted question still appears in result header after answer;
- [ ] same-session follow-up clears textarea again;
- [ ] post-reset accepted query clears textarea;
- [ ] empty/invalid submit keeps current behavior and does not falsely clear;
- [ ] send failure before accepted boundary preserves typed query;
- [ ] accepted query followed by answer error/empty state does not restore the
      cleared query automatically;
- [ ] example click fills but does not clear/submit;
- [ ] GA4 per-query counts remain correct;
- [ ] reset/session/currentPlaybook semantics unchanged.

Run:

- [ ] Node tests PASS.
- [ ] Offline Chromium PASS.
- [ ] desktop/390/320 regression checks PASS.
- [ ] package integrity/manifest/repeat-build PASS.
- [ ] credential/secret scan PASS.

## E. Deployment

- [ ] Regenerate `packages/hosting.zip` + checksum.
- [ ] Deploy via existing GitHub Actions production-only Pages workflow.
- [ ] Record deployed SHA/run/ZIP SHA-256.
- [ ] Confirm hosted runtime files match production package.

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

## G. Documentation / handoff

- [ ] Update `PROJECT_STATE.md`.
- [ ] Update this checklist with evidence.
- [ ] Update `docs/ANALYTICS.md` only if the accepted-query analytics contract
      changes; otherwise leave it unchanged.
- [ ] Update performance/handoff docs only if resource/loading behavior changes.
- [ ] Commit/push and STOP for Web ChatGPT review.

## Completion summary

Record:

1. exact clear-input implementation point;
2. first/follow-up/post-reset clear behavior PASS/FAIL;
3. failed-before-acceptance preservation PASS/FAIL;
4. GA4 per-query regression result;
5. Node/Chromium/package result;
6. Pages deployed SHA/run/ZIP SHA-256;
7. live browser verification PASS/PENDING;
8. ready for Revenue Service IT: YES/NO.
