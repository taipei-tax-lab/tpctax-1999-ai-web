# PROJECT_STATE

Last updated: 2026-10-08

## Status

**UI FROZEN — CLEAR INPUT ON ACCEPTED SEND IMPLEMENTED; LIVE UX/GA4 PENDING**

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
- Both header brand links navigate in the same tab to `https://tpctax.gov.taipei/`; canonical FAQ return link is unchanged.
- Direct gtag GA4 uses human-approved `G-S891SFSMBH`; only custom event is now `ai_query_submit`, one per accepted Messenger query including follow-up/post-reset. No analytics sessionStorage/tab guard. Immediate queue; gtag loader after core initialization at idle. Demo is analytics-disabled. Contract/tests/blockers: `docs/ANALYTICS.md`; controlled startup evidence: `docs/PERFORMANCE.md`.
- Earlier `assets/trs-logo.gif` retained unchanged as the original standalone-mark source.
- Shared CSS adds a slim official-red H1 marker and a smaller query-label marker; both text colors remain `#343434`.
- Intro removed; common-tax examples are plain clickable quoted text between textarea and submit, with red `您可詢問` and a restrained red query top rule.
- Ready state hides the idle panel. Reset appears only after a successful answer, labeled `清除前次問答，重新提問`; it uses the existing real session reset, clears/focuses input and hides again until another successful answer.
- Accepted Messenger sends now clear textarea/counter at the existing accepted pending-query boundary; submit/pre-acceptance failure preserves text. The immutable submitted query still supplies the answer heading. No new focus or session action.
- No custom backend.
- Dialogflow Messenger is the intended browser transport.
- `live-pages-candidate` fast-forwarded to `main`; `liveEnabled=true` production artifact deployed via Actions. Source guard confirms Pages `build_type=workflow`.
- hostingUrl remains placeholder metadata, unused at runtime; final IT path does not require rebuilding.
- First-turn initial Playbook is the 1999 FAQ Playbook.
- Generic answer rendering works without FAQ metadata.
- FAQ source card is optional progressive enhancement only.
- Official-site same-tab/new-tab/window behavior remains deliberately unspecified.
- No official-site deployment has occurred.
- Human Chrome evidence confirms Production FAQ answers, renderer/Rental parity and follow-up/real reset/post-reset PASS. 390px and blocking-error console/network checks are deferred, not blockers for this task. New GA4 live script/collection verification remains pending.

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

## Backend launch-ready external prerequisite

As of 2026-10-07, the CX backend is externally confirmed **CX BACKEND LAUNCH READY**.

Production backend composition:
- Router v1
- Rental Playbook v2
- 1999 FAQ Playbook v2
- Rental Tool v1
- FAQ Tool v1
- Production smoke: 6/6 PASS

This frontend repository remains the sole frontend source of truth. Do not reopen Playbook/Tool configuration work here. Remaining work is limited to Messenger Production binding verification, hosting/origin, allowed domain, CSP/resource loading, browser E2E, live enablement, and official 1999-page entry integration.

## UI freeze and deployment transition

Human review accepts the final UI. Treat the current visual/citizen interaction as frozen.

Deployment preparation now proceeds sequentially:

1. Hosting / URL discovery
2. Messenger allowed-domain preparation
3. CSP / resource-policy preparation
4. Production Environment binding verification
5. Controlled live frontend enablement
6. Authorized live runtime validation
7. Official 1999 FAQ entry integration

The current repository still contains:
- `liveEnabled=false`;
- placeholder `hostingUrl=https://REVENUE_SERVICE_HOST_PLACEHOLDER/1999-ai/`;
- no live deployment evidence;
- no Production Messenger runtime validation.

Gate 1 has confirmed the origin and hosting mechanism. The exact public path
remains pending; do not guess it or replace the hosting URL placeholder.

## Confirmed production hosting facts

Human-confirmed deployment facts:

- production hostname/origin will be `https://services.arpa.tpctax.dof.gov.taipei`;
- this is the same host family used by the existing Rental service;
- the Revenue Service IT team can add a button/link to the existing official 1999 page and point it to the standalone AI page;
- the frontend will be handed to IT as a static package and hosted on the Revenue Service's own server;
- no iframe or server-side application is required by the current frontend architecture;
- the final URL path is not yet known.

The remaining Gate 1 unknown is the exact public path under the confirmed host.
No candidate path is assumed; IT must confirm the final URL.

## Deployment Gate 2A audit — 2026-10-07

Synced `main` at `1847571b9c421d021de90e1ae87bff2a7107201c` and read the
seven requested documents. **Gate 2A PASS — no setting changes required.**

