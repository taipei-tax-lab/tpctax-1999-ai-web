# AGENTS.md

## Project role

This repository is the frontend source of truth for 臺北市稅捐稽徵處「1999 AI 智慧問答」.

CX backend resources are owned by `taipei-tax-lab/dialogflow-cx-qa-framework`.

## Read order

At the start of every task, read:

1. `README.md`
2. `PROJECT_STATE.md`
3. `NEXT_TASK.md`
4. `docs/PRODUCT_PLAN.md`
5. `docs/RESULT_CONTRACT.md`

## Architecture guardrails

- Static HTML/CSS/JavaScript only unless a later human decision explicitly changes this.
- No new Cloud Run/API server/webhook/proxy/middleware.
- Use Dialogflow Messenger JavaScript API as the browser transport.
- New session first query may set `currentPlaybook` to the 1999 FAQ Playbook; remove the browser-side override after the first request.
- Frontend result contract is answer-first. Sources and FAQ metadata are optional progressive enhancement.
- Do not assume every later turn stays in the 1999 Playbook; the same Agent may route to another Playbook.
- Never fabricate source metadata.
- Never put service-account credentials, ADC, access tokens, API secrets, or private keys in browser code or repo files.
- Do not modify live Messenger settings, CX resources, GCP IAM, Production Environment, or the official Taipei City website from this repo unless separately authorized.
- `assets/config.js` must remain `liveEnabled: false` until explicit deployment authorization.

## UI continuity with official site

The 1999 AI page should feel like an extension of the existing Taipei City Revenue Service website, not a separate product microsite.

Reference page:
`https://tpctax.gov.taipei/News.aspx?n=BB8B93F0A49EAB80&sms=87415A8B9CE81B16`

Frontend visual work should therefore:

- keep the interface simple, functional and government-site-like;
- align the page background, text colors, link colors, border treatment and spacing with the official site rather than introducing a distinct product palette;
- use the official Revenue Service logo/brand treatment at the upper left when an approved/local asset is available; do not invent a replacement logo;
- prefer the same or a close system Traditional Chinese font stack and restrained typography scale used by the official site;
- avoid oversized marketing-style hero typography, heavy shadows, pill-heavy controls, decorative gradients, glass effects or startup/SaaS visual language;
- preserve clear hierarchy and accessibility while keeping body text, headings, controls and link sizes close to the official-site proportions;
- keep the AI-specific page lightweight: official-style header/branding, page title/description, natural-language query area, result area, source area and return link are sufficient;
- do not copy unrelated official-site navigation or footer elements merely for visual imitation;
- do not change Messenger/session/result-contract behavior during a visual-only revision unless separately authorized.

When visual similarity conflicts with usability, accessibility or the existing result/session contract, preserve function and accessibility first and document the difference.

## Official-site reference hierarchy

For visual work, use this priority:

1. official Taipei City Revenue Service logo/brand asset;
2. the current official 1999 FAQ page's content-page visual language;
3. accessibility/usability requirements;
4. the existing standalone AI page styling.

The official 1999 FAQ page is structurally a conventional government content page: agency identity, page/unit heading, restrained form controls, ordinary text links, content/list/table presentation and dense but readable spacing. The AI page should inherit that visual rhythm without cloning unrelated navigation.

The official Revenue Service logo is the TRS blue/gold mark published on the agency's own logo-download page. Blue/gold may inform small brand accents, but do not turn the AI page into a blue/gold promotional theme. Use a mostly white/neutral content surface.

Design direction for the next visual revision:

- remove the provisional unsupported blue-gray brand color as a defining visual identity;
- derive primary action/link treatment from the official site's actual identity/reference when available;
- make the official TRS logo + agency name the main upper-left identity;
- keep the page title similar in scale and weight to a normal official-site unit/content heading, not a marketing hero;
- use square or only lightly rounded controls and panels;
- use borders/separators more than shadows;
- keep body copy around ordinary government-site reading size, with answer text allowed slightly more breathing room;
- keep one obvious primary action for query submission; examples/reset/return links should be visually secondary;
- avoid decorative AI iconography, gradients, floating cards and oversized empty space;
- the page may be cleaner than the legacy official page, but should not look like a separate branded product.

## Workflow

- Project state lives in Git, not in the current session.
- Keep `PROJECT_STATE.md` and `NEXT_TASK.md` current after meaningful work.
- Prefer small, reviewable commits.
- Run focused offline tests before claiming frontend changes are complete.
- Do not claim Production runtime validation from mock/offline fixtures.
- Large binary/runtime evidence belongs in the project Drive when needed; source code and durable decisions belong in GitHub.
