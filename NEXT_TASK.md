# NEXT_TASK

## Active task

**STOP — Web ChatGPT review of restrained official red accents**

The accepted high-fidelity layout now includes the requested two small red
markers. Implementation and offline verification are complete. Wait for a new
human instruction before further visual work or deployment.

## Review target

Confirm the new accents remain restrained on desktop, 390px and 320px:

1. `1999 AI 智慧問答`: gray text with a 3px × .9em `#d4222d` left marker.
2. `您想了解什麼？`: unchanged text with a smaller 2px × .75em `#de313c` marker.
3. Existing `#d4222d` result heading, `#de313c` link hover/footer separator,
   official TRS logo/background, fonts/sizes/content width and yellow
   `#ffc800` / `#cca000` submit button remain unchanged.

Only five CSS lines were added; HTML, JavaScript and original assets are unchanged.

## Review artifacts

Evidence root outside Git:
`/workspace/visual-review/red-accents-2026-10-07/`.

- `desktop-review.png`, `mobile-390-review.png`, `mobile-320-review.png`:
  offline demo with synthetic multi-source answer.
- `desktop-idle.png`, `mobile-390-idle.png`, `mobile-320-idle.png`:
  actual hosting configuration with live service disabled.
- `mobile-320-idle-text-200.png`, `mobile-320-review-text-200.png`:
  200% text-size captures.
- `node-tests.txt`, `browser/browser_validation.json`, `visual_validation.json`.

The attached environment could not create the designated projectless output
directory; screenshots use the existing workspace evidence convention.

## Completed verification

- Node: 10 passed, zero failures/skips.
- Existing offline Chromium: nine checks passed, zero external requests,
  page errors and Production requests; SDK check uses an intercepted local stub.
- Both pages at 1280px/390px/320px: baseline geometry and sampled existing styles
  unchanged, markers correctly sized, no horizontal overflow, keyboard skip
  link/focus, accessible names, result focus, 44px actions and textarea resizing
  passed. Both pages at 320px with 200% text size also passed.
- Three result screenshots visually inspected; query marker remains less
  prominent than the H1 marker. Frozen files/assets remain byte-for-byte unchanged.

## Functional freeze

Do not change without a new explicit human instruction:

- Dialogflow Messenger transport;
- one-shot `currentPlaybook`;
- session/reset/expiry/timeout behavior;
- normalized result model;
- answer/source/FAQ extraction/rendering;
- CX/GCP/Messenger integration settings;
- Production Environment;
- `assets/config.js` `liveEnabled=false`.

No Production question or deployment is authorized. Offline passing results
do not establish live SDK behavior, Production routing or tax-answer quality.
