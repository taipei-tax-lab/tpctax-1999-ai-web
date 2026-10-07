# V1.2 official-site visual references

Inspected on 2026-10-07, after syncing `main` at `abd800d`.

## Agency sources

- Official 1999 FAQ:
  https://tpctax.gov.taipei/News.aspx?n=BB8B93F0A49EAB80&sms=87415A8B9CE81B16
- Official logo-download page:
  https://tpctax.gov.taipei/cp.aspx?n=97DA1F76BC737417
- Official stylesheet:
  https://tpctax.gov.taipei/css/global.css
- Current header-image override:
  https://tpctax.gov.taipei/css/sys_detail.css

Both HTML pages and the stylesheets were fetched successfully over verified
HTTPS. Their HTML/CSS were also rendered locally with scripts removed and all
network requests blocked to inspect content-page styles. This is a static
reference capture, not a claim to reproduce the official site's full scripted
layout. No official scripts, Google API or Production Messenger were executed.

## Style decisions

| Official evidence | V1.2 treatment |
| --- | --- |
| `.sys-root`: Arial / 微軟正黑體, 16px, `#343434` | Arial / Microsoft JhengHei / 微軟正黑體, with PingFang TC fallback; 16px body and controls |
| `.simple-text.heading .ct h2`: 1.4em (22.4px at default size) | A single plain 26px desktop / 24px mobile unit heading; modest increase for standalone-page hierarchy |
| `.area-form.page-search .ct`: `#fafafa`, square form controls | Light gray form block, bordered textarea, 2px maximum panel/control corners |
| Page-search submit: `#ffc800` with `#1a1a1a`; hover `#cca000` | Small query button only; no gold page backgrounds or decorative bands |
| Content-link rule: `#067db8`; hover `#045b87` | Use the darker official `#045b87` throughout for readable underlined links and focus outlines |
| Neutral text, content separators and conventional lists/tables | White answer area, simple separators, neutral reference block; no shadows |

The V1.1 `#40596c` and its blue header band are removed. Example-question and
reset buttons are secondary underlined controls with 44px minimum heights.
The header/footer remain minimal; official navigation and footer content are
not copied. The demo fixture controls use neutral styling and retain their
explicit non-production label.

## Official TRS logo integration — 2026-10-07

Retrieved the official candidate files successfully after syncing `main` at
`1605f05`. The selected standalone TRS mark is now local in both headers.

| Field | Selected asset |
| --- | --- |
| Agency source page | `https://tpctax.gov.taipei/cp.aspx?n=97DA1F76BC737417` |
| Exact source URL | `https://www-ws.gov.taipei/001/Upload/public/Attachment/53171512338.gif` |
| Local filename | `assets/trs-logo.gif` |
| Dimensions | 1200 × 1200 pixels |
| Format / size | GIF89a, single frame, transparent background, 12,260 bytes |
| SHA-256 | `2ad2f6a09be0bc255a313fe14fd54586f4aa28394cc65cd736290dc420cffff5` |

The agency download page links the GIF over HTTP; it was retrieved from the
same exact host/path over verified HTTPS. The saved file is byte-for-byte
identical to the downloaded original. No conversion, cropping, recoloring,
redrawing or other image modification was performed.

Selection rationale: the standalone mark works next to the existing visible
`臺北市稅捐稽徵處` text in a compact white header. It avoids duplicating the text
of the wide wordmark and does not require changing the accepted V1.2 styling.
The candidate logo-with-text PNG and current header background were also
downloaded and visually inspected, but only the selected GIF is retained in Git.

Both HTML pages use `./assets/trs-logo.gif` with `alt="TRS"`, followed by the
visible agency name. CSS alone displays the full square image at 56px desktop /
44px mobile, with proportional automatic height and a 10px text gap. No remote
runtime image is loaded. Both static packages include the original GIF and its
manifest SHA-256. Palette, typography, form/result styling and functional code
remain on the accepted V1.2 baseline.

Local-only browser checks passed for both pages at 1280px, 390px and 320px:
image HTTP 200, natural 1200×1200 dimensions, correct rendered aspect/size,
adjacent agency identification, vertical alignment and no horizontal overflow.

### Official candidate sources

The logo page publishes these agency assets:

- Color GIF preview:
  https://www-ws.gov.taipei/001/Upload/public/Attachment/531715114910.gif
- Color GIF download (page uses HTTP; use verified HTTPS):
  https://www-ws.gov.taipei/001/Upload/public/Attachment/53171512338.gif
- Logo with agency text:
  https://www-ws.gov.taipei/001/Upload/336/relpic/16016/4092/dbd1f0c1-640c-45bc-bcfa-b72e3a350869.png
- Current official header background, from `sys_detail.css`:
  https://www-ws.gov.taipei/001/Upload/336/sites/pagebackimage/3e3dd9d8-60ab-484b-805f-4281fd31cb27.png

Earlier attempts returned proxy `CONNECT 403`. This blocker is resolved:
the color GIF download, logo-with-text PNG and current header background all
downloaded successfully on 2026-10-07. The temporary plain-text-only placeholder
has been replaced by the selected official TRS mark plus the existing name.

The generic `/Images/major_logo.png` fallback was also inspected. It contains
Taipei City Government identity, not the required TRS mark, and was therefore
not added to this repository or used in the page.

The official TRS integration is complete and awaits final Web ChatGPT screenshot
acceptance. This does not authorize deployment or establish live SDK/Production
behavior.
