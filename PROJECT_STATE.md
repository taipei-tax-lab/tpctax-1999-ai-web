# PROJECT_STATE

Last updated: 2026-10-07

## Status

**FINAL PLACEMENT-ONLY REFINEMENT VERIFIED OFFLINE — AWAITING WEB CHATGPT REVIEW — NO LIVE DEPLOYMENT**

This repository owns the 1999 AI frontend, UI, static hosting package, demo, and frontend tests.

Dialogflow CX backend source of truth:

`taipei-tax-lab/dialogflow-cx-qa-framework`

## Migration baseline

- source repo main: `6d35d1a129a95126b7734100206e32bb58f25cc9`
- Phase 7E3A source/evidence commit: `5d58feed72b5758d93a943fca5c96536d71bd0f2`
- Drive review package: `1SZCna6cjEhl3TZeUfTLD790p-q6b4y49`

## Current implementation

- Static search-style page.
- Current official TRS header wordmark stored unchanged as `assets/trs-header.png` in both headers; local official city background in `assets/official-page-bg.png`.
- Earlier `assets/trs-logo.gif` retained unchanged as the original standalone-mark source.
- Shared CSS adds a slim official-red H1 marker and a smaller query-label marker; both text colors remain `#343434`.
- Intro removed; common-tax examples are plain clickable quoted text between textarea and submit, with red `您可詢問` and a restrained red query top rule.
- Ready state hides the idle panel. Reset appears only after a successful answer, labeled `清除前次問答，重新提問`; it uses the existing real session reset, clears/focuses input and hides again until another successful answer.
- No custom backend.
- Dialogflow Messenger is the intended browser transport.
- `liveEnabled=false`.
- Hosting URL remains a placeholder.
- First-turn initial Playbook is the 1999 FAQ Playbook.
- Generic answer rendering works without FAQ metadata.
- FAQ source card is optional progressive enhancement only.
- Official-site same-tab/new-tab/window behavior remains deliberately unspecified.
- No official-site deployment has occurred.
- No Production Messenger runtime validation has occurred from this repo.

## Standalone migration verification — 2026-10-07

Verified after fetching and synchronizing `origin/main` at
`2a59c55341c26dacb41f46968f245af7d7cd77eb`. Read the repository agent instructions,
README, state, next task, product plan and result contract before verification.

- `npm test`: 10 passed, 0 failed, 0 skipped.
- `python3 tests/phase7e3a_browser.py --output-dir /workspace/migration-verification/2026-10-07/browser --base-url http://127.0.0.1:8765/`:
  PASS, 9 checks, no page errors, no external requests, 0 Production requests.
  Used a local Python static server, Playwright 1.62.0 and `/usr/bin/chromium`;
  the SDK bootstrap check used an intercepted local synthetic SDK.
- Browser checks covered answer-only rendering, optional FAQ enhancement,
  generic multi-source answers, same-session followups, one-shot
  `currentPlaybook`, reset/expiry, unsafe response handling, empty/error states,
  390px/320px layouts, IME Enter handling and the canonical return link.
- `python3 tools/package_static.py --output-dir /workspace/migration-verification/2026-10-07/packages`:
  hosting/demo ZIP integrity and manifest hashes passed. A second build into
  `packages-repeat` produced byte-identical ZIPs.
- Hosting ZIP SHA-256: `f89fa8834ae4858f84bdff3acd255e97a40e8d76a5384837b18cde2c9188c928`.
- Demo ZIP SHA-256: `324c1423c159a51a9d22183cbc8720caa3a21b5850e52325a6b1f0e5c4914c5f`.
- Search of executable `tests/`, `tools/` and `package.json` found no
  `web/1999-ai/` references. Tests and packaging run directly from this checkout.
- Imported `assets/config.js` in Node and confirmed `config.liveEnabled === false`.
- Runtime: Node 24.19.0 and Python 3.12.14. No application or test code changed.

Generated packages, screenshots, browser report and Node test output remain
outside the checkout under `/workspace/migration-verification/2026-10-07/`;
they have not been uploaded to Drive. These offline fixtures do not establish
live SDK behavior, tax-answer quality, Production routing or deployment readiness.
No Production questions were sent and no CX/GCP/Messenger/official-site settings
were modified. Stop for Web ChatGPT review; see `NEXT_TASK.md`.