- Following login guidance, the user supplied current Console UI evidence for
  the correct project/location/agent. Messenger visibly selects **Production**.
- The user read the same agent's Production Environment resource:
  `projects/serviceagent-1150909/locations/asia-northeast1/agents/799426c1-ba69-49dc-85e4-5065985706e2/environments/a0c712e8-ab0c-4520-b100-d2abcfc85868`.
  The selected name and current name-to-ID readback establish that the bound
  Environment ID is `a0c712e8-ab0c-4520-b100-d2abcfc85868`, matching expectation.
- Current allowed-domain entries: `taipei-tax-lab.github.io` and
  `services.arpa.tpctax.dof.gov.taipei`. The target host is already present.
- Saved format is **hostname**, without scheme or path. No domain change
  and no final page path are needed for this readiness audit.
- Evidence is current user-provided Console screenshot/resource readback,
  not a successful authenticated API read in this agent environment.
  The embed snippet contains no Environment ID and is not binding proof.
- Direct API access was unavailable: no connected GCP identity/identified
  credential selector, and the regional API readiness probe hit proxy
  `CONNECT` HTTP 403 at 14:07:58 UTC. This was not a GCP IAM denial or query.
- Historical backend Console records dated 2026-10-01 show the same domain
  entries and Production display name; they are cross-checks, not current proof.
- Gate 1's final URL remains pending. Gate 2A PASS does not establish runtime
  routing/SDK/CSP readiness or authorize live enablement/deployment.

See `docs/DEPLOYMENT_GATES.md` for the UI transcription and evidence limits.
Only the three project documents changed. Frozen UI, frontend configuration
and CX/Production settings remain unchanged; `liveEnabled=false`.
No Production query or deployment occurred. Commit/push and STOP for review.

## Gate 2A review decision

Web review accepts Gate 2A as PASS:

- Messenger integration is bound to the expected Production Environment:
  `a0c712e8-ab0c-4520-b100-d2abcfc85868`;
- allowed domains already include:
  `services.arpa.tpctax.dof.gov.taipei`;
- no Messenger binding/domain mutation is required;
- final page path is not required for this hostname-level check.

Next work moves to CSP/resource-loading readiness. Do not reopen Messenger binding or allowed-domain work unless later live E2E disproves the current readback.

## Deployment Gate 3 audit — 2026-10-07

Synced `main` at `cbe29da4ea6e4eafbd44a042ba15e20040cafbcf` and read all
seven requested project documents. **BLOCKED on SDK/header access**; the frozen
local frontend CSP audit is complete.

- All production page modules/CSS/images are same-origin. No inline executable
  code/style, remote font, iframe, worker or custom browser API client in our code.
- Confirmed official SDK entry:
  `https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js`.
  SDK transitive resource/style requirements and actual connect destinations
  remain unverified; no wildcard/inline exception/API host was guessed.
- Root HEAD and public SDK GET were blocked at 22:24:50 +08:00 by environment
  proxy CONNECT HTTP 403 before reaching their origins. All agency security/CORS
  headers are UNVERIFIED, not absent; root headers would not establish the
  future AI path's policy even if available.
- Focused local Chromium CSP enforcement passed for disabled `index.html`
  and offline `demo.html`: zero CSP violations/errors/external requests;
  same-origin resource inventory and synthetic answer/reset worked.
- `docs/DEPLOYMENT_GATES.md` records exact local resources, a tested strict
  disabled-page CSP, the proven SDK script-source addition, missing evidence
  and IT actions. It does not claim a complete live CSP.
- Required next input: allow the confirmed host and `www.gstatic.com` in the
  environment network configuration (or supply current non-secret readback).
  No GCP credential/final path is needed to resume these reads.
- Final-path header compatibility and real API preflight/CORS/runtime behavior
  still require later hosting/authorized E2E.

Only three documentation files changed. Frozen frontend, `assets/config.js`,
`liveEnabled=false`, transport/session/renderers, Messenger integration/binding/
domain and all backend/Production contents remain unchanged. No Production
query or deployment. Gate 2A stays PASS. Commit/push and STOP for review.

## Gate 3 published-setting retry — 2026-10-07

The user reported applying/publishing settings and confirmed the intended
environment/network entries. At 22:46:16 +08:00, root HEAD and SDK GET still
failed at the proxy with CONNECT HTTP 403. Runtime observations are current and
restricted networking is enforced at desired/observed revision `8`, but custom
`allowed_hosts=[]` and neither requested hostname appears in the effective
policy or executor snapshot. No SDK/agency headers were read; Gate 3 remains
BLOCKED. The discrepancy between the user-reported configuration and observed
access requires the actual environment name/domain-list readback or current
non-secret SDK/header evidence. No Production query or configuration change.

