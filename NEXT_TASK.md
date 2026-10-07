# NEXT_TASK

## Active task

**STOP — Web ChatGPT review of the final placement-only refinement**

The accepted UI now has the required query-area order:

1. `您想了解什麼？`
2. textarea
3. `您可詢問 「房屋稅自住住家用稅率怎麼申請？」 「地價稅自用住宅用地優惠稅率怎麼申請？」`
4. yellow `查詢解答`

Only the existing example paragraph was moved in both HTML pages. No copy,
application CSS or JavaScript changed. Wait for human review before further work.

## Review artifacts

Evidence root outside Git:
`/workspace/visual-review/placement-2026-10-07/`.

- `desktop-ready.png`, `mobile-390-ready.png`, `mobile-320-ready.png`:
  clearly labeled offline demo, ready state.
- `desktop-review.png`, `mobile-390-review.png`, `mobile-320-review.png`:
  synthetic result with existing reset action.
- `desktop-unavailable.png`, `mobile-390-unavailable.png`,
  `mobile-320-unavailable.png`: actual disabled hosting configuration.
- `mobile-320-text-200-demo.png`, `mobile-320-text-200-index.png`:
  200% text-size captures.
- `node-tests.txt`, `browser/browser_validation.json`, `visual_validation.json`.

Artifacts use the existing workspace evidence convention; nothing was uploaded.

## Completed verification

- Node: 10 passed, zero failures/skips.
- Offline Chromium: 12 grouped checks passed, zero external requests,
  page errors and Production requests. Updated the superseded above-form
  assertion to check visual/DOM textarea → examples → submit placement.
- Both pages at 1280px/390px/320px: required placement, both examples' fill/focus
  without submission, yellow submit styling, no overflow and focused keyboard/
  accessibility checks passed. Both pages at 320px with 200% text size passed.
- Original wording, placeholder/reset action, all application JS/CSS, official
  images and `liveEnabled=false` remain unchanged.

## Functional freeze

Do not change without a new explicit human instruction:

- Messenger transport or one-shot `currentPlaybook`;
- session/reset/expiry/timeout semantics;
- normalized model or answer/source/FAQ renderer;
- ready/unavailable/loading/empty/error/session behavior;
- CX/GCP/Messenger integration or Production Environment;
- `assets/config.js` `liveEnabled=false`.

No Production query or deployment is authorized. Offline fixtures and the
intercepted SDK stub do not establish Production behavior or tax-answer quality.