## Human UI review decision — 2026-10-07

The functional V1 architecture is accepted. The next revision is visual only.

Human direction:

- keep the page simple;
- make it feel like a natural extension of the existing Taipei City Revenue Service website;
- align the palette, upper-left branding/logo treatment, Traditional Chinese font stack, font sizing, border treatment and general density with the official 1999 FAQ page;
- remove or reduce visual language that feels like a separate modern product/microsite;
- retain the custom natural-language search/result interaction and all current answer/session behavior;
- do not recreate the entire municipal website shell; only enough shared visual language is needed to establish continuity.

Official visual reference:
`https://tpctax.gov.taipei/News.aspx?n=BB8B93F0A49EAB80&sms=87415A8B9CE81B16`

The official Revenue Service logo is published on the agency site. The implementation should prefer a local approved asset rather than an invented `1999` mark or an unnecessary runtime hotlink.

This revision must not change CX backend resources, Messenger integration settings, Production binding, hosting, or `liveEnabled=false`.

## Visual revision draft — 2026-10-07

Synced latest `main` at `163fe69` and read the six required project documents.
The conservative visual draft changes only `index.html`, `demo.html` and
`assets/styles.css`, plus these project-state documents:

- Removed the invented green `1999` badge; the header now uses the agency's
  full name as ordinary text, not an invented replacement logo.
- White background, dark gray body text, provisional subdued blue-gray links
  and primary button, simple gray borders, 2px corners, no card shadows.
- Traditional Chinese system font stack begins with Microsoft JhengHei and
  PingFang TC; no remote font dependency.
- Replaced the marketing headline with `1999 AI 智慧問答` at 28px desktop /
  24px mobile; reduced spacing and removed the promotional footer tagline.
- Kept the normal canonical return link, visible labels, live regions and
  result focus target. Added a keyboard skip link, visible focus outlines,
  at least 44px button heights and resizable mobile textarea.
- Messenger transport, one-shot Playbook/session logic, normalized model,
  renderer, mock transport and existing tests are unchanged. `liveEnabled=false`.

### Reference access limitation

The supplied official FAQ URL could not be inspected: the cloud network proxy
returned `CONNECT 403`. The running environment's restricted network policy
had no custom rule for `tpctax.gov.taipei`; a draft adding only that hostname
was saved. Saving the draft does not apply or publish it. The user must save
the network change in environment settings before reference retrieval can resume.

No official logo asset was downloaded or fabricated. The current palette,
font stack and header are a restrained provisional treatment based on the human
brief, not measured official-site styles. Official reference comparison and
local logo acquisition/source recording remain outstanding. Do not describe
this draft as completed official-site visual alignment.

### Offline validation and review artifacts

- `npm test`: 10 passed, 0 failed, 0 skipped.
- Existing `tests/phase7e3a_browser.py`, with local server port 8766:
  9 checks passed, no page errors/external requests, 0 Production requests.
  An old listener on port 8765 returned an empty response; a fresh local
  server on 8766 resolved that validation prerequisite.
- Additional browser inspection passed keyboard skip-link navigation,
  one main heading, 44px button heights, textarea resizing and no horizontal
  overflow at 1280px, 390px and 320px.
- Main body/link/button/muted text contrast is at least 4.5:1 against its
  relevant white/light gray surface; reduced-motion behavior is retained.
  This is focused verification, not a full accessibility audit.
- `tools/package_static.py`: hosting/demo ZIP integrity and hashes passed;
  repeat builds are byte-identical and include the revised markup/styles.

Local review artifacts (outside Git, not uploaded to Drive):
`/workspace/visual-review/2026-10-07/desktop-review.png`,
`mobile-390-review.png`, `mobile-320-review.png`, `desktop-idle.png`,
`browser/desktop-faq.png`, `browser/browser_validation.json` and
`packages/demo.zip` / `packages/hosting.zip`.

Start review with the desktop and 390px mobile screenshots, then extract the
demo ZIP and serve it over HTTP to inspect `demo.html`. The yellow demo panel
and all answers are offline fixtures. No live deployment or CX/GCP/Messenger/
Production/official-site modification occurred. Stop for Web ChatGPT review;
resume official reference work only when access or supplied assets are available.

## V1.2 visual planning decision — 2026-10-07

Web review accepts the V1.1 simplification but does not accept its provisional palette as final.

