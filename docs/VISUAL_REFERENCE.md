# Official-site visual reproduction references

Current revision: **high-fidelity official 1999 page language**, inspected on
2026-10-07 after syncing `main` at `8cdf9332845ecaf42eb1af238da2e980be1e2935`.
This supersedes the earlier V1.2 interpreted visual baseline.

## Authoritative sources and inspection

- Official 1999 FAQ:
  https://tpctax.gov.taipei/News.aspx?n=BB8B93F0A49EAB80&sms=87415A8B9CE81B16
- Official logo publication page:
  https://tpctax.gov.taipei/cp.aspx?n=97DA1F76BC737417
- Official shared CSS:
  https://tpctax.gov.taipei/css/global.css
- Official page CSS:
  https://tpctax.gov.taipei/css/page.css
- Current agency image overrides:
  https://tpctax.gov.taipei/css/sys_detail.css

Fetched the HTML, CSS and agency images over verified HTTPS (HTTP 200).
Unlike the earlier script-free reference approximation, this inspection ran
normal official layout scripts with only cached/allowlisted static GET assets
from `tpctax.gov.taipei` and `www-ws.gov.taipei`. Third-party scripts and all
POST/API requests were blocked. No form was submitted, no Production question
was sent, and no official-site state or integration setting was modified.
Replayed the 70 cached static resources offline to measure rendered styles,
hover states and geometry at 1280px, 390px and 320px.

CSS SHA-256 at inspection:

| File | SHA-256 |
| --- | --- |
| `global.css` | `12114d3a65b6220877c814124681c41429fa1afb3ed9adeaf9005a8f249771a6` |
| `page.css` | `13f322f99ba4936deca24bbffb09dbf1048be25ff922fa6a88e008a4d095c783` |
| `sys_detail.css` | `da09f3c1505dd41eccff45409b57463de9461256c431cfc0e434478a74bb1af3` |

## Directly reproduced values

| Actual official selector / evidence | Standalone application |
| --- | --- |
| `.sys-root`: `Arial,"微軟正黑體修正","微軟正黑體","Helvetica Neue",Helvetica,sans-serif,"新細明體"`; 16px; `#343434` | Same font stack, size and primary text color. Copied local-only glyph correction for U+7DB0/U+78A7/U+7B75; no remote font. |
| `.base-header .info`: white; inner width 1000px; measured default desktop height 107.469px | White identity row, same inner width and measured desktop height; no utility search or global menu. |
| `.simple-text.major-logo .ct a`: width 350px, approximately 80px container, `background-size:contain` | Original official header PNG rendered proportionally at 350×74.667px, centered vertically in an 80px brand link. Upper-left at x=140 on a 1280px viewport, matching the reference. |
| `.sys-root>.in`, with `sys_detail.css` override: `#fff3f4`; official city image; `no-repeat center top`, size `auto` | Same color, unchanged local city artwork and background positioning. |
| `.simple-text.heading .ct h2`: 1.4em = 22.4px, weight 400, `#343434`, padding 3px, margin 0 | Same values for the single `1999 AI 智慧問答` H1 on desktop and mobile. The measured official title is gray, not red. |
| `.base-content>.in`: 1000px; native primary FAQ white column 748px outer / 728px inner; content padding 10px, top gap 15px, bottom gap 30px | Header/footer retain the 1000px shell. The native primary content width, padding and gaps are copied; centered because the unrelated 216px sidebar is omitted. |
| `.base-content .info`: `1px solid #e4e4e4`, bottom margin 8px | Same separators and compact spacing above the form and around reference content. |
| `.area-form.page-search .ct`: `#fafafa`, padding 5px, top margin 5px; fieldsets margin 5px | Same surface/padding/margins; normal-weight 16px labels. Textarea replaces the official short keyword inputs for natural-language questions. |
| `.sys-root` text controls: white, square, padding `5px 8px`, border `1px solid #e4e4e4` | White/square/padding reproduced; textarea edge deliberately darker for accessibility, as recorded below. |
| Page-search submit: `#ffc800`, `#1a1a1a`, 16px regular, padding 8px; hover `#cca000` | Same normal colors/type/padding and hover background. Left-aligned below the textarea; no arrow decoration. |
| Page-search reset: `#646464` with white text | Same secondary treatment for the existing reset action; behavior unchanged. |
| FAQ table content links: inherited `#343434`, underline; hover `#de313c`, no underline, 150ms transition | Same content-link and source-link treatment, replacing the previous blue interpretation. |
| FAQ table header: `#d4222d`, white bold text, padding 8px; cells `1px solid #e4e4e4`; alternating surface `#f5f5f5` | Existing result heading and answer/query/reference containers use these native colors, borders and padding through CSS only. No renderer changes. |
| Official footer separator: red `#de313c` | Red separator plus simple agency identification only; no full footer modules. |
| Official small-screen shell breakpoint: 768px; identity row 48px; logo image fitted proportionally | Same breakpoint/height and 225×48px image. Centered across the header because the unrelated 48px menu control is omitted. |
| Mobile content: 8px outer margins, 10px white content padding | Same 354px inner width at 390px / 284px at 320px. Title remains 22.4px. |

