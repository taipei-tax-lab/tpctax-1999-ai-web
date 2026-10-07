# NEXT_TASK

## Active task

**V1.2 Web ChatGPT review and official TRS asset completion**

Do not deploy live. Functional V1 remains frozen.

## Completed work

V1.2 now uses the retrieved official FAQ/page-search CSS as its visual reference:
white/neutral surfaces, Arial / 微軟正黑體 direction, a normal unit heading,
a small official-style gold submit button, dark underlined official-site links,
secondary example/reset controls and simple form/content separators.

10 Node tests, 9 existing offline Chromium checks and 5 focused visual browser
checks passed. Desktop, 390px and 320px screenshots and deterministic packages
are available. See `PROJECT_STATE.md` and `docs/VISUAL_REFERENCE.md` for evidence,
source values, adaptations and exact artifact paths.

## Remaining required asset work

The official logo-download page was read successfully, but its actual TRS image
files are on `www-ws.gov.taipei`, which the cloud proxy blocked with `CONNECT 403`.
The network draft adds that hostname while retaining `tpctax.gov.taipei`.
The plain agency-name text in the header is a documented temporary placeholder;
no official TRS asset has been added to Git or the static packages yet.

1. Have Web ChatGPT review the three current screenshots and offline demo.
2. Save the `www-ws.gov.taipei` network addition in environment settings (or
   provide the unchanged official asset securely as a file), then retry the
   exact asset URLs recorded in `docs/VISUAL_REFERENCE.md`.
3. Inspect and select the official TRS logo/wordmark. Save the original bytes
   locally under `assets/`, record the exact source, dimensions and SHA-256,
   and use the logo plus meaningful agency identification in both HTML pages.
   Do not redraw, recolor or substitute Taipei City Government identity.
4. Add the asset to both hosting/demo packages. Recheck proportions, accessible
   image/link names, local-only image loading and layout at desktop/390px/320px.
5. Rerun affected offline tests, regenerate screenshots and deterministic
   packages, update state, commit/push and STOP for Web ChatGPT review.

## Functional freeze

Preserve Messenger transport, one-shot `currentPlaybook`, session/reset/expiry,
request locking/timeout, normalized result model and answer/source/FAQ logic.
Keep `assets/config.js` with `liveEnabled=false`.

No Production questions, live deployment, CX/GCP/Messenger integration,
Production Environment or official-site modifications are authorized.
Do not claim complete official TRS branding while the asset prerequisite remains.