The user subsequently requested a fresh session to continue Gate 3 and asked
for the GitHub handoff to be updated. `NEXT_TASK.md` now directs that session to
sync/read the project documents, verify actual refreshed network readiness,
resume only the SDK/root-header audit, and retain all frozen configuration and
no-query/no-deployment restrictions. New-session creation is not proof that
network access is fixed; Gate 3 stays BLOCKED until readback succeeds.

## Gate 3 Web review decision

Web review reclassifies Gate 3 from BLOCKED to **CONDITIONAL PASS**.

Reason:

- frontend-local CSP/resource requirements are fully audited;
- no wildcard, iframe, unsafe-eval, remote font, custom backend, or broad cross-origin allowance is required by the application code;
- the only proven external runtime entry is the official Dialogflow Messenger SDK at `www.gstatic.com`;
- exact Messenger connect/style/subresource behavior and actual production-path response headers are inherently best verified on the hosted candidate page;
- the failed reads were caused by the Codex Cloud environment proxy and are not evidence of a Revenue Service server or Messenger failure.

Therefore Gate 3 should not block preparing and handing a deployment candidate to IT.

Remaining conditions to close Gate 3:
1. host the candidate under the confirmed production origin;
2. inspect the actual page response headers;
3. capture real Messenger SDK/network/CSP behavior in browser;
4. apply only the exact CSP/resource allowances demonstrated by that evidence.

## Pre-deployment candidate package and IT handoff — 2026-10-07

Synced latest main at `950859846d20f5e5943a5c6dcda4873e34027083` on a fresh
working branch, preserving the previous session's unpushed local commit. Read
all project/deployment documents. **Package preparation complete; STOP for
review/IT readback. No deployment or Production query.**

- Whole-repo hostingUrl/placeholder search found seven baseline references:
  the sole config declaration and six document references. No runtime reader
  in app/transport/model/demo or tests/tools. The property is unused metadata;
  no asset/navigation/API/session/binding behavior depends on it. All locations
  and the code/path analysis are recorded in docs/DEPLOYMENT_GATES.md.
- IT may use any agreed HTTPS directory subpath on the confirmed origin without
  modifying code or rebuilding. HTML/imports/CSS/logo/background/brand link are
  relative; canonical return/source links and SDK URL are absolute. Preserve
  folders, ending slash/directory redirect or explicit index.html, and no injected
  base tag. The final public path is still not guessed.
- Recommend A, liveEnabled=false, for the first mount: establish static/MIME/
  actual-path header readiness with no SDK/API traffic; later authorize a
  config-only live switch and E2E. B skips one config delivery but exposes
  unverified live resource/header behavior at first mount. Both roll back by
  restoring static files/entry; A keeps the simplest disabled baseline.
- Final path alone requires no rebuild. A later live flag change needs updated
  config hash/manifest and a versioned ZIP or verified one-file replacement,
  with cache refresh, but no compilation or UI/backend change.
- New concise docs/IT_HANDOFF.md contains mounting, MIME, directory handling,
  URL/header/hash readback, normal-link entry, exact SDK entry and rollback.
  No wildcard/inline exception or iframe is proposed. Disabled hosting does
  not complete live CSP/CORS; later real browser evidence guides IT adjustments.
- Production packager now includes the current IT document with index/assets/
  manifest; older project/demo instructions are kept in the separate demo
  package/source. No demo-only file is present in production; the frozen app's
  inactive demo import is never selected by production index.html.
- Formal deliverable: packages/hosting.zip, 210,849 bytes, SHA-256
  `5ed9830e1129b9a9a73adbcae4fd9cdda6558249c2ae09520a43b455f920e278`;
  companion packages/hosting.sha256. Exactly 11 files: index, eight original
  assets (including all official images), IT handoff and manifest. No secret,
  credential, token, .git, tests/tools or demo fixture file. Routing IDs in
  config are non-secret identifiers; focused credential scans passed.
- Node: 10 PASS. Existing offline Chromium against extracted demo on a nested
  path: 12 grouped checks PASS, zero page errors/external/Production requests.
- Extracted production: six directory/index entry cases under shallow,
  multi-level and Chinese/space paths; 18 viewport checks at 1280/390/320px.
  Correct local status/MIME/resources, links, logo, disabled state, no overflow
  and strict disabled CSP passed, zero violations/errors/external requests.
- SDK loader nested-path check used only an intercepted synthetic SDK;
  original config.liveEnabled remained false. Unused hostingUrl sentinel did
  not affect SDK loading. No real SDK/API/query request; no live proof claimed.