No general-purpose official CSS/JS is shipped. Only the relevant shared visual
rules and the two original images are used. Full navigation, sidebar, site
search, sharing toolbar, satisfaction survey and large footer are omitted.
The canonical `返回本府1999常見問答` anchor is retained in the content-navigation
row. The demo-only fixture controls remain explicitly labeled non-production.

## Unchanged local official assets

### Selected current header identity

| Field | Value |
| --- | --- |
| Evidence | Current official FAQ header and `sys_detail.css` major/minor-logo override |
| Source URL | `https://www-ws.gov.taipei/001/Upload/336/sites/pagebackimage/3e3dd9d8-60ab-484b-805f-4281fd31cb27.png` |
| Local filename | `assets/trs-header.png` |
| Dimensions / format / bytes | 1200 × 256 pixels / PNG RGBA / 28,256 bytes |
| SHA-256 | `c89e58ab3e545c5ae1bc3b5ed5b8ef903821fb52b6b433397be7bc5f1e3d79f5` |

Selected because it is the identity actually displayed by the current agency
website: formal TRS mark, Chinese agency name and English agency name together
on the original cyan tile. It reproduces the official composition more faithfully
than placing the standalone mark next to newly typeset text. Both HTML pages use
this local image. The full Chinese agency name is clearly visible inside the
original image, and adjacent agency-name text remains available in the brand
link's accessible name without visually duplicating the official wordmark.

### Current official page background

| Field | Value |
| --- | --- |
| Evidence | `sys_detail.css` `.sys-root>.in` background override |
| Source URL | `https://www-ws.gov.taipei/001/Upload/336/sites/pagebackimage/d11eeeb6-8065-453a-9dca-adee781252b2.png` |
| Local filename | `assets/official-page-bg.png` |
| Dimensions / format / bytes | 1919 × 581 pixels / PNG RGBA / 159,311 bytes |
| SHA-256 | `129823f9e980a0e44b945d86fe2a3053fb88e35f908cdda25bdddc2410dd4b1a` |

Both assets are byte-for-byte copies of the official downloads: no conversion,
cropping, redrawing, recoloring or distortion. All runtime image URLs are local.
The hosting and demo packages include both images and per-file manifest hashes.

### Retained prior official standalone mark

`assets/trs-logo.gif` remains unchanged for provenance, but is no longer the
rendered header identity. Published on the official logo page; retrieved from
`https://www-ws.gov.taipei/001/Upload/public/Attachment/53171512338.gif`
(the publication uses HTTP; download uses verified HTTPS).
1200×1200, transparent single-frame GIF89a, 12,260 bytes;
SHA-256 `2ad2f6a09be0bc255a313fe14fd54586f4aa28394cc65cd736290dc420cffff5`.
The original agency asset remains in both packages. The generic municipal
`/Images/major_logo.png` is not the TRS identity and is not used.

## Documented accessibility / functional differences

Per `AGENTS.md`, retain accessibility where exact source styling would regress it:

- Keep visible buttons and the return link at least 44px high rather than the
  official default 32px query/reset controls.
- Keep the textarea edge `#888` rather than `#e4e4e4` (3.40:1 against `#fafafa`).
- Keep dark `#1a1a1a` query text on the official `#cca000` hover background
  (7.12:1); the source switches to low-contrast white text.
- Retain the source's dashed focus shape but use `#045b87` instead of cyan
  `#21cec3` for a clearly visible focus indicator.
- Keep the natural-language textarea resizable and answer paragraphs at 1.7
  line height, with safe wrapping of questions/source URLs. Skip link, visible
  form labels, live regions, result focus target and reduced-motion handling
  remain intact. No external fonts are introduced.

Normal/hover text colors passed focused contrast checks (at least 4.5:1),
including gray links, red hover links (4.55:1), white result headings (5.16:1)
and gray reset buttons (5.92:1). This is not a full accessibility audit.

## Offline review evidence

Evidence root outside Git:
`/workspace/visual-review/fidelity-2026-10-07/`.

- Start with `desktop-idle.png` for the hosting appearance, then
  `desktop-review.png`, `mobile-390-review.png`, `mobile-320-review.png` for
  generic multi-source results; `desktop-faq-review.png` shows FAQ enhancement.
- Corresponding mobile idle captures: `mobile-390-idle.png`, `mobile-320-idle.png`.
- `reference/official-1280.png`, `official-390.png`, `official-320.png` are the
  controlled official reference captures.
- `reference/detailed-styles.json`, `computed-styles.json`,
  `resource-manifest.json` and `reference-network.json` record source evidence.
- `node-tests.txt`: 10 passed. `browser/browser_validation.json`: existing nine
  Chromium checks passed, zero external requests/page errors/Production requests.
- `visual_validation.json`: both pages at all three widths, local logo/aspect,
  CSS values and hover, 44px controls, keyboard skip link, return link and no
  horizontal overflow; 320px at 200% text size also passed.
- `contrast_validation.json`: focused text/control/focus contrast results.
- `packages/hosting.zip`, `packages/demo.zip`, `packages/package_summary.json`:
  deterministic packages with the local images; repeat builds match exactly.

Messenger transport, one-shot Playbook/session/reset/expiry/timeout logic,
normalized results, answer/source/FAQ renderer, demo logic and existing tests
remain unchanged. `liveEnabled=false`. Stop for Web ChatGPT visual review;
no live runtime verification or Production deployment is implied.
