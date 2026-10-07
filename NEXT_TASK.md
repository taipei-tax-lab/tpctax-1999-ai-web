# NEXT_TASK

## Active task

**V1.2 reference-driven official-site visual alignment**

Do not deploy live. Functional V1 remains frozen.

## Human review decision

The V1.1 simplification is accepted as a useful intermediate draft, but its provisional blue-gray palette and text-only brand header are not final.

The next revision must feel recognizably connected to the actual Taipei City Revenue Service website, while staying simpler than the full official-site shell.

## Authoritative visual references

1. Official 1999 FAQ page:
   `https://tpctax.gov.taipei/News.aspx?n=BB8B93F0A49EAB80&sms=87415A8B9CE81B16`
2. Official logo-download page:
   `https://tpctax.gov.taipei/cp.aspx?n=97DA1F76BC737417`

Web review confirmed that the agency publishes the official TRS blue/gold logo. Use the official asset if it can be obtained from the agency source. Do not redraw or invent it.

If the Codex environment still cannot open the official page, do not invent measured CSS values. Follow the concrete direction below and clearly mark any remaining color/font values as provisional.

## V1.2 design target

A citizen arriving from the official 1999 FAQ page should perceive:

> same agency, same service family, new AI query function.

Not:

> a separate AI product / landing page.

### Header / identity

- Use the official TRS logo plus `臺北市稅捐稽徵處` as the primary upper-left identity.
- Keep the header compact and white/neutral.
- The AI feature name belongs in the page content, not as a competing brand.
- Keep a clear ordinary-text link back to `本府1999常見問答`.
- Do not recreate the full municipal global navigation.

### Palette

- Remove the provisional `#40596c` as the defining brand color unless official reference evidence supports it.
- Base the page on white plus neutral gray text/borders.
- Use official identity colors sparingly for primary action/link/focus accents.
- The TRS logo already carries blue/gold; do not flood the interface with both colors.
- Prefer one restrained primary UI accent and neutrals.
- Maintain WCAG-appropriate contrast.

### Typography / density

- Keep a Traditional Chinese system font stack suitable for the official site.
- Treat `1999 AI 智慧問答` as a normal official-site page/unit heading, not a hero.
- Desktop H1 should remain restrained (roughly high-20px range unless reference evidence supports otherwise).
- Body/control copy should stay around conventional 16px readability.
- Avoid tiny helper text where it hurts readability.
- Reduce unnecessary vertical whitespace; content should feel like an official service page.

### Form / result blocks

- Query area should resemble a normal government-site form: visible label, clear textarea border, obvious submit button.
- Use square/lightly rounded corners.
- Prefer borders and separators to card shadows.
- Example-question buttons should look secondary, not like promotional chips.
- Result answer should be the visual priority after submission.
- FAQ/source blocks should read like supporting official references, not decorative cards.
- Keep reset/new-query controls clearly secondary.

### Footer

- Keep only the minimal agency/service identification needed for the standalone page.
- Do not duplicate the entire official footer unless later required by hosting/CMS policy.

## Functional freeze

Do not change:

- Messenger JavaScript API transport;
- one-shot `currentPlaybook`;
- session/reset/expiry behavior;
- request locking/timeout behavior;
- normalized result model;
- answer/source/FAQ extraction or rendering logic;
- CX/GCP/Messenger integration settings;
- Production Environment;
- `assets/config.js` `liveEnabled=false`.

## Required work

1. Sync latest `main` and read the six standard project documents.
2. Inspect the V1.1 draft.
3. Obtain/use the official TRS logo from the agency source if technically accessible; save it locally and record its exact source. If inaccessible, leave a clearly documented asset placeholder rather than fabricate a logo.
4. Implement the V1.2 visual revision in `index.html`, `demo.html` and CSS only as needed.
5. Do not add a framework, remote font, backend or runtime branding dependency.
6. Run all existing Node and offline Chromium tests.
7. Generate desktop, 390px and 320px review screenshots.
8. Build deterministic hosting/demo packages.
9. Update `PROJECT_STATE.md` and `NEXT_TASK.md`.
10. Commit/push and STOP for Web ChatGPT review.

## Acceptance question

The primary review question is:

> Does this now look like a simple Taipei City Revenue Service service page with an AI query function, rather than a separately branded AI microsite?

Do not deploy or send Production queries.