Verified public references available to Web ChatGPT:

- Official 1999 FAQ page:
  `https://tpctax.gov.taipei/News.aspx?n=BB8B93F0A49EAB80&sms=87415A8B9CE81B16`
- Official Revenue Service logo-download page:
  `https://tpctax.gov.taipei/cp.aspx?n=97DA1F76BC737417`
- The official logo is the TRS blue/gold mark published by the agency.

The target for V1.2 is not a visual clone of the entire government website. It is a lightweight AI query page that inherits the official content-page identity:

- official TRS logo plus agency name in the header;
- white/neutral surfaces;
- official-site-like typography scale and density;
- restrained link/primary-action color derived from the official identity/reference rather than the provisional `#40596c`;
- standard borders/separators, minimal corner radius and no decorative shadows;
- a normal unit/page heading rather than a product hero;
- query form and result content treated like official-site content blocks;
- no full navigation/menu duplication.

The current V1.1 blue-gray color is explicitly provisional and may be replaced.

Functional architecture remains frozen. This next iteration is visual-only and must preserve all verified Messenger/session/result-contract behavior and `liveEnabled=false`.

## V1.2 reference-driven implementation — 2026-10-07

Synced `origin/main` at `abd800d` and read the six required documents in order.
The official FAQ and logo-download pages, `global.css`, `page.css` and
`sys_detail.css` were successfully retrieved over verified HTTPS this time.
Official HTML/CSS were inspected and rendered locally with scripts removed
and all network requests blocked. Reference sources and adaptation decisions
are recorded in `docs/VISUAL_REFERENCE.md`.

Implemented visual changes:

- Removed provisional `#40596c` and the colored header band. Kept white /
  neutral surfaces and `#343434` agency-site body text.
- Matched the Arial / 微軟正黑體 system-font direction, retaining PingFang TC
  fallback without a remote font. Heading is a plain 26px desktop / 24px mobile
  unit title; helper copy is at least 14px.
- Query block uses the official page-search `#fafafa` surface. The small
  submit button uses official CSS `#ffc800` / `#1a1a1a`, with `#cca000` hover.
  Gold is confined to the primary action; no blue/gold promotional theme.
- Underlined links use official content-link hover color `#045b87` to maintain
  readable contrast; examples and reset are secondary underlined buttons.
- Answer area is a white content block with separators rather than a floating
  card. FAQ/source support is neutral, with no decorative shadow.
- Header/footer remain minimal. The canonical return link, keyboard skip link,
  focus outlines, live regions, result focus, textarea resizing and 44px minimum
  button heights remain intact.
- Static packaging includes the visual-reference document. No framework,
  backend, remote font or runtime branding dependency was added.

### Remaining official TRS asset blocker

The official logo page's GIF and logo-with-text PNG are hosted at
`www-ws.gov.taipei`. Fetches were blocked; a header check confirmed an Envoy
`CONNECT 403`, rather than a missing asset or an application defect.
The network draft now preserves `tpctax.gov.taipei` and adds only
`www-ws.gov.taipei`; the user must save that change in environment settings
before retry. Saving the draft did not apply or publish it.

Following the explicit inaccessible-asset fallback in `NEXT_TASK.md`, both HTML
pages retain a documented plain agency-name placeholder. No TRS logo was
fabricated or downloaded, and no logo image is in either package yet. The
generic local `/Images/major_logo.png` was inspected but is Taipei City Government
identity rather than TRS, so it was not used. Exact official TRS candidate URLs
and the completion steps are in `docs/VISUAL_REFERENCE.md`.

The CSS reference work is complete; official TRS identity remains incomplete.
Do not describe this as fully completed official-site branding until the actual
asset is acquired, packaged and checked at all three widths.

### Validation and review artifacts

- `npm test`: 10 passed, 0 failed, 0 skipped.
- Existing offline Chromium suite on local port 8767: PASS, 9 checks,
  no page errors, no external requests, 0 Production requests.
- Focused visual browser inspection: 5 checks passed, covering keyboard
  skip-link focus, 1280px/390px/320px layouts, 44px buttons, resizable textarea,
  one H1, canonical return link and 640px reflow representing a desktop 200%
  zoom viewport. This is not a full accessibility audit.
- Main text/link/action contrast is at least 4.5:1; textarea border against
  its form surface exceeds 3:1. Reduced-motion support remains unchanged.
