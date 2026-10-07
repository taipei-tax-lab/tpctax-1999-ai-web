# NEXT_TASK

## Active task

**STOP — Web ChatGPT review of the final UI-freeze candidate**

Implementation and offline verification are complete. The high-fidelity official
visual foundation is preserved. Wait for human review before declaring the UI
frozen or starting another revision. Do not deploy Production.

## Review target

Confirm the final citizen interaction:

1. Title intro removed, with no replacement copy.
2. Above-form sentence uses red `您可詢問`, followed by plain clickable text:
   `「房屋稅自住住家用稅率怎麼申請？」`
   `「地價稅自用住宅用地優惠稅率怎麼申請？」`.
   Examples fill/focus the textarea without submitting; mobile wraps naturally.
3. Placeholder: `例如：房屋稅自住住家用稅率如何申請？`.
4. Ready state has no idle panel or reset row before a successful answer.
5. After success, the exact secondary action is `清除前次問答，重新提問`.
   It performs the existing real new-session reset/re-arm, clears the input and
   counter, focuses the textarea, and hides result/reset until another success.
6. Loading, unavailable/live-disabled, empty/error and session feedback remain.
7. Gray H1 text with 4px red marker; red example emphasis and 2px query top rule.
   Official header/logo/background, font stack/content width, yellow query
   button, result/source structure and red link hover/footer separator remain.

The new transparent example text uses official `#d4222d` for hover to preserve
4.95:1 contrast on the light gray search surface; normal content-link hover
remains `#de313c`.

## Review artifacts

Evidence root outside Git:
`/workspace/visual-review/ui-freeze-2026-10-07/`.

- `desktop-ready.png`, `mobile-390-ready.png`, `mobile-320-ready.png`:
  clearly labeled offline demo showing ready UI.
- `desktop-review.png`, `mobile-390-review.png`, `mobile-320-review.png`:
  synthetic result and reset control.
- `desktop-unavailable.png`, `mobile-390-unavailable.png`,
  `mobile-320-unavailable.png`: actual hosting configuration (`liveEnabled=false`).
- `mobile-320-text-200-demo.png`, `mobile-320-text-200-index.png`:
  200% text-size captures.
- `node-tests.txt`, `browser/browser_validation.json`, `visual_validation.json`.

The projectless output directory is not writable in the attached environment;
artifacts use the existing workspace evidence convention. Nothing was uploaded.

## Completed verification

- Node: 10 passed, zero failures/skips.
- Expanded offline Chromium suite: 12 grouped checks passed, zero external
  requests, page errors and Production requests. Focused assertions cover
  ready/idle visibility, examples above form, exact text/input fill/focus,
  reset hidden before success (including empty/error), exact reset copy,
  loading/unavailable/error handling, new session/re-arm and SDK reset options.
- Both pages at 1280px/390px/320px: preserved official visual values, no overflow,
  keyboard navigation/focus, accessible names, 44px targets and resizable input.
  Both pages at 320px with 200% text size also passed; focused contrast passed.
- Application JavaScript changes are limited to UI visibility/gating. Transport,
  Playbook/session semantics, model/renderer, config, official assets, demo
  fixtures and Node tests remain unchanged.

## Functional freeze

Do not change without a new explicit human instruction:

- Dialogflow Messenger transport;
- one-shot `currentPlaybook`;
- session/reset/expiry/timeout semantics;
- normalized result model;
- answer/source/FAQ extraction/rendering;
- CX/GCP/Messenger integration;
- Production Environment;
- `assets/config.js` `liveEnabled=false`.

No Production query or deployment is authorized. Offline fixtures and the
intercepted SDK stub do not establish Production behavior or tax-answer quality.
