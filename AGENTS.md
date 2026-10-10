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
- Every user query sets `currentPage` to the authoritative FAQ Flow START_PAGE; SDK defaults use the same per-query contract. Do not send the old `currentPlaybook`.
- Frontend result contract is answer-first. Sources and FAQ metadata are optional progressive enhancement.
- Each 1999 query is independent semantic search; no CX Router/Rental switching. Render backend Rental guidance as a link; no frontend classifier.
- Never fabricate source metadata.
- Never put service-account credentials, ADC, access tokens, API secrets, or private keys in browser code or repo files.
- Do not modify live Messenger settings, CX resources, GCP IAM, Production Environment, or the official Taipei City website from this repo unless separately authorized.
- **現行已上線配置（2026-10-09 已完成授權及人工驗收）：** `assets/config.js` 現為 `liveEnabled: true`，且 1999 FAQ Flow Web cutover 已記錄 `LIVE / USABLE`。不得因本檔的歷史準備期規則而擅自將正式服務改回 `false`；未來改動該 flag、停用服務或重部署都需另取得明確授權。證據見 `PROJECT_STATE.md` 與 `assets/config.js`。

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

## Official-site fidelity rule

The visual target is now **high fidelity to the current official Taipei City Revenue Service website**, not merely visual continuity.

Where the official site provides clear evidence, prefer direct reproduction of its visual language over reinterpretation. This includes header background treatment, agency identity placement, page-title color, typography scale, link color, border/separator treatment, search/form surfaces and primary-button styling.

Do not invent an alternate brand system when the official site already defines one.

The remaining branding/layout task includes official TRS identity completion and evidence-based fidelity work:

- use an unchanged official Taipei City Revenue Service / TRS logo asset;
- store the selected logo locally under `assets/`;
- record exact source URL, dimensions and SHA-256 in `docs/VISUAL_REFERENCE.md`;
- use the asset in both `index.html` and `demo.html`;
- preserve meaningful adjacent agency-name text for accessibility and recognition;
- match official header/background/title colors and spacing as closely as practical from retrieved official CSS/reference evidence;
- reproduce the official page-title visual treatment rather than keeping a custom AI-page title color;
- keep the page simpler than the full government shell, but make shared elements look intentionally native to the source website;
- do not redraw, recolor, crop aggressively, stylize or substitute another Taipei City Government mark;
- do not add remote image/font runtime dependencies;
- verify desktop, 390px and 320px layout after insertion;
- if the official asset cannot be retrieved in the execution environment, STOP and report the exact blocker instead of inventing a replacement.

## Official red accent rule

Use the official Revenue Service reds as restrained identity accents, not as a new dominant palette.

Reference reds:
- `#d4222d`: use for stronger section/header emphasis where the official site already uses red blocks.
- `#de313c`: use for lighter emphasis, hover states, short separators and small accent marks.

Approved placements:
- a slim red accent beside the main page heading;
- a small red accent beside the query label;
- the existing red result heading bar;
- link hover states;
- the existing red footer separator.

Do not:
- turn the global header red;
- recolor the official logo;
- replace the official yellow submit button with red;
- add red borders to every panel;
- make all headings red;
- add decorative gradients or large red background areas.

The intent is to restore official-site identity through small, evidence-based red accents while preserving the current high-fidelity structure.

## Final interaction simplification rule

The next UI refinement should simplify the citizen-facing interaction while preserving all session behavior.

Citizen-facing copy and behavior:

- remove the intro sentence under the page title;
- move example questions above the query form;
- present them as a simple sentence beginning with `您可詢問`, followed by two clickable quoted example questions;
- use more common local-tax examples rather than niche wording;
- use a common local-tax question as the textarea placeholder;
- do not show an idle/status panel during normal ready state;
- show status UI only for loading, unavailable, empty/error, or interrupted-query recovery as needed;
- do not expose a reset/session control; every new query is already an independent search;
- keep technical session recovery internal and show only the latest query/result;
- clear textarea/counter only after Messenger accepted send, preserving the submitted result heading;
- remove the explanatory sentence `可接著詢問；開始新查詢會重設查詢脈絡。`.

