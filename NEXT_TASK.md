# NEXT_TASK

## Active task

**Add restrained official red accents to the accepted high-fidelity visual reproduction**

Do not deploy live. Do not redesign the page.

## Human decision

The current high-fidelity reproduction is accepted overall.

One small visual refinement is requested:

> introduce a few more official red accents so the page carries more of the existing Revenue Service identity, without making red the dominant color.

## Official red values

Use the already verified official values:

- `#d4222d`
- `#de313c`

## Required changes

1. Keep the main `1999 AI 智慧問答` heading text in the existing official dark gray.
2. Add a slim red accent to the main heading, preferably a left border/marker rather than recoloring the full heading.
3. Add a small red accent to the query label `您想了解什麼？`, again using a minimal marker/left border.
4. Keep the existing red result heading block `#d4222d`.
5. Keep link hover red `#de313c`.
6. Keep the footer red separator `#de313c`.
7. Keep the official yellow submit button exactly as the current evidence-based implementation unless a layout-only adjustment is required.
8. Keep the official TRS logo and official background unchanged.

## Do not

- do not make the global header red;
- do not recolor or redraw the logo;
- do not change the yellow submit button to red;
- do not make all headings red;
- do not add red borders to every section;
- do not introduce large red surfaces, gradients or decorative banners;
- do not change any Messenger/session/result logic.

## Scope

This is a CSS/markup micro-adjustment only.

Use the smallest implementation needed to achieve:

- H1 red accent;
- query-label red accent;
- preserve existing official red result/hover/footer treatment.

## Verification

1. Run existing Node tests.
2. Run existing offline Chromium suite.
3. Regenerate desktop, 390px and 320px screenshots.
4. Confirm the red accents remain visually restrained at all three widths.
5. Confirm no horizontal overflow or accessibility regression.
6. Update `PROJECT_STATE.md` and `NEXT_TASK.md`.
7. Commit/push and STOP for Web ChatGPT review.

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