- Hosting/demo packaging passed ZIP integrity and manifest-hash validation;
  second builds were byte-identical. Packages include `docs/VISUAL_REFERENCE.md`.
- Messenger transport, `currentPlaybook`, session/reset/expiry/timeout logic,
  normalized result model, renderer, demo fixtures and existing tests remain
  byte-for-byte unchanged from `abd800d`. `config.liveEnabled === false`.

Review artifacts are outside Git at `/workspace/visual-review/v1.2-2026-10-07/`:

- `desktop-review.png`, `mobile-390-review.png`, `mobile-320-review.png`:
  current local synthetic multi-source answer demo.
- `desktop-disabled.png`, `desktop-idle.png`, `browser/desktop-faq.png`:
  disabled/idle/FAQ views.
- `browser/browser_validation.json`, `visual_checks.json`, `node-tests.txt`.
- `packages/hosting.zip`, `packages/demo.zip` and `packages/package_summary.json`.
- Reference HTML/CSS, `reference-styles.json` and the offline reference capture.

No evidence was uploaded to Drive. No Production questions, live deployment,
CX/GCP/Messenger integration, Production Environment or official-site changes
occurred. Commit/push and STOP for Web ChatGPT review; the next work is official
TRS asset completion once the access prerequisite is supplied.

## Web review decision — final visual baseline

The V1.2 reference-driven styling is accepted as the visual baseline.

No further abstract palette/typography redesign is requested at this point. The remaining visual task is narrowly scoped to:

1. obtain the unchanged official TRS logo asset from an agency-controlled source;
2. store it locally under `assets/`;
3. integrate it into the header of both `index.html` and `demo.html`;
4. preserve the current V1.2 layout, colors, typography, form treatment and result presentation unless the logo causes a concrete responsive/layout issue;
5. rerun the existing offline verification and regenerate desktop/390px/320px screenshots.

The official logo source candidates and current access limitation are documented in `docs/VISUAL_REFERENCE.md`.

After the logo is integrated and the screenshots are reviewed, the frontend should move to deployment preparation rather than another open-ended visual-design cycle.

## Official TRS logo completion — 2026-10-07

Synced `origin/main` at `1605f05` and read all seven requested documents in order.
The previously blocked official assets were successfully retrieved this time.
Selected the standalone agency-published TRS color GIF at
`https://www-ws.gov.taipei/001/Upload/public/Attachment/53171512338.gif`.

- Stored original bytes unchanged as `assets/trs-logo.gif`: 1200×1200,
  single-frame transparent GIF, 12,260 bytes. Exact SHA-256 and selection
  rationale are recorded in `docs/VISUAL_REFERENCE.md`.
- Added the local image to `index.html` and `demo.html`, retaining visible
  `臺北市稅捐稽徵處` text and the normal canonical return link.
- Only three CSS rules were added for logo flex alignment/gap and
  proportional 56px desktop / 44px mobile sizing. The rest of the accepted
  V1.2 stylesheet is byte-for-byte unchanged.
- Added the selected asset to the existing static package asset list.
  No remote image dependency or substitute logo was introduced.
- `npm test`: 10 passed, 0 failed, 0 skipped.
- Existing offline Chromium suite on local port 8768: 9 checks passed,
  no page errors/external requests, 0 Production requests.
- Focused logo checks: 6 passed (both HTML pages at 1280px, 390px and 320px).
  Verified local image HTTP 200/natural dimensions, original aspect ratio,
  rendered size, accessible brand-link name, adjacent visible agency name,
  vertical alignment and no horizontal overflow.
- Hosting/demo ZIP integrity, manifest hashes and repeat-build reproducibility
  passed. Both packages contain logo bytes identical to the official download.
- Messenger transport, one-shot Playbook/session/reset/expiry/timeout logic,
  normalized result model, answer/source/FAQ renderer, demo fixtures and existing
  tests remain unchanged. `config.liveEnabled === false`.

Review evidence is outside Git under
`/workspace/visual-review/trs-logo-2026-10-07/`:
`desktop-review.png`, `mobile-390-review.png`, `mobile-320-review.png`,
the corresponding `*-disabled.png` views, `browser/browser_validation.json`,
`logo_checks.json`, `node-tests.txt`, `packages/hosting.zip`,
`packages/demo.zip` and `packages/package_summary.json`.