Red identity may be slightly stronger than the previous restrained pass, but must remain tied to official values and function:
- H1 red accent;
- `您可詢問` emphasis;
- query section top/accent treatment;
- existing red result heading;
- red hover/footer separator.

Do not recolor the official yellow primary query button.

## Final example-placement rule

The final example-question placement is fixed as follows:

1. query label `您想了解什麼？`;
2. textarea;
3. clickable `您可詢問 ...` example sentence;
4. yellow `查詢解答` submit button.

The example sentence is input assistance and must sit between the textarea and the primary submit action.

Do not move it back above the form or below the submit button.

Keep:
- the two approved example questions and their click-to-fill behavior;
- official-red emphasis on `您可詢問`;
- the official yellow submit button styling;
- current status/session behavior;
- current responsive/accessibility behavior.

This is a placement-only refinement. No copy rewrite or functional redesign is authorized.

## Deployment-gate workflow

The UI is frozen unless a deployment test reveals a concrete display defect.

Deployment work must proceed gate-by-gate. Do not combine later gates into an earlier task.

Gate order:

1. **Hosting / URL discovery**
   - determine the intended hosting mechanism, final/public hostname or path, and whether the agency/CMS or another static host serves the files;
   - audit current placeholders and packaging assumptions;
   - identify the exact human inputs still required;
   - do not deploy.

2. **Messenger allowed-domain preparation**
   - only after the actual host/origin is known;
   - verify which exact origin(s) must be allowed;
   - do not guess or broaden domains unnecessarily.

3. **CSP / resource-policy preparation**
   - derive required script/style/connect/frame/resource origins from the actual frontend and Messenger SDK;
   - prepare the smallest compatible policy/change request for the actual host;
   - do not weaken CSP broadly.

4. **Production binding verification**
   - read back the Messenger integration binding and confirm the expected Production Environment;
   - backend source of truth remains `dialogflow-cx-qa-framework`;
   - do not mutate backend settings without separate authorization.

5. **Live frontend enablement**
   - only after Gates 1-4 pass;
   - set the real hosting URL and enable live mode in a controlled deployment candidate;
   - no public deployment unless explicitly authorized.

6. **Authorized live runtime validation**
   - execute a small defined test set;
   - verify SDK load, per-query FAQ currentPage, independent searches, internal recovery, complete text rendering and errors;
   - record evidence and stop if Production routing differs from expectation.

7. **Official-page entry integration**
   - only after the standalone AI page is proven live;
   - define the final link/button change on the existing 1999 FAQ page and its target behavior.

At each gate, record:
- verified facts;
- unknowns;
- required human input;
- exact changes proposed;
- pass/fail decision.

Never guess a production hostname, CSP policy, allowed domain, integration binding, or CMS capability.

## Task checklist reporting rule

For execution tasks, `NEXT_TASK.md` is the operational checklist and handoff truth.

Agents must:
- check off completed items directly in `NEXT_TASK.md`;
- leave blocked/uncompleted items unchecked;
- add concise evidence/results beside or beneath the relevant checklist section;
- add a short completion summary at the bottom;
- update `PROJECT_STATE.md` only for durable project-state changes;
- commit/push the checklist update before stopping.

Web ChatGPT review should be able to determine progress from `NEXT_TASK.md`
without reconstructing work from chat prose.

## Workflow

- Project state lives in Git, not in the current session.
- Keep `PROJECT_STATE.md` and `NEXT_TASK.md` current after meaningful work.
- Prefer small, reviewable commits.
- Run focused offline tests before claiming frontend changes are complete.
- Do not claim Production runtime validation from mock/offline fixtures.
- Large binary/runtime evidence belongs in the project Drive when needed; source code and durable decisions belong in GitHub.
