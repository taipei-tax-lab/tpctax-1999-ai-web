# NEXT_TASK

## Active task

**Renderer parity fix + trusted-browser live validation**

The GitHub Pages production artifact is deployed and reachable in the human
owner's normal Chrome browser. This task fixes two observed presentation defects
without reopening CX Playbook/Tool configuration.

## Human live evidence — 2026-10-08

From the owner-provided Chrome screenshot at:

`https://taipei-tax-lab.github.io/tpctax-1999-ai-web/`

the following are now human-verified:

- [x] GitHub Pages production page loads in a normal trusted browser.
- [x] Live Messenger initializes sufficiently to send a real Production query.
- [x] Query button is usable.
- [x] A real 1999 FAQ query returns a non-empty answer.
- [x] The deployed page is using the live candidate rather than the disabled
      `服務準備中` state.
- [x] Presentation defect observed: Markdown bold syntax such as
      `**一、適用條件：**` is displayed literally.
- [x] Presentation defect observed: Markdown link syntax is not rendered as
      linked label text; the URL is exposed and then duplicated again in the
      general source list.

Still not human-verified:

- [ ] Same-session follow-up.
- [ ] Real session reset.
- [ ] New query after reset.
- [ ] 390px trusted-browser live layout.
- [ ] Trusted-browser console/network check for blocking JS/CSP/CORS errors.

## A. Preserve backend and routing

- [x] Do not modify Router, Rental Playbook, 1999 FAQ Playbook, Tools, Data
      Stores, Production versions, Environment mappings, Messenger binding, or
      allowed domains.
- [x] Confirm the fix is frontend-renderer-only unless later Rental live evidence
      proves a backend change is necessary.

Evidence (execution start): synchronized `origin/main` at
`88b14f6` (exact SHA recorded in completion).
Read repository instructions and requested project/deployment documents.
Only result normalization/rendering and focused tests/docs/packages are in scope;
HTML/CSS, config, SDK/transport/session and all CX resources stay unchanged.

## B. Safe Markdown subset for the custom 1999 renderer

Current cause: `assets/result-model.js` renders response text via DOM text nodes
and only auto-links bare HTTP(S) URLs. It intentionally does not interpret
Markdown.

Implement a minimal safe renderer for the two formats actually observed and
required:

- [x] `**text**` → semantic `<strong>`.
- [x] `[label](https://...)` → semantic `<a>` whose visible text is `label`;
      do not display the destination URL beside it.
- [x] Preserve line breaks and all ordinary answer wording.
- [x] Preserve safe bare HTTP(S) URL auto-linking for non-Markdown URLs.
- [x] Reject unsafe/non-HTTP(S) Markdown destinations using the existing
      `safeUrl()` rules.
- [x] Do not use response `innerHTML`, raw HTML parsing, `eval`, or a broad
      Markdown library that introduces unnecessary executable/HTML behavior.
- [x] Any response HTML such as `<script>` must remain inert visible text.
- [x] Keep current UI/frozen styling except minimal CSS if required for rendered
      `strong` / inline link consistency.

Do not implement images, tables, arbitrary HTML, or full Markdown unless a
separate requirement appears.

## C. Inline-link / source de-duplication

Desired citizen-facing result:

`來源與詳細資訊請參考：地價稅按自用住宅用地優惠稅率課稅有哪些條件？如何申請？`

where the question/title itself is the clickable link and the raw URL is hidden.

- [x] Extract/recognize safe URLs already represented by Markdown links in the
      answer.
- [x] Do not add those same URLs again as ordinary `sources[]` solely because
      they appear inside the answer text.
- [x] More generally, an HTTP(S) URL already rendered inline in the answer must
      not be duplicated in the lower ordinary `參考資料` list.
- [x] Preserve explicit structured citations that are genuinely additional and
      are not already represented inline.
- [x] Preserve optional `faqMetadata` behavior unless a direct duplicate is
      demonstrated.
- [x] Verify the screenshot scenario ends with the inline linked title and no
      duplicate lower `tpctax.gov.taipei` source item.

Evidence: one shared minimal parser produces DOM text/strong/anchor nodes and
canonical inline URL inventory. Unsafe/incomplete Markdown and unsupported
images remain literal; no response HTML parsing/dependency/CSS change.
Normalization and rendering both remove ordinary inline-source duplicates;
additional structured citations and explicit FAQ metadata are preserved.
Screenshot scenario reconstruction is synthetic and PASS at desktop/390/320px;
this does not claim a new live response or tax-quality result.

## D. Tests

Add/update focused tests for:

- [x] bold rendering;
- [x] Markdown link label rendering with hidden destination text;
- [x] line-break preservation;
- [x] safe bare URL linkification;
- [x] duplicate inline/source suppression;
- [x] additional structured source remains visible when not duplicated;
- [x] `javascript:`, `data:`, credential-bearing and malformed links rejected;
- [x] raw HTML/script remains inert text;
- [x] no regression in generic answer / FAQ metadata rendering;
- [x] reset/session/currentPlaybook behavior unchanged.