- ZIP CRC, exact allowlist, manifest bytes/hashes, source equality and official
  asset hashes passed. Two builds are byte-identical for hosting and demo.
  Evidence outside Git: /workspace/work/predeployment/. Only production ZIP/
  checksum are committed; no demo/browser evidence is uploaded.

Frozen HTML/CSS/JS/config/assets/session/currentPlaybook/renderer are unchanged.
CX BACKEND LAUNCH READY, Gate 2A PASS and Gate 3 CONDITIONAL PASS remain.
IT must return the real URL, deployed ZIP hash and actual-path status/MIME/cache/
security headers; then agree a separate live config switch/Production E2E window.
No website, Messenger domain/binding, backend or live flag was changed. Commit/
push and STOP; do not mount, enable or query automatically.

## Human deployment-path decision — GitHub Pages first

The human owner supersedes the previous disabled-first mount recommendation.

New shortest-path decision:

1. integrate/enable Dialogflow Messenger in the frozen production frontend;
2. deploy the exact production handoff contents to GitHub Pages for real browser / Production Messenger E2E;
3. use the already-allowed host `taipei-tax-lab.github.io`;
4. after E2E passes, hand the same production package to Revenue Service IT for
   hosting under `services.arpa.tpctax.dof.gov.taipei`;
5. then validate the agency-hosted URL and add the normal official 1999 entry link.

Important:
- GitHub Pages must deploy only the production package contents, not the full repo/demo/tests.
- The production frontend is path-independent and can run under a GitHub Pages project subpath or an arbitrary agency-server subpath.
- `hostingUrl` is unused metadata and must not be used to derive runtime URLs.
- Allowed domains already include both `taipei-tax-lab.github.io` and
  `services.arpa.tpctax.dof.gov.taipei`.
- Messenger remains bound to the verified Production Environment.
- This decision authorizes a controlled Production Messenger browser test from GitHub Pages; it does not reopen CX Playbook/Tool configuration.

## Human trusted-browser evidence and renderer defect — 2026-10-08

The owner opened the deployed GitHub Pages URL in normal Chrome and successfully
received a real Production 1999 FAQ answer. This supersedes the Codex Cloud
browser's inability to trust its proxy CA as evidence about basic page/Messenger
reachability.

Human evidence establishes:
- GitHub Pages production page loads;
- live Messenger initializes sufficiently for a real query;
- query submission works;
- a real FAQ response returns non-empty content.

Two presentation defects are confirmed in the custom frontend:
1. Markdown `**bold**` is displayed literally because the renderer deliberately
   uses text nodes and does not parse Markdown.
2. Markdown `[label](URL)` is not rendered as a linked label; the raw URL is
   exposed and the URL is subsequently duplicated in the ordinary source list.

Required fix is frontend renderer parity, not a CX Playbook rewrite. Implement a
safe minimal Markdown subset (bold + HTTP(S) links) using DOM nodes and suppress
ordinary source entries already represented inline.

Rental cross-surface rule:
the shared FAQ answer may surface in the Rental experience, which uses official
Dialogflow Messenger. Official Messenger text responses support Markdown bold
and Markdown links. After the custom 1999 renderer is fixed, verify one Rental
FAQ-route answer. Do not mutate the launch-ready backend unless direct Rental
evidence shows native rendering is not correct.

## Trusted-browser renderer and Rental parity acceptance — 2026-10-08

Owner-provided normal Chrome evidence verifies the deployed renderer fix and cross-surface parity.

1999 AI:
- literal Markdown bold markers are gone;
- section headings render with emphasis;
- the official detail title is the clickable link label;
- raw destination URL is hidden;
- duplicate ordinary source entry is absent in the tested answer.

Rental:
- native Conversational Messenger renders bold text correctly;
- native linked-label rendering is correct;
- no equivalent duplicate raw-URL presentation is visible.

Decision:
- custom 1999 renderer parity PASS;
- Rental cross-surface parity PASS;
- no CX backend/Playbook/Tool mutation required.

Remaining pre-IT trusted-browser checks are limited to same-session follow-up,
real reset/post-reset query, 390px live layout and a blocking-error console/network check.

## Trusted-browser session acceptance — 2026-10-08

The owner additionally confirms in normal Chrome:

- same-session follow-up works;
- real session reset works;
- a new post-reset query returns normally.

These close the core live session/reset checks. The 390px live-layout and
Console/network blocking-error checks are intentionally deferred and are not
treated as current blockers.

## Final small frontend decisions

1. The upper-left Revenue Service brand/logo must link to the official agency
   homepage: `https://tpctax.gov.taipei/`, not back to the standalone AI page.

