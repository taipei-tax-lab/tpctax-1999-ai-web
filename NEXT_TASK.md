# NEXT_TASK

## Active task

**Final Web ChatGPT visual acceptance of V1.2 with the official TRS logo**

Do not deploy live. Do not redesign the accepted V1.2 baseline.

## Completed work

The unchanged official TRS standalone color GIF is stored locally as
`assets/trs-logo.gif` and used in both `index.html` and `demo.html`, next to
visible `臺北市稅捐稽徵處` text. Original source, dimensions, SHA-256 and
selection rationale are recorded in `docs/VISUAL_REFERENCE.md`.

Only logo sizing/alignment/responsive CSS was added. Accepted palette,
typography, form treatment, density and answer/source/FAQ presentation remain
unchanged. Both deterministic static packages include the original logo bytes.

10 Node tests, 9 existing offline Chromium checks and 6 focused logo checks
passed. Desktop, 390px and 320px screenshots are recorded in `PROJECT_STATE.md`.

## Required next decision

1. Web ChatGPT should inspect the desktop, 390px and 320px logo-complete
   screenshots and provide final visual acceptance or identify a concrete
   logo-size/alignment issue.
2. Apply only separately requested focused corrections; do not start another
   general palette, typography or layout revision.
3. After visual acceptance, prepare a separate deployment-readiness task:
   actual hosting URL/owner, HTTPS/MIME/cache requirements, official CMS link
   handoff, and separately authorized Messenger/domain/Production-binding/CSP
   checks. No live action is authorized by this document.

Current implementation work is complete: commit/push and STOP for review.

## Functional freeze

Preserve Messenger transport, one-shot `currentPlaybook`, session/reset/expiry/
timeout, request locking, normalized result model and answer/source/FAQ logic.
Keep `assets/config.js` with `liveEnabled=false`.

No Production questions, deployment, CX/GCP/Messenger integration,
Production Environment or official-site changes are authorized. Offline
fixtures do not establish live SDK/Production behavior.
