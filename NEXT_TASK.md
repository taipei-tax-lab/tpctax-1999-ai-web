# NEXT_TASK

## Active task

**Visual revision: align the standalone 1999 AI page with the existing Taipei City Revenue Service website**

Do not deploy live yet.

## Human decision

The functional V1 architecture is accepted. This task is a **visual-only revision**.

Reference page:

`https://tpctax.gov.taipei/News.aspx?n=BB8B93F0A49EAB80&sms=87415A8B9CE81B16`

Target feeling: the AI page should look like an extension of the official site rather than a separate AI product or microsite.

## Required work

1. Read `AGENTS.md`, `README.md`, `PROJECT_STATE.md`, this file, `docs/PRODUCT_PLAN.md` and `docs/RESULT_CONTRACT.md` before editing.
2. Inspect the current `index.html` and `assets/styles.css`.
3. Make one conservative visual revision that:
   - keeps the page simple;
   - replaces the invented green/modern product palette with colors and neutral surfaces closer to the official Revenue Service site;
   - uses the official Revenue Service logo/brand treatment at upper left if an approved local asset can be obtained; do not keep the invented green `1999` badge as the primary brand mark;
   - uses a Traditional Chinese system font stack close to the official website;
   - reduces oversized hero typography and excessive marketing-style whitespace;
   - uses restrained heading/body/control sizes and ordinary government-site link/button styling;
   - reduces rounded corners, shadows and pill-heavy styling;
   - keeps the query box and result area clear, readable and obviously interactive;
   - preserves the canonical return link to the official 1999 FAQ page.
4. Do **not** rebuild the whole official-site header/navigation/footer. Reuse only enough branding and visual language to create continuity.
5. Do **not** change:
   - Messenger transport;
   - one-shot `currentPlaybook` behavior;
   - session/reset/expiry behavior;
   - normalized result model;
   - answer/source/FAQ rendering logic;
   - backend/CX resources;
   - `assets/config.js` `liveEnabled=false`.
6. If adding an official logo asset, keep it local in the repository/hosting package where practical and record its source. Do not add secrets or external runtime dependencies merely for branding.
7. Keep responsive and accessibility behavior intact.
8. Run the existing focused offline tests after the visual changes.
9. Produce a screenshot/demo artifact sufficient for Web ChatGPT human review.
10. Update `PROJECT_STATE.md` and `NEXT_TASK.md`, commit/push, then STOP for review. Do not deploy.

## Acceptance focus

This is not a pixel-perfect clone. The review question is:

> If a citizen enters from the official 1999 FAQ page, does the AI page immediately feel like part of the same Taipei City Revenue Service website?

Functionality should remain unchanged from the verified V1 baseline.
