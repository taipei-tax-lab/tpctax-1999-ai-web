# FAQ 多候選結果呈現 — 2026-10-09

Scope: renderer only, from main cc233ae. Human-accepted FAQ Flow LIVE / USABLE
baseline carried forward; currentPage/backend/GA4 contract unchanged.

## Observed response, not guessed fields

Read-only backend handoff remains authoritative. Existing raw archive:
[1999faq_surface_directed_evidence_2026-10-09.zip](https://drive.google.com/file/d/1JLyWisJMZ-2D1_LvoYmww_9AtrhV6kft/view),
1,777,513 bytes, SHA `6af3f8d25d99edb31dfb43283bbcfa37b709254a515f6286048dc06638838537`.
CRC and all 22 suite raw-response hashes verified against backend report.
0/2/5 visible results match complete info-card count. Each nonzero response is:

```text
text intro
text "1. {official question}\n{complete official answer}\n{official URL}"
payload.richContent: [[{type: 'info', title, subtitle, actionLink}]]
... up to five pairs ...
text outro
text Rental guidance
```

Official SDK URL unchanged:
https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js
TLS-verified GET200, 536,519 bytes,
SHA `c4fea5a7f0e0769c55fcaabedd317f9f19124f9397f77bbb614c5053a9339f91`.
`processResponse` emits `df-response-received` with original `raw` and parsed
`data.messages`; nested richContent becomes `customCard.richElements` info objects.
This verifies shape, not a fresh hosted Messenger query.

Sanitized public Q01 text/cards fixture in tests excludes raw diagnostics, session
and conversation context. Original raw SHA:
`6b594d7d803e5508e57e1833f3a284ccad011f343bdf4e9f6f0c7a445034d6a3`.
New normalizer checks against all frozen22 raw cases PASS: count/order/title/full
answer/canonical URL exact, zero cases remain original fallback text.
**0 new Production queries; 0 CX/Rental mutations.**

## Contract and design

Optional `items[]` prefers validated existing info cards, with complete text
comparison when text exists. Full raw text remains in `answer`. Reliable known
per-message text fallback retains all middle answer lines; it never splits at
numbers inside an answer. Unknown/combined text stays complete generic fallback.
Partial/truncated cards cannot hide complete text. See [RESULT_CONTRACT](RESULT_CONTRACT.md).

Semantic ordered list: one `li.faq-result` per FAQ; original official question is
an `h3 > a`, with exact corresponding safe official URL. Complete answer uses
pre-wrap. Body text remains16px; padding top16px/bottom20px; adjacent results have
one neutral1px separator. White surface, no shadows, existing brand/reds unchanged.
FAQ source URL beneath the answer is omitted. Intro/outro and labeled Rental
link are outside the list. No frontend classifier, new SDK request or analytics.

| Same frozen five-FAQ response | Before | After |
| --- | ---: | ---: |
| Independent FAQ DOM containers | 0 | 5 |
| Original-title anchors | 0 | 5 |
| Standalone trailing FAQ URL strings | 5 | 0 |
| Separators between FAQs | 0 | 4 |
| Complete original official answers | 5 | 5 |

All five titles/answers/URLs match the fixture exactly; no numeric line splitting.
1280/390/320 visual checks confirm clear boundaries, accessible ordered-list/
heading/link semantics, no overflow, no reset, and Rental link outside list.

## Test and screenshot evidence

- Node37 PASS:30 result/config/transport +7 analytics;0 failures.
- Offline Chromium30 grouped PASS;0 page errors/forwarded external/Production.
- 1–5 items, raw/parsed/card-only, partial cards, unsafe/unapproved URLs, escaping,
  text-only/combined fallback, zero-result, full numbered multiline answers,
  replacement, all three widths, accepted clear/drafts/recovery and GA counts1/2/3.
- Same Q01 before/after replay: baseline detached cc233ae + current renderer;
  same public content and CSS/brand base, external requests blocked. After uses
  local SDK fixture; not a new live Production response or GA receipt proof.

Screenshots are outside Git at `/workspace/work/faq-items/browser/`.
Names, byte counts and SHA-256:

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `screenshots/production-replay-after-1280.png` | 236,456 | `5addeafb19edb90ac2fe03db45bd3bcf328955bb44105222ccd46824c0360e8b` |
| `screenshots/production-replay-after-320.png` | 183,595 | `b5788fe73f238e646a8cc8e19ad78ba595943656c7d613eb7fcee3388ba05a1c` |
| `screenshots/production-replay-after-390.png` | 181,766 | `32dce4c2a89f9fdb13cf6a202ff985b8481d8dc2f0b4220e9d8b3d57267ba3da` |
| `screenshots/production-replay-before-1280.png` | 293,936 | `d42c2b2484aefae1f40b5cc35a03e204eb47baac263408c30a30e432630acef3` |
| `screenshots/production-replay-before-320.png` | 238,848 | `e436e53cd91390be32f0590c6f8d235459cc2c51cedbb0978282cb484a020383` |
| `screenshots/production-replay-before-390.png` | 231,956 | `9641035363bc01103c0da9f3b64a7171f2f127c7f1c14ba1ccf8bba0393b1d87` |

Reproduce after screenshots: local static server, then
`python3 tests/phase7e3a_browser.py --base-url http://127.0.0.1:8790/ --output-dir <scratch>`.
The public fixture and actual normalizer are committed; browser script emits
`production-replay-after-{1280,390,320}.png`. Before captures used same fixture
with cc233ae's normalizeResult/renderResult and blocked SDK/GA traffic; result
heading is the public Q01 query, input/counter empty, no query sent.

Prepared visual archive:11 files (six PNG, offline browser report, shape audit,
normalizer audit, README, manifest),1,312,910 bytes,
SHA `be05834e575963956b3b1145f58d0944dcd7b8699b93c01510a6d1400fbeb7c2`.
Credential scan PASS. Drive upload was rejected by automatic approval review:
exact payload/destination was not explicitly authorized, including currentPage/
GA4 identifiers. **No file uploaded, no retry or indirect workaround**. Local
screenshots/hash records/reproducible tests remain available; deployment unaffected.

## Deployment / rollback

Current release evidence: [PAGES_DEPLOYMENT](PAGES_DEPLOYMENT.md),
operational [NEXT_TASK](../NEXT_TASK.md). Implementation/deployed SHA, Actions run,
package hash and hosted12-file byte parity recorded after deployment.
New actual Messenger visual confirmation remains separate from frozen replay and
previous human Flow LIVE acceptance. GA4 Realtime/DebugView receipt is non-blocking.

UI-only rollback, if needed: restore result-model/app/styles from cc233ae (same
per-query Flow routing), rebuild and deploy. Preserve config/transport/currentPage,
GA4, backend and Rental. No launch-critical defect observed; rollback not executed.