No evidence upload, Production questions, deployment, CX/GCP/Messenger/
Production Environment or official-site changes occurred. Stop after commit/push
for final Web ChatGPT visual acceptance; no general redesign is pending.

## Revised human visual direction — high fidelity

The prior V1.2 styling is no longer treated as visually final.

Human review now explicitly prefers the standalone AI page to look **as close as practical to the existing official Taipei City Revenue Service site**.

This means the next revision should directly reproduce, where evidence is available:

- the official TRS logo / agency identity at upper left;
- the official header/background treatment;
- page-title color and heading treatment;
- official-site typography direction and sizing;
- link colors;
- form/search background and border treatment;
- primary button colors;
- separators and overall content density.

The official 1999 FAQ page and agency logo page are the primary visual references.

The AI page should still avoid copying unrelated global navigation/footer complexity, but any shared component should look native rather than merely "government-like".

The previous V1.2 palette is therefore an implementation checkpoint, not a visual freeze. Evidence-backed changes needed to improve fidelity are authorized.

Functional behavior remains frozen.

## High-fidelity official-site reproduction — 2026-10-07

Synced latest `origin/main` at `8cdf9332845ecaf42eb1af238da2e980be1e2935`
and read all seven requested documents in order. The human high-fidelity
instruction supersedes the previous accepted V1.2 visual treatment.

- Re-fetched actual official HTML/CSS and measured normal scripted layout at
  1280px, 390px and 320px. Only official static GET resources were allowed;
  third-party scripts and all POST/API requests were blocked. No official form
  submission or Production question occurred.
- Replaced the separately typeset brand with the unchanged current official
  header image: `assets/trs-header.png`, 1200×256, 28,256 bytes. Its original
  composition includes the TRS mark and both agency names. Local original city
  background: `assets/official-page-bg.png`, 1919×581, 159,311 bytes.
  Exact source URLs, hashes and selection rationale are in
  `docs/VISUAL_REFERENCE.md`; neither image was edited or hotlinked.
- Directly copied the white header, native logo size/placement, pale pink page
  background, official system font stack, 22.4px regular gray unit heading,
  #fafafa search surface, #e4e4e4 separators, gray underlined/red-hover links,
  gold query button, gray reset button and red FAQ-table result treatment.
- Matched the native primary content width/density and mobile 8px margins/48px
  header. Centered the primary column because the unrelated sidebar/menu are
  omitted. The return link remains a normal canonical anchor in the content row.
- Retained 44px actions, higher-contrast textarea/focus edges and dark query
  hover text as documented accessibility differences. Both pages passed keyboard
  skip-link, proportional logo, no-overflow and 200% text-size inspection.
- `npm test`: 10 passed, 0 failed, 0 skipped.
- Existing offline Chromium suite on local port 8770: nine checks passed;
  zero external requests, page errors and Production requests. SDK wiring was
  checked only through the intercepted local synthetic SDK.
- Additional visual validation: seven grouped checks passed for both pages at
  1280/390/320px and 320px at 200% text size. Focused contrast checks passed.
- Hosting/demo integrity, manifest hashes and deterministic repeat-build checks
  passed. Both packages include byte-identical official header/background
  assets and the retained standalone GIF.
- Hosting ZIP SHA-256: `4c0ea28c2f781a9dcbe9da680413fc5ee57d04e53b192cc419e6899c7cfb1d56`.
- Demo ZIP SHA-256: `c718510ed79f65d980e61427a66bd665811d9feef11a78403f2d71b072c5a19f`.
- Frozen transport/model/config/renderer/demo/test files remain byte-identical
  to the synchronized baseline. `config.liveEnabled === false`. No executable
  tests/tools rely on `web/1999-ai/`.

Current review artifacts, outside Git and not uploaded to Drive:
`/workspace/visual-review/fidelity-2026-10-07/`.
Review `desktop-idle.png` first, then `desktop-review.png`,
`mobile-390-review.png`, `mobile-320-review.png` and `desktop-faq-review.png`.
The demo ZIP can be extracted and served locally over HTTP to review
`demo.html`; its questions/answers are offline fixtures. Source captures,
computed styles, network audit and test reports are in the same evidence root.
Packages: `packages/hosting.zip`, `packages/demo.zip` and
`packages/package_summary.json`.

