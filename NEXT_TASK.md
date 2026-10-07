# NEXT_TASK

## Active task

**High-fidelity visual reproduction of the official Taipei City Revenue Service 1999 page language**

Do not deploy live. Functional V1 remains frozen.

## Human decision

The target has changed from "visually consistent" to:

> Make the standalone 1999 AI page look as close as practical to the current official Taipei City Revenue Service website.

This includes the official upper-left logo/agency identity, background treatment, title color, typography, borders, links, form surfaces and primary button styling.

The page may remain functionally simpler than the official site, but shared visual elements should look native to the source site.

## Authoritative references

Primary:
- Official 1999 FAQ page:
  `https://tpctax.gov.taipei/News.aspx?n=BB8B93F0A49EAB80&sms=87415A8B9CE81B16`
- Official logo page:
  `https://tpctax.gov.taipei/cp.aspx?n=97DA1F76BC737417`

Also use the official CSS/reference files already documented in `docs/VISUAL_REFERENCE.md`.

## Required work

1. Sync latest `main`.
2. Read all standard project documents plus `docs/VISUAL_REFERENCE.md`.
3. Re-inspect the current official page/CSS and extract the actual visual values/patterns relevant to:
   - header/background;
   - agency logo/wordmark placement;
   - page-title color and heading treatment;
   - body/background colors;
   - font family and size hierarchy;
   - link color;
   - borders/separators;
   - form/search surface;
   - primary action button;
   - mobile behavior.
4. Retrieve and use the official TRS logo asset from the documented agency-controlled source.
5. Save the selected official asset locally under `assets/`; do not hotlink at runtime.
6. Record exact asset source URL, dimensions and SHA-256.
7. Revise `index.html`, `demo.html` and CSS so that, where feasible, the shared visual language closely reproduces the official site rather than an interpreted approximation.
8. Specifically review and align:
   - upper-left logo;
   - header background;
   - title text color;
   - heading size/weight;
   - content width and density;
   - search/form background;
   - link styling;
   - submit button colors;
   - border/separator styling.
9. Do not copy unrelated full navigation, mega menus, search infrastructure or footer complexity unless needed purely for visual continuity.
10. Keep the AI interaction area simple and readable.
11. Use evidence-backed official values when available; do not preserve previous custom values merely because they already exist.
12. Do not redraw/recolor/distort the official logo.
13. Run existing Node and offline Chromium tests.
14. Generate desktop, 390px and 320px screenshots.
15. Build deterministic hosting/demo packages and confirm the local logo asset is included.
16. Update `docs/VISUAL_REFERENCE.md`, `PROJECT_STATE.md`, and `NEXT_TASK.md`.
17. Commit/push and STOP for Web ChatGPT review.

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

No Production questions or deployment are authorized.
