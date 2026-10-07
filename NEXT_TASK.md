# NEXT_TASK

## Active task

**Complete official TRS logo integration on the accepted V1.2 visual baseline**

Do not deploy live. Do not redesign the page.

## Human decision

Web review accepts the current V1.2 reference-driven palette, typography, form styling, spacing direction and result presentation.

This task is intentionally narrow:

> add the correct official TRS logo/agency identity, verify layout, then return for final visual review.

Do not perform another general styling pass.

## Required work

1. Sync latest `main`.
2. Read:
   - `AGENTS.md`
   - `README.md`
   - `PROJECT_STATE.md`
   - `NEXT_TASK.md`
   - `docs/PRODUCT_PLAN.md`
   - `docs/RESULT_CONTRACT.md`
   - `docs/VISUAL_REFERENCE.md`
3. Retrieve the official Taipei City Revenue Service / TRS logo from the agency-controlled source already documented in `docs/VISUAL_REFERENCE.md`.
4. Select the most suitable official asset for a compact web header.
5. Save the original asset bytes unchanged under `assets/`.
6. Record in `docs/VISUAL_REFERENCE.md`:
   - exact source URL;
   - local filename;
   - image dimensions;
   - SHA-256;
   - short rationale for the chosen asset.
7. Update `index.html` and `demo.html` so the header uses:
   - official TRS logo;
   - visible `臺北市稅捐稽徵處` text or equivalent meaningful accessible identification;
   - existing return link to `本府1999常見問答`.
8. Make only the minimum CSS adjustments needed for logo sizing/alignment/responsive behavior.
9. Do not redraw, recolor, distort, stylize, trace or replace the logo with another Taipei City Government identity.
10. Do not add remote runtime dependencies for the logo.
11. Keep the accepted V1.2 styling baseline unchanged unless a concrete logo-layout issue requires a local adjustment.
12. Run:
   - existing Node tests;
   - existing offline Chromium suite;
   - focused responsive checks at desktop, 390px and 320px.
13. Regenerate:
   - desktop screenshot;
   - 390px screenshot;
   - 320px screenshot;
   - deterministic hosting/demo packages.
14. Confirm the local logo asset is included in both packages.
15. Update `PROJECT_STATE.md` and `NEXT_TASK.md`.
16. Commit/push and STOP for Web ChatGPT review.

## If the asset is still inaccessible

Do not invent or substitute a logo.

Report the exact blocked URL / error and STOP. The user can then provide the official asset manually.

## Functional freeze

Do not change:

- Dialogflow Messenger transport;
- one-shot `currentPlaybook`;
- session/reset/expiry/timeout behavior;
- normalized result model;
- answer/source/FAQ extraction/rendering;
- CX/GCP/Messenger integration settings;
- Production Environment;
- `assets/config.js` `liveEnabled=false`.

No Production questions, deployment, official-site modification or backend work are authorized.