No live deployment or CX/GCP/Messenger/Production/official-site changes occurred.
Stop after commit/push for Web ChatGPT review. Offline passing results do not
establish Production routing, live SDK behavior, tax-answer quality or hosting
readiness.

## Human refinement — official red accents

The high-fidelity visual reproduction is accepted overall.

Human review requests one restrained refinement: restore more of the official site's red identity without changing the page's overall palette or structure.

Approved accents:

1. main `1999 AI 智慧問答` heading: keep the text `#343434`, add a slim left-side accent using official red `#de313c` or `#d4222d`;
2. query label `您想了解什麼？`: keep normal text color, add a small red marker/left border;
3. keep the current result heading red block `#d4222d`;
4. keep official link hover red `#de313c`;
5. keep footer red separator `#de313c`.

Do not expand red into the global header, logo, submit button, every border, or large backgrounds. The official yellow submit action remains unchanged.

This is a small visual refinement only. No functional code, result/session behavior, or deployment settings may change.

## Restrained official red accents completed — 2026-10-07

Synced latest `main` at `98528415e4670f7ea8441988f3b50f704377f090` and read
all seven requested documents in order. The initial sandbox could not reach the
proxy; exact GitHub objects were synchronized through the connector and verified
by Git object hashes. A subsequent network-enabled `git fetch origin main`
confirmed the same upstream baseline.

- Application change is confined to five added lines in `assets/styles.css`,
  shared by `index.html` and `demo.html`; HTML and JavaScript are unchanged.
- H1: empty decorative `::before`, `#d4222d`, 3px wide × .9em high
  (20.16px at the existing 22.4px heading size), with 13px left padding.
- Query label: empty decorative `::before`, `#de313c`, 2px wide × .75em high
  (12px at the existing 16px label size), with 8px left padding. Its red area
  is less than half that of the H1 marker. Neither marker adds accessible text.
- Gray title/label text, official header/logo/background, font stack/sizes,
  content width, result red bar, red hover/footer separator and yellow
  `#ffc800` / `#cca000` query button are preserved.
- `npm test`: 10 passed, 0 failed, 0 skipped.
- Existing offline Chromium suite on local port 8771: PASS, nine checks,
  zero external requests, page errors and Production requests.
- Focused baseline comparison: both pages at 1280px/390px/320px passed.
  Sampled element geometry and existing text/background/font/border styles
  match the baseline exactly; only the intended markers and left text padding
  are added. Normal/hover query and link colors are preserved.
- Keyboard skip link and focus indicators, accessible H1/query/agency names,
  live region, result focus, 44px actions, resizable textarea and no horizontal
  overflow passed. Both pages also passed 320px at 200% text size. These are
  focused accessibility checks, not a full accessibility audit.
- Desktop, 390px and 320px result screenshots were visually inspected: accents
  remain slim and subordinate to the accepted result heading. Corresponding
  disabled-hosting screenshots and 200% text-size captures are included.
- Frozen transport/session/model/renderer/config files, demo logic, tests and
  original official image bytes are unchanged. `config.liveEnabled === false`.

Current review evidence is outside Git at
`/workspace/visual-review/red-accents-2026-10-07/`:

- `desktop-review.png`, `mobile-390-review.png`, `mobile-320-review.png`:
  offline synthetic multi-source results.
- `desktop-idle.png`, `mobile-390-idle.png`, `mobile-320-idle.png`:
  actual disabled hosting configuration.
- `mobile-320-idle-text-200.png`, `mobile-320-review-text-200.png`:
  enlarged-text reflow evidence.
- `node-tests.txt`, `browser/browser_validation.json`, `visual_validation.json`.

The designated projectless `/codex/.../output` directory could not be created
in this attached environment (filesystem permission denied), so evidence uses
the existing `/workspace/visual-review/` convention. No evidence was uploaded.
No Production questions, deployment or CX/GCP/Messenger/Production Environment
changes occurred. STOP after commit/push and wait for Web ChatGPT review.

## Final UI refinement decision

The high-fidelity official-site reproduction remains the accepted visual foundation.

Human review requests a final citizen-facing simplification and slightly stronger official-red emphasis.

Approved changes:

1. remove the title intro sentence `用自己的話描述問題，從官方資訊中尋找解答。`;
2. replace the current example-question block with a single line above the query form:
   `您可詢問` + two clickable quoted common-tax questions;