2. Add minimal GA4 measurement:
   - direct GA4 gtag integration, not GTM for this task;
   - automatic page view may remain;
   - exactly one custom event: `ai_question_start`;
   - fire once per browser page/tab session when the first valid question is
     actually accepted for sending;
   - follow-ups and reset/post-reset questions in the same tab session must not
     increment this event;
   - never send question, answer, source, inferred tax topic, identifier or
     contact-information content to GA4;
   - analytics failure must never block the AI query path.

The human owner has supplied the approved GA4 Web Data Stream Measurement ID:
`G-S891SFSMBH`. This ID is non-secret and may be used in the frontend analytics
configuration. GA4 live activation is therefore authorized for the current task.

## Analytics semantics revision + performance direction — 2026-10-08

Human decision supersedes the previous once-per-tab analytics contract.

New GA4 meaning:
- count every valid query that is actually accepted/sent to Messenger;
- follow-up queries count separately;
- post-reset queries count separately;
- reset/example clicks/invalid submissions do not count;
- do not send user-entered question/answer/source content.

Preferred custom event name is `ai_query_submit` because the metric now means
**total query submissions**, not unique people or one question-start visit.

Reporting terminology:
- `page_view` = page views;
- custom query event count = 查詢次數;
- do not label raw custom-event count as unique people/發問人次.

The same task also authorizes a narrow startup-performance review and small
evidence-backed optimizations only. No framework/bundler/service-worker/CDN
migration or major UI/architecture rewrite is authorized. Priority is to avoid
non-critical GA4 work competing with core page/Messenger startup while preserving
current UX and frozen visuals.

## Query input clear-after-send decision — 2026-10-08

Human UX decision:

After a valid query is accepted by Messenger for sending, the query textarea
should clear immediately and the character counter should return to zero. This
makes follow-up entry easier.

Important boundary:
- do not clear on mere button/form submit;
- clear only at the existing accepted `df-request-sent` boundary;
- preserve the submitted question separately so the result area can still show it
  when the answer returns;
- if send fails before acceptance, retain the typed question for retry;
- reset remains a separate explicit session action.

This should be implemented as a minimal frontend-only change. It must not alter:
CX backend, Playbook/Tool routing, MessengerTransport/session semantics,
renderer/Markdown behavior, per-query GA4 meaning (`ai_query_submit`), or the
accepted GA4 startup deferral/performance behavior.

## Backend contract

- project: `serviceagent-1150909`
- location: `asia-northeast1`
- agent: `799426c1-ba69-49dc-85e4-5065985706e2`
- initial 1999 Playbook: `projects/serviceagent-1150909/locations/asia-northeast1/agents/799426c1-ba69-49dc-85e4-5065985706e2/playbooks/f0512949-95f2-40c6-95d0-0c139b84b542`
- expected Production Environment: `a0c712e8-ab0c-4520-b100-d2abcfc85868`

Environment binding is integration-side and must not be guessed from HTML attributes.

## Open deployment items

- exact public path / full hosting URL (origin already confirmed);
- Gate 3 CONDITIONAL PASS; actual hosted live-page SDK/network/CSP/CORS
  validation remains pending and does not block this package handoff;
- final official 1999 link target and window behavior (normal link/button confirmed);
- authorized live runtime validation after hosting.


## Live Pages candidate execution — 2026-10-08

Synced `main` at `bcb49fcd34fd2420c31ed98df4eafc6465e8b270` and executed
`NEXT_TASK.md` within explicit human deployment/E2E authorization.
Prepared candidate changes only runtime `assets/config.js` `liveEnabled=true`.
UI, other config fields, session/currentPlaybook/reset, transport/model/renderer,
all official assets, CX backend and integration/domain/binding remain unchanged.

