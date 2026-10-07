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

## Official TRS asset placeholder

The logo page publishes these agency assets:

- Color GIF preview:
  https://www-ws.gov.taipei/001/Upload/public/Attachment/531715114910.gif
- Color GIF download (page uses HTTP; use verified HTTPS):
  https://www-ws.gov.taipei/001/Upload/public/Attachment/53171512338.gif
- Logo with agency text:
  https://www-ws.gov.taipei/001/Upload/336/relpic/16016/4092/dbd1f0c1-640c-45bc-bcfa-b72e3a350869.png
- Current official header background, from `sys_detail.css`:
  https://www-ws.gov.taipei/001/Upload/336/sites/pagebackimage/3e3dd9d8-60ab-484b-805f-4281fd31cb27.png

The cloud proxy returned 403 for the GIF preview and text-logo PNG. A network
draft adding `www-ws.gov.taipei` while preserving `tpctax.gov.taipei` was saved;
it requires the user to save the change in environment settings before retry.
No TRS logo bytes are currently in the repository. The header's plain agency
name is the documented temporary asset placeholder; it is not a replacement
logo or a claim that official branding is complete.

The generic `/Images/major_logo.png` fallback was also inspected. It contains
Taipei City Government identity, not the required TRS mark, and was therefore
not added to this repository or used in the page.

Once accessible, download a suitable official TRS asset unchanged to a local
`assets/` path, record its exact source/dimensions/SHA-256 here, add the image
to both static packages, and recheck the header at desktop/390px/320px.