3. replace the textarea placeholder with a more common local-tax question;
4. remove the always-visible normal/idle status panel;
5. keep status UI only for loading, unavailable, empty/error, or reset/session feedback where needed;
6. hide the reset/session control before any successful answer;
7. after a successful answer, show the exact citizen-facing action:
   `清除前次問答，重新提問`;
8. this action must preserve the existing real session reset/re-arm behavior;
9. remove the sentence `可接著詢問；開始新查詢會重設查詢脈絡。`;
10. allow slightly stronger official-red identity in the H1 accent, `您可詢問` emphasis and query-section accent, while preserving the official yellow primary submit button.

Recommended common examples:
- `房屋稅自住住家用稅率怎麼申請？`
- `地價稅自用住宅用地優惠稅率怎麼申請？`

Recommended placeholder:
`例如：房屋稅自住住家用稅率如何申請？`

This is the final UI-freeze candidate. Functional architecture remains frozen.

## Final UI-freeze candidate implemented — 2026-10-07

Pulled latest `main` at `cc651e322762bad9c1767c4336f6d52a1430fec7` and read
all seven requested project documents in order.

- Both HTML pages remove the title intro and session explanation, move the
  exact two quoted housing/land-tax examples above the form, and use
  `例如：房屋稅自住住家用稅率如何申請？` as the placeholder.
- Examples are native text buttons with underlining, no chip border/background,
  and preserved 44px targets. The desktop sentence fits one line; narrow
  screens wrap naturally. Clicking or keyboard activation uses the existing
  input-fill/focus handler and does not submit a query.
- H1 marker is modestly widened from 3px to 4px; title text remains gray.
  `您可詢問` is bold `#d4222d`; query section has a 2px `#de313c` top rule.
  Query-label marker, result red bar, global `#de313c` link hover/footer rule,
  and yellow `#ffc800` / `#cca000` query action remain intact.
- Only the new transparent text examples use `#d4222d` on hover: 4.95:1
  against the `#fafafa` search surface. This avoids the weaker `#de313c`
  contrast on that surface while keeping official reds. Existing link hover
  on white remains 4.55:1. Gray example text exceeds 11:1.
- `assets/app.js` changes only UI state wiring: hide idle status and reveal
  reset after a nonempty successful rendered answer. Empty/error before any
  success do not reveal reset. Loading, unavailable, empty/error and session
  feedback handling remain available.
- Exact reset action invokes unchanged `transport.reset()`, then clears the
  textarea/counter, hides result/idle/reset UI and focuses the textarea.
  The SDK starts a new session with `retainHistory:false`; the next request
  receives the first-turn 1999 Playbook override again. Same-session followups
  still omit that override. No reset/expiry/timeout semantics changed.
- `npm test`: 10 passed, 0 failed/skipped.
- Expanded existing offline Chromium suite: 12 grouped checks passed, zero
  external requests, page errors and Production requests. Focused assertions
  cover ready visibility, exact examples/order/fill, reset gating/copy, real
  new-session/re-arm via both mock and intercepted SDK, plus loading/error/
  unavailable. The SDK remains a local synthetic stub.
- Both pages at 1280px/390px/320px passed keyboard skip/focus/labels, 44px
  targets, textarea resizing and horizontal-overflow checks. Both also passed
  320px at 200% text size. Sampled official header/background/font/content-width/
  query-button/result styles match the synchronized baseline. Focused
  accessibility checks passed; no full accessibility audit is claimed.
- Transport, normalized model and answer/source/FAQ renderer, config, official
  image bytes, demo fixtures and Node tests are byte-for-byte unchanged.
  `config.liveEnabled === false`.

Review evidence is outside Git at
`/workspace/visual-review/ui-freeze-2026-10-07/`:

- `desktop-ready.png`, `mobile-390-ready.png`, `mobile-320-ready.png`:
  ready UI in the clearly labeled offline demo, without idle/reset panels.
- `desktop-review.png`, `mobile-390-review.png`, `mobile-320-review.png`:
  synthetic result with the exact secondary reset action.
- `desktop-unavailable.png`, `mobile-390-unavailable.png`,
  `mobile-320-unavailable.png`: actual disabled hosting configuration.
- `mobile-320-text-200-demo.png`, `mobile-320-text-200-index.png`:
  enlarged-text result/unavailable reflow.