Pages already exists. Prior successful run
[37700742476](https://github.com/taipei-tax-lab/tpctax-1999-ai-web/actions/runs/37700742476)
checks out `main` and builds Jekyll from repository root; its uploaded artifact
includes demo/tests/tools/docs. Deploy logs confirm public URL
`https://taipei-tax-lab.github.io/tpctax-1999-ai-web/`. This source cannot safely
publish this live candidate while satisfying the production-only requirement.
No checked-in workflow was overwritten. New official Actions workflow checks
Pages `build_type=workflow`, rebuilds/compares/verifies the committed production
ZIP and uploads only its exact extracted contents. Settings must first switch
Pages Source to GitHub Actions; available connector cannot administer Pages and
direct Pages API read is Forbidden.

Candidate is isolated and pushed on `live-pages-candidate`; `main`/existing Pages
publication remains the synced baseline. No live-candidate deployment occurred.
Runtime restricted networking also blocks the Pages hostname: Chromium document
GET fails `net::ERR_TUNNEL_CONNECTION_FAILED`; HEAD gets proxy CONNECT 403. No
origin headers/CSP/CORS/SDK/connect evidence and **0 Production queries**.
`dialogflow.cloud.google.com` and `fonts.googleapis.com` HEAD are similarly
blocked. No proxy bypass or network/security widening was performed.

Candidate package: 211,148 bytes, SHA-256
`c19ad3e5ebfc5d3a97c45aaf1cdd3f36dec33cf2b854b59d5be35335c57a4ebd`.
Node 10 PASS; offline Chromium 12 grouped PASS; extracted live-config candidate
6 local subpath cases / 18 viewport checks using synthetic SDK only PASS.
Integrity/11-file allowlist/manifest/source parity/official assets/credential scan
and deterministic double builds PASS. New verifier rejects extra demo files,
stale config and synthetic credentials. Offline disabled-state test explicitly
injects that fixture while live bootstrap uses the candidate config.

Gate 3 retains **CONDITIONAL PASS** for prior local audit; Pages live validation
is **BLOCKED**, and IT release readiness is **NO**. Required next inputs are Pages
source migration and effective environment hostname access, followed by exact
artifact deployment and the still-unchecked minimal real-browser E2E. Agency
final path remains IT's decision and does not require rebuilding. No official
1999 entry is added. Checklist and completion summary are in `NEXT_TASK.md`.
STOP for Web ChatGPT review; do not reopen backend or weaken CSP.


## Resumed Pages deployment — 2026-10-08 (Asia/Taipei)

Owner switched Source to GitHub Actions. Resumed `f0a239488a6f52ddea0aa91b97efd44fe84105f6`,
fast-forwarded to main, and completed [37714645831](https://github.com/taipei-tax-lab/tpctax-1999-ai-web/actions/runs/37714645831).
Source guard, configure/build/package verification and deploy all PASS.
Actual URL: `https://taipei-tax-lab.github.io/tpctax-1999-ai-web/`. Hosted 11-file ZIP parity PASS;
demo/test/tool/repo-internal exclusion probes 404. Existing offline checks and
frozen runtime remain unchanged. Current deployment/run/hash details are in
`docs/PAGES_DEPLOYMENT.md`; initial ZIP hash is
`c19ad3e5ebfc5d3a97c45aaf1cdd3f36dec33cf2b854b59d5be35335c57a4ebd`.

Pages/SDK and API-root verified HTTPS are reachable in the current environment.
Actual Pages/SDK security headers captured. Chromium's document GET fails
`ERR_CERT_AUTHORITY_INVALID` under Cloud proxy CA; workspace NSS import did not
resolve trust. Fonts hostname probe gets proxy CONNECT 403. No TLS/proxy bypass.
**0 Production queries**, no initialized Messenger or browser connect inventory.
This supersedes the prior source-migration blocker without declaring live E2E
PASS or a demonstrated frontend failure. Gate 3 CONDITIONAL PASS; IT-ready NO.
Unchecked F/G remain for trusted-browser validation. Handoff document refresh
produces an updated candidate archive with identical runtime bytes. No official
entry link or backend mutation. Commit/push and STOP per `NEXT_TASK.md`.


Final documentation artifact deployment confirmed: Actions run
[37715179426](https://github.com/taipei-tax-lab/tpctax-1999-ai-web/actions/runs/37715179426),
deployed SHA `0247ad4b14f2069707ae969832db6960c2db01f9`, success at
2026-10-08 09:54:08 Asia/Taipei. Current candidate ZIP SHA-256
`bc5faed14477cf3eafc390a2889c0ee559c37cdecf0a24ba951d70d73fb9fe65`
(211,729 bytes). Final hosted 11-file byte parity and exclusion probes PASS.
Subsequent reporting-only commit is branch HEAD, not a new deployed artifact;
runtime/ZIP unchanged. Gate 3 / E2E / IT-ready decisions above remain unchanged.


## Safe renderer parity implementation — 2026-10-08

Resumed main `88b14f699216bc1f7a2669216d33285fc7948e99` per NEXT_TASK.
Only result-model normalization/rendering changes at runtime: semantic bold,
safe labeled HTTP(S) Markdown links, preserved ordinary wording/line breaks,
bare-link navigation and ordinary inline-source deduplication. Raw HTML stays
inert text; unsafe/incomplete links/images remain literal. No new dependency.
Additional explicit citations and optional FAQ metadata remain supported.

Node 14 PASS; offline Chromium 17 grouped PASS, including synthetic screenshot
scenario at desktop/390/320px, hostile input, metadata/generic replacement and
unchanged session/reset/currentPlaybook regression. No offline external or
Production requests. HTML/CSS/config/app/transport/demo and all CX resources
remain unchanged. Current package/deployment/live evidence is maintained in
NEXT_TASK and docs/RENDERER_PARITY.md. Formal IT release remains pending full
trusted-browser and Rental parity evidence.


Renderer production deployment confirmed: run
[37722000091](https://github.com/taipei-tax-lab/tpctax-1999-ai-web/actions/runs/37722000091),
deployed SHA `815178f0463be854b7a08ca7a95bf78bdae55d33`, 11:17:38 Asia/Taipei.
ZIP `4abde0ae04a749b1e8ca8a6a7136d7f3f1adb80d6ea6d8ece05be672ba018d2a`
(212,951 bytes), all 11 hosted bytes match; exclusions 404. Runtime change is
renderer only. Rental native Conversational Messenger/Production integration
confirmed through immutable frontend/backend source evidence and hosted HTML;
new FAQ rendering parity is not yet established.

Post-deployment real Chromium at both actual URLs stops before origin response
with ERR_CERT_AUTHORITY_INVALID under Cloud proxy; zero Production queries.
All newly requested trusted-browser format/session/mobile/network and Rental
acceptance remains pending. Gate 2A PASS / Gate 3 CONDITIONAL PASS unchanged;
IT-ready NO. Necessary result-contract/IT/checklist/deployment docs updated.
Final reporting-only main commit does not change deployed SHA/ZIP. STOP for
Web ChatGPT review; no backend/UI/session/integration mutation.

## Brand link and minimal GA4 implementation — 2026-10-08

Resumed latest main `9ca632ef53cd85b43116b157dab51f90ad30be82` and read required
project documents under AGENTS.md. Carried-forward human Chrome renderer,
Rental native parity, follow-up, real reset and post-reset acceptance stay PASS;
older pending statements above are historical. 390px and blocking-error
console/network checks remain deferred, not blockers for this task.

Both header links now use the official same-tab agency homepage with unchanged
logo/layout/accessibility/FAQ return link. Config uses exactly the human-approved
`G-S891SFSMBH`. A local external module boots direct official gtag, enables
page_view and emits only the no-parameter `ai_question_start` event after the
existing Messenger transport accepts the first valid user request. sessionStorage
prevents follow-up/reset/refresh inflation; storage-denied fallback guards only
the current document. Demo is analytics-disabled; GA failures never block queries.
No renderer, CSS, transport/reset/routing, Messenger binding/domains or backend
changes. Reporting/privacy/resource contract: `docs/ANALYTICS.md`.

Node 19 PASS; offline Chromium 19 grouped PASS with intercepted SDK/gtag,
0 forwarded external/Production requests. Official gtag probe at 12:54:12
Asia/Taipei gets proxy CONNECT 403, no origin response. Live GA4 script/collect
verification remains PENDING; collection hosts are unobserved and no wildcard
CSP proposal is added. Production package now has 12 files. Deployment/package
evidence and remaining live blocker are maintained in NEXT_TASK and
docs/PAGES_DEPLOYMENT.md. GA4-verified IT-ready NO pending live network evidence;
agency final path still needs its own headers confirmation. No official entry
link is added. Commit/push and STOP for Web ChatGPT review.

Brand/GA4 production artifact deployment PASS: [Actions run 37730302359](https://github.com/taipei-tax-lab/tpctax-1999-ai-web/actions/runs/37730302359),
deployed SHA `9cd6aabad0862b34127211e98550e9b987aefcc7`, 13:01:49 Asia/Taipei.
Pages URL `https://taipei-tax-lab.github.io/tpctax-1999-ai-web/`.
ZIP 215,048 bytes, SHA-256
`526239f69199a5b94370a04a034dc9b477e4eeae58b4c3f4e62a80fc458ee086`;
12/12 hosted files match and six exclusions return 404. Actions source guard,
Node 19, deterministic rebuild/committed ZIP/manifest/source/credential checks
and both jobs PASS. Post-deployment Chromium at 13:02:19 still stops before
origin with proxy `ERR_CERT_AUTHORITY_INVALID`, no page JS and 0 Production
queries/observed GA4 collection requests. GA4 live checkbox stays unchecked.
Final docs-only commit is main HEAD, not a new deployed SHA or changed ZIP;
commit/push and STOP for Web review.

## Per-query GA4 and startup ordering — 2026-10-08

Resumed latest main `198bab784fd34dc94982ece217fd5e7fbc336341` under AGENTS.md.
Human-approved semantics supersede earlier tab-session count: only
`ai_query_submit` is emitted, once per accepted query; first/follow-up/post-reset
all count, examples/invalid/reset/unsolicited/cancelled requests do not. No custom
parameters or question/answer/source content. Per-request WeakSet protects only
repeated SDK notification; tab/storage guard removed. Analytics failure never
blocks queries; later queries still attempt events after an earlier GA failure.

Immediate gtag queue retains early page/query events. Official async loader moves
to core initialization finally, then bounded idle/timer fallback. SDK remains
eager and never awaits GA. Only app/analytics runtime bytes change; no UI/CSS/
HTML/image/config, renderer, transport/session/routing/binding/backend mutation.
No new external origin. IT_HANDOFF is unchanged per current task's resource/CSP-
only update rule; its older count description is historical, ANALYTICS is current.

Controlled serial rotated seven-run comparison: median button ready
727.6→721.9ms, FCP 364→356ms, DCL 518.6→513.2ms. Overlapping ranges, no material
speed gain/field LCP claim. Verified GA request before ready 7/7→0/7; five local
JS requests unchanged, JS grows 418 bytes. Four modulepreloads were rejected:
first paint 364→424ms. Baseline/applied screenshots at 1280/390/320px have zero
changed pixels. Exact sizes/conditions/waterfall/tool: docs/PERFORMANCE.md.

Node 21 PASS; offline Chromium 22 grouped PASS, zero real external/Production
requests and page errors. Deterministic two builds, exact 12-file ZIP/manifest/
source/credential checks PASS. Production ZIP 215,196 bytes, SHA-256
`768190825d260b95d18af44e15ffdabfaa95557b245cf57ad5d18fe34520acc6`.
Extracted production subpath/directory/index/1280/390/320 checks: 18 PASS with
accepted event counts 1/2/3 and unchanged session/routing. Existing human
renderer/Rental/session PASS remains accepted.
Offline/package/deployment and current live blocker are recorded in NEXT_TASK
and PAGES_DEPLOYMENT. GA4 network/receipt remains PENDING under Cloud access/trust;
no guessed collection hosts or CSP changes. Commit/push and STOP for Web review.

Per-query/deferral production deployment PASS: [run 37743130011](https://github.com/taipei-tax-lab/tpctax-1999-ai-web/actions/runs/37743130011),
deployed SHA `49ade8ed9904b8f5f379fe5e1d61ff40ba4e6fca`, 2026-10-08 15:23:50
Asia/Taipei, URL `https://taipei-tax-lab.github.io/tpctax-1999-ai-web/`.
Source guard/build/deploy and Actions Node 21/package checks PASS; artifact
`11534411703`. Hosted 12/12 bytes match, six exclusions 404. Fresh gtag at
15:24:14 gets proxy CONNECT 403 (curl 56), and real deployed Chromium at 15:24:38
gets ERR_CERT_AUTHORITY_INVALID before origin/page JS; 0 Production queries,
0 observed GA4 collection requests. All current live analytics checks remain
PENDING/unchecked, not FAIL. Formal GA4-verified IT-ready NO; no new resource/
CSP/backend mutation. Final report-only main commit changes no ZIP/runtime or
deployed SHA; push then STOP waiting for Web ChatGPT review.

## Clear input after accepted send — 2026-10-08

Resumed latest main `4f0fff232c31269b5d7661bf1ec5b79845db5e8f` under AGENTS.md.
Only two app.js lines added after the existing accepted pending-request guard:
clear textarea and dispatch input to reset the existing counter. The submit
handler's captured trimmed query, which is the actual sent text, still supplies
result heading after answer. No clear at form submit or pre-acceptance failure.
Duplicate notifications do not clear a newly typed draft; a later answer also
leaves that draft alone. No new focus change; explicit real reset remains intact.

Node 21 PASS; offline Chromium 24 grouped PASS with controlled delayed acceptance/
answer and async rejection. First/follow-up/post-reset clear/counter, original
question heading, example/invalid/throw/cancel preservation, accepted empty/error,
draft retention, GA 1/2/3/no-content, session/currentPlaybook/renderer/mobile/IME/
idle/scoped CSP regressions PASS. Zero real external/Production requests.
Runtime analytics/config/transport/renderer/HTML/CSS/images, CX resources and
startup scheduling unchanged; no dependency/new origin. Analytics/performance/
IT handoff docs deliberately unchanged per conditional scope. Package/deployment
and live pending evidence maintained in NEXT_TASK/PAGES_DEPLOYMENT. No official
entry change. Commit/push then STOP for Web ChatGPT review.
