# NEXT_TASK

## Active task

**STOP — Web ChatGPT review of high-fidelity official-site visual reproduction**

The requested implementation and offline verification are complete. Do not start
another visual revision or deploy live without a new human instruction.

## Review target

Judge whether the AI page appears to be a service page within the current
Taipei City Revenue Service website when entered from the official 1999 FAQ.
The previous V1.2 interpreted styling is superseded by the current measured
HTML/CSS reference treatment.

Official references:

- `https://tpctax.gov.taipei/News.aspx?n=BB8B93F0A49EAB80&sms=87415A8B9CE81B16`
- `https://tpctax.gov.taipei/cp.aspx?n=97DA1F76BC737417`

Exact CSS alignment, image URLs/dimensions/SHA-256, accessibility exceptions and
reference-inspection method are in `docs/VISUAL_REFERENCE.md`.

## Review artifacts

Local evidence root:
`/workspace/visual-review/fidelity-2026-10-07/`.

1. `desktop-idle.png`: hosting page, actual disabled configuration.
2. `desktop-review.png`: desktop generic answer and sources in the offline demo.
3. `mobile-390-review.png`: 390px result layout.
4. `mobile-320-review.png`: 320px result layout.
5. `desktop-faq-review.png`: optional official FAQ enhancement.
6. `reference/official-1280.png`, `official-390.png`, `official-320.png`: source
   comparison captures with third-party/API requests blocked.
7. `packages/demo.zip`: extract and serve via a local HTTP server, then open
   `demo.html` for offline interactive review.
8. `packages/hosting.zip`: deterministic static hosting artifact for review,
   not authorization to upload/deploy it.

Both packages include the original `assets/trs-header.png` and
`assets/official-page-bg.png`, plus the retained `assets/trs-logo.gif`.
The demo controls and synthetic answers are labeled non-production.

## Completed checks

- Node: 10 passed.
- Existing offline Chromium: nine checks passed, zero external requests,
  page errors and Production requests.
- Both HTML pages at 1280px/390px/320px: proportional local official logo,
  native visual values/hover, keyboard skip link, 44px actions, canonical return
  link and no horizontal overflow. 320px at 200% text size passed.
- Focused contrast checks passed; deterministic repeated ZIP builds, integrity,
  manifest checks and official image inclusion passed.
- Frozen functional files unchanged; `liveEnabled=false`.

## Functional freeze

Do not change without separate authorization:

- Dialogflow Messenger transport;
- one-shot `currentPlaybook`;
- session/reset/expiry/timeout behavior;
- normalized result model;
- answer/source/FAQ extraction/rendering;
- CX/GCP/Messenger integration settings;
- Production Environment;
- `assets/config.js` `liveEnabled=false`.

No Production questions or deployment are authorized. Wait for Web ChatGPT
visual review and the next explicit human instruction.