- `node-tests.txt`, `browser/browser_validation.json`, `visual_validation.json`.

The attached environment still uses the workspace evidence directory because
the designated projectless output directory is not writable here. No evidence
upload or live deployment occurred; no CX/GCP/Messenger/Production Environment
settings changed and no Production query was sent. STOP after commit/push and
wait for Web ChatGPT review before calling the UI frozen.

## Final placement refinement

Human review accepts the current UI-freeze candidate except for one layout detail.

Required final ordering inside the query area:

1. `您想了解什麼？`
2. textarea
3. `您可詢問 「房屋稅自住住家用稅率怎麼申請？」 「地價稅自用住宅用地優惠稅率怎麼申請？」`
4. yellow `查詢解答` button

The example sentence remains clickable and must continue filling/focusing the textarea.

No other UI, copy, red-accent, status, reset/session, CX, Messenger, or deployment behavior should change.

The current unavailable message:
`服務準備中 / 查詢服務尚未開放。您可以先查看本府1999常見問答。`
is expected only while `liveEnabled=false` or live Messenger initialization is unavailable. When the live CX/Messenger path initializes successfully, normal ready state hides the status panel.

## Final placement-only refinement completed — 2026-10-07

Pulled latest `main` at `5fc84bdc24c41a6ddfedb0840e621ee4b6a99fce` and read
all seven requested documents in order. The accepted UI is unchanged except
for the required example placement.

- Moved the existing example paragraph in both `index.html` and `demo.html`
  into the input wrapper, immediately after textarea and before submit.
  Visual and DOM order is label → textarea → examples → yellow submit.
- All visible wording, example values, placeholder and reset copy are
  unchanged. Example buttons remain `type=button`, using the unchanged
  click-to-fill/focus handler without submitting.
- No application CSS or JavaScript changes. Red accents, official images,
  font/content width, yellow action, renderer and every status/session behavior
  remain unchanged; `config.liveEnabled === false`.
- `npm test`: 10 passed, zero failures/skips.
- Offline Chromium: 12 grouped checks passed, zero external requests,
  page errors and Production requests. Replaced the superseded above-form
  assertion with visual/DOM placement assertions at desktop/390px/320px.
- Both pages at 1280px/390px/320px passed exact placement, both examples'
  fill/focus without submission, 44px targets, keyboard navigation/focus,
  accessible labels, textarea resizing and no horizontal overflow.
  320px at 200% text size also passed. Yellow normal/hover colors and sampled
  official styles are unchanged; focused contrast remains passing.
- Three ready screenshots were visually inspected: examples sit between
  textarea and submit at every width; yellow submit remains the primary action.

Review evidence outside Git:
`/workspace/visual-review/placement-2026-10-07/`.

- `desktop-ready.png`, `mobile-390-ready.png`, `mobile-320-ready.png`:
  clearly labeled offline demo, ready state.
- `desktop-review.png`, `mobile-390-review.png`, `mobile-320-review.png`:
  synthetic answer and existing reset action.
- `desktop-unavailable.png`, `mobile-390-unavailable.png`,
  `mobile-320-unavailable.png`: actual disabled hosting configuration.
- `mobile-320-text-200-demo.png`, `mobile-320-text-200-index.png`:
  enlarged-text reflow.
- `node-tests.txt`, `browser/browser_validation.json`, `visual_validation.json`.

No Production query, deployment, evidence upload or CX/GCP/Messenger/Production
Environment change occurred. STOP after commit/push for Web ChatGPT review.

## Backend contract

- project: `serviceagent-1150909`
- location: `asia-northeast1`
- agent: `799426c1-ba69-49dc-85e4-5065985706e2`
- initial 1999 Playbook: `projects/serviceagent-1150909/locations/asia-northeast1/agents/799426c1-ba69-49dc-85e4-5065985706e2/playbooks/f0512949-95f2-40c6-95d0-0c139b84b542`
- expected Production Environment: `a0c712e8-ab0c-4520-b100-d2abcfc85868`

Environment binding is integration-side and must not be guessed from HTML attributes.

## Open deployment items

- actual Revenue Service hosting URL / hostname;
- Messenger allowed-domain status;
- current Messenger Production binding readback;
- CSP / SDK resource / connect requirements on the actual host;
- official municipal CMS link insertion capability and target behavior;
- authorized live runtime validation after hosting.