Run:

- [x] Node tests PASS.
- [x] Offline Chromium PASS.
- [x] production package integrity/manifest/repeat-build PASS.
- [x] credential/secret scan PASS.

Evidence: Node **14 PASS**, offline Chromium **17 grouped PASS**; browser
checks use real normalizer/renderer with labeled synthetic fixtures, zero
external/Production requests or page errors. Existing generic/FAQ, reset,
expiry, timeout and one-shot currentPlaybook tests PASS. Screenshots and report:
`/workspace/work/renderer-parity/browser/`. Config/HTML/CSS/app/transport/demo
bytes are unchanged. Production/demo double builds byte-identical; 11-file CRC/manifest/source
parity/credential scan PASS. Candidate ZIP 212,951 bytes, SHA-256
`4abde0ae04a749b1e8ca8a6a7136d7f3f1adb80d6ea6d8ece05be672ba018d2a`.

## E. GitHub Pages deployment

- [x] Regenerate live production `packages/hosting.zip` + checksum.
- [ ] Commit/push to `main`.
- [ ] GitHub Actions production-only Pages deployment PASS.
- [ ] Record deployed commit/run/ZIP SHA-256.
- [ ] Confirm hosted runtime files match the package.

Do not add the official 1999-site entry yet.

## F. Rental cross-surface parity

Architecture rule:

The same 1999 FAQ Playbook answer may also be surfaced from the Rental
experience. The Rental experience uses official Dialogflow Messenger rendering,
while this 1999 page uses a custom result renderer.

Google's official Dialogflow Messenger fulfillment documentation states that
text responses support Markdown including `**Bold**` and
`[Link text](Link URL)`:
`https://docs.cloud.google.com/dialogflow/cx/docs/concept/integration/dialogflow-messenger/fulfillment`

Therefore:

- [x] Confirm by read-only project evidence that Rental still uses the official
      Conversational Messenger / Production integration.
- [x] Do not change the shared 1999 FAQ Playbook merely to compensate for the
      custom 1999 frontend.
- [ ] After the 1999 frontend fix is deployed, run/obtain one Rental live
      verification where a question is answered through the 1999 FAQ Playbook.
- [ ] Verify Rental shows bold text as bold, not literal `**`.
- [ ] Verify Rental shows the linked title as clickable text, not
      `[title](URL)`.
- [ ] Verify there is no equivalent duplicate raw-URL/source presentation.
- [ ] If Rental native Messenger already renders correctly, record parity PASS
      and make no backend mutation.
- [ ] If Rental does not render correctly, capture exact screenshot/network/
      response evidence and STOP for Web ChatGPT review before any backend
      mutation.

Evidence (read-only): Rental main `e3d786a3f4eb32ba1165644ac2008888b314f936`
`site/messenger.html` and `assets/js/messenger-ui.js` embed native official
SDK/chat-bubble and one-shot Rental Playbook on the same Production agent.
Actual released Rental Pages HTML GET 200 matches that integration. Backend
main `2f8205c78d62c3e7196f2e818a0edce10dae820b` STATE/7F closeout record
Conversational Messenger Production cutover, exact accepted v2 Playbooks,
6/6 Production smoke and Rental→FAQ return. This is retained-integration
evidence, not newly observed live rendering or a fresh Console readback.
Sources and limitations: `docs/RENDERER_PARITY.md`. Live attempt follows deployment.

## G. Trusted-browser completion

After the revised Pages deployment, complete in a normal trusted browser:

- [ ] 1999 page: bold headings render correctly.
- [ ] 1999 page: linked title is clickable and raw destination URL is hidden.
- [ ] 1999 page: duplicate lower source entry is absent.
- [ ] Same-session follow-up returns a non-empty answer.
- [ ] `清除前次問答，重新提問` performs a real reset.
- [ ] Post-reset new query returns a non-empty answer.
- [ ] 390px live layout has no regression.
- [ ] No blocking browser console JS/CSP/CORS error.
- [ ] Rental cross-surface parity verification completed.

Codex Cloud certificate/proxy limitations are not grounds to label the hosted
site failed. Leave human-only checks unchecked when the environment cannot
perform them.

## H. Documentation / completion

- [x] Update `docs/RESULT_CONTRACT.md` to describe the safe Markdown subset and
      inline-source de-duplication rule.
- [x] Update `PROJECT_STATE.md`.
- [ ] Update `docs/DEPLOYMENT_GATES.md` only if deployment/live evidence changes
      a gate decision.
- [x] Update `docs/IT_HANDOFF.md` if the new live package hash changes.
- [ ] Update this checklist with evidence and completion summary.
- [ ] Commit/push and STOP for Web ChatGPT review.

## Completion summary

At task end record:

1. deployed Pages URL/run/SHA;
2. live production ZIP SHA-256;
3. renderer tests PASS/FAIL;
4. screenshot scenario PASS/FAIL;
5. remaining trusted-browser checks;
6. Rental parity PASS/FAIL/BLOCKED;
7. ready for Revenue Service IT: YES/NO.
