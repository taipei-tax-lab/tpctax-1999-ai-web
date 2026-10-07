# PROJECT_STATE

Last updated: 2026-10-07

## Status

**V1.1 CONSERVATIVE VISUAL DRAFT VERIFIED — V1.2 REFERENCE-DRIVEN OFFICIAL-SITE ALIGNMENT PLANNED — NO LIVE DEPLOYMENT**

This repository owns the 1999 AI frontend, UI, static hosting package, demo, and frontend tests.

Dialogflow CX backend source of truth:

`taipei-tax-lab/dialogflow-cx-qa-framework`

## Migration baseline

- source repo main: `6d35d1a129a95126b7734100206e32bb58f25cc9`
- Phase 7E3A source/evidence commit: `5d58feed72b5758d93a943fca5c96536d71bd0f2`
- Drive review package: `1SZCna6cjEhl3TZeUfTLD790p-q6b4y49`

## Current implementation

- Static search-style page.
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
