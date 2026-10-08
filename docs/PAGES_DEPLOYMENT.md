# GitHub Pages production artifact deployment

Current deployment record (2026-10-08, Asia/Taipei): **per-query GA4 + deferred startup artifact
deployment PASS; human renderer/Rental/session PASS; live GA4 PENDING;
Gate 3 CONDITIONAL PASS; GA4-verified IT release ready NO**.
Operational acceptance checklist: [NEXT_TASK.md](../NEXT_TASK.md).
Earlier renderer deployment: run
[37722000091](https://github.com/taipei-tax-lab/tpctax-1999-ai-web/actions/runs/37722000091),
deployed SHA `815178f0463be854b7a08ca7a95bf78bdae55d33`, ZIP SHA-256
`4abde0ae04a749b1e8ca8a6a7136d7f3f1adb80d6ea6d8ece05be672ba018d2a`.
Renderer implementation history: [RENDERER_PARITY.md](RENDERER_PARITY.md).
Later human acceptance in PROJECT_STATE/NEXT_TASK supersedes its live blockers.
The earlier deployments below remain historical evidence.

## Latest per-query GA4 and startup deferral deployment

Resumed main `198bab784fd34dc94982ece217fd5e7fbc336341` under AGENTS.md.
Custom event now only `ai_query_submit`, one per accepted first/follow-up/
post-reset query. gtag queue is immediate; official loader waits until core
initialization settles, then bounded idle/timer fallback. Only app.js and
analytics.js runtime payloads change. No UI/image/config/renderer/session/
Messenger binding/domain/backend or new resource-origin change.

| Evidence | Value |
| --- | --- |
| Actions run | [37743130011](https://github.com/taipei-tax-lab/tpctax-1999-ai-web/actions/runs/37743130011) |
| Deployed SHA | `49ade8ed9904b8f5f379fe5e1d61ff40ba4e6fca` |
| Source/configure/build/deploy | PASS / PASS / PASS / PASS |
| Deployment success | 2026-10-08 15:23:50 Asia/Taipei (07:23:50 UTC) |
| Pages URL | <https://taipei-tax-lab.github.io/tpctax-1999-ai-web/> |
| github-pages artifact | `11534411703` |
| Production ZIP size | 215,196 bytes |
| Production ZIP SHA-256 | `768190825d260b95d18af44e15ffdabfaa95557b245cf57ad5d18fe34520acc6` |

Source guard confirms `build_type=workflow`. Actions runs Node 14 existing + 7
analytics tests PASS, deterministic two builds, committed ZIP equality/checksum,
exact 12-file allowlist/CRC/manifest/source/credential verification, then uploads
only fresh extraction. Both build/deploy jobs PASS. Local Chromium 22 grouped
PASS and 18 extracted arbitrary-subpath/viewport cases PASS use synthetic
external scripts; they do not establish actual GA/Production delivery.

Controlled startup comparison is in [PERFORMANCE.md](PERFORMANCE.md): before-ready
GA requests 7/7→0/7; ready median 727.6→721.9ms is within noise, not a material
speedup claim; 1280/390/320 screenshots have zero changed pixels. Experimental
modulepreloads were rejected for a first-paint regression and are not deployed.

Post-deployment verified HTTPS GETs at 15:24:38 Asia/Taipei: all 12 files 200,
byte-identical to ZIP, correct runtime MIME and approved ID/new event wiring.
Six demo/test/tool/repo-internal probes return 404. Captured document headers:
ACAO `*`, HSTS `max-age=31556952`, Cache-Control `max-age=600`; no CSP/
CSP-Report-Only, X-Frame-Options, Referrer-Policy, Permissions-Policy or COOP/
COEP/CORP in that response. Agency final path headers cannot be inferred from it.

Live verification **PENDING**: official gtag probe at 15:24:14 receives Cloud
CONNECT 403 (curl 56), before origin. Real deployed Chromium 151 at 15:24:38,
390×844, inherited proxy/TLS verification enabled and no mocked network, stops
at document GET with `ERR_CERT_AUTHORITY_INVALID`. Zero origin browser responses,
no page JS/SDK/gtag execution, **0 Production queries and 0 observed analytics
collection requests**. Actual page_view/query counts/payload/GA failure behavior
cannot be validated here; all seven live checklist items remain unchecked.
No trust/proxy bypass or guessed wildcard/connect-src/CSP expansion.

Known SDK and gtag bootstrap origins remain unchanged. IT_HANDOFF is byte-identical
under the task's conditional resource/CSP update rule; its earlier count paragraph
is historical, current semantics are in [ANALYTICS.md](ANALYTICS.md). Carried human
renderer/Rental/session PASS remains valid. Formal GA4-verified IT-ready NO pending
trusted-browser live evidence; agency final URL still needs separate headers
readback. No official entry or backend change.

Final reporting-only commit updates NEXT_TASK, PROJECT_STATE, ANALYTICS,
PERFORMANCE and this record; it changes no production payload/ZIP and triggers
no second deployment. Main HEAD is distinct from deployed SHA. Scratch evidence
stays outside Git under `/workspace/work/query-performance/`. Push then STOP
for Web ChatGPT review.

## Earlier brand-link and minimal GA4 deployment

Resumed latest main `9ca632ef53cd85b43116b157dab51f90ad30be82` under AGENTS.md.
Preserved accepted renderer/Rental/session behavior and the frozen UI/CX binding.
Both brand links now navigate to the official agency homepage; configured
human-approved direct GA4 ID `G-S891SFSMBH`. Analytics contract and live blocker:
[ANALYTICS.md](ANALYTICS.md). No backend or official-site entry mutation.

| Evidence | Value |
| --- | --- |
| Actions run | [37730302359](https://github.com/taipei-tax-lab/tpctax-1999-ai-web/actions/runs/37730302359) |
| Deployed SHA | `9cd6aabad0862b34127211e98550e9b987aefcc7` |
| Source/configure/build/deploy | PASS / PASS / PASS / PASS |
| Deployment success | 2026-10-08 13:01:49 Asia/Taipei (05:01:49 UTC) |
| Pages URL | <https://taipei-tax-lab.github.io/tpctax-1999-ai-web/> |
| github-pages artifact | `11529761004` |
| Production ZIP size | 215,048 bytes |
| Production ZIP SHA-256 | `526239f69199a5b94370a04a034dc9b477e4eeae58b4c3f4e62a80fc458ee086` |

Existing source guard proves `build_type=workflow`; no Pages setting change is
needed. Actions rechecks Node 14 existing + 5 analytics tests PASS, two independent
builds, committed ZIP equality/checksum, exact 12-file allowlist, CRC/manifest,
source-byte parity and credential scan. Upload/deploy use only freshly extracted
production files. Local offline Chromium has 19 grouped PASS; its SDK and gtag
were intercepted fixtures with no real Production/GA requests.

Post-deployment HTTPS GET verification, TLS enabled, completed at 13:02:25
Asia/Taipei: all 12 files HTTP 200 and byte-identical to committed hosting.zip.
Correct HTML/module/CSS/PNG/GIF/JSON MIME; deployed brand href, analytics.js and
exact ID in config verified. Six probes (demo.html, demo/mock-messenger.js,
tests/analytics.test.mjs, tools/package_static.py, AGENTS.md, workflow) return 404.
Captured Pages document response: ACAO `*`, HSTS `max-age=31556952`, cache
`max-age=600`; no CSP/CSP-Report-Only, X-Frame-Options, Referrer-Policy,
Permissions-Policy or COOP/COEP/CORP in this captured response. These are HTTP
retrieval facts, not browser GA4/CORS/session evidence or agency-host headers.

Real Chromium 151, 390×844, inherited Cloud proxy, no network mock/TLS bypass,
at 13:02:19 Asia/Taipei stops before an origin response with
`net::ERR_CERT_AUTHORITY_INVALID` at the document GET. Page JS never runs;
**0 Production questions and 0 observed GA4 collection requests**. Separate
official gtag URL probe at 12:54:12 receives Cloud CONNECT 403, before origin.
Known required additional script origin is `https://www.googletagmanager.com`;
actual loader subresources/collection hosts are unobserved. IT handoff records
only this exact bootstrap fact and blocker, with no speculative connect-src or
wildcard rule. This does not establish a Pages, GA4, SDK, CSP or CORS failure.

GA4 live loader/page_view/one-question event delivery is PENDING; its checkbox
stays unchecked. Earlier trusted human renderer/Rental/follow-up/reset/post-reset
PASS is carried forward. 390px and blocking-error console/network remain deferred,
not blockers for the current task. Formal GA4-verified IT-ready NO; agency final
path still needs independent headers confirmation after mounting.

Final reporting-only commit updates NEXT_TASK, PROJECT_STATE, ANALYTICS and
this record. It changes no ZIP payload and does not trigger another deployment;
branch HEAD must be distinguished from the deployed SHA above. Scratch reports
remain outside Git under `/workspace/work/ga4-polish/`; durable results are here.
Commit/push then STOP for Web ChatGPT review.

## Source and first deployment

Resumed existing `live-pages-candidate` at
`f0a239488a6f52ddea0aa91b97efd44fe84105f6`, a descendant of main baseline
`bcb49fcd34fd2420c31ed98df4eafc6465e8b270`. Owner had changed Pages Source to
GitHub Actions. Fast-forwarded the exact candidate to main; no completed
implementation work was repeated.

Direct Pages administration API remains Forbidden. The existing workflow's
fail-closed `gh api .../pages` comparison to `build_type=workflow` succeeded
under Actions' pages-read permission, followed by configure-pages success.
This verifies the source migration without modifying Pages settings.

| Evidence | Value |
| --- | --- |
| Initial Actions run | [37714645831](https://github.com/taipei-tax-lab/tpctax-1999-ai-web/actions/runs/37714645831) |
| Workflow | `.github/workflows/pages.yml` — Production package Pages |
| Initial deployed SHA | `f0a239488a6f52ddea0aa91b97efd44fe84105f6` |
| Source/build/deploy | PASS / PASS / PASS |
| Deployment success | 2026-10-08 09:47:50 Asia/Taipei (01:47:50 UTC) |
| Pages URL | <https://taipei-tax-lab.github.io/tpctax-1999-ai-web/> |
| Initial github-pages artifact | `11523054017` |
| Initial ZIP size | 211,148 bytes |
| Initial ZIP SHA-256 | `c19ad3e5ebfc5d3a97c45aaf1cdd3f36dec33cf2b854b59d5be35335c57a4ebd` |

Build logs confirm Node 10 tests PASS; two independent builds and committed
ZIP compare; checksum, exact 11-file allowlist, manifest/source-byte parity and
credential scan PASS. Uploaded directory is a fresh extraction of hosting.zip,
not repository root. Official upload-pages-artifact/deploy-pages actions succeed.

All 11 hosted files returned HTTP 200 and matched initial ZIP bytes, including
MANIFEST.json and packaged IT handoff. HTML/JS/CSS/PNG/GIF/JSON MIME are correct.
Exclusion probes returned 404 for demo.html, demo/mock-messenger.js,
tests/phase7e3a.test.mjs, tools/package_static.py, AGENTS.md and the workflow.

## Documentation artifact refresh

IT_HANDOFF.md is a ZIP payload. It now accurately reports deployed status and
browser blocker, so the candidate was rebuilt deterministically twice and
verified against source. This is a documentation archive refresh, not a
conditional E2E-PASS formal IT release. All nine runtime payloads (index.html
and eight assets) remain byte-identical to the first deployed candidate.

- Updated candidate ZIP: 211,729 bytes.
- SHA-256: `bc5faed14477cf3eafc390a2889c0ee559c37cdecf0a24ba951d70d73fb9fe65`.
- Exact 11-file allowlist, CRC/manifest/source-byte/credential checks: PASS.
- Final documentation artifact deployment: PASS (see below). This report is
  not a production ZIP payload.

## Available HTTPS evidence

Retrieved through inherited Cloud proxy with TLS verification enabled.
Pages document and official SDK script HTTP 200; curl explicitly reports
`SSL certificate verify ok` for the Pages certificate issued by the
configured environment proxy CA. This is HTTPS retrieval evidence, not a
browser SDK initialization result.

| Response | Relevant observed headers |
| --- | --- |
| Pages document | Content-Type `text/html; charset=utf-8`; ACAO `*`; HSTS `max-age=31556952`; Cache-Control `max-age=600` |
| Pages document: absent in captured response | CSP, CSP-Report-Only, X-Frame-Options, Referrer-Policy, Permissions-Policy, COOP, COEP, CORP |
| Official SDK script | Content-Type `text/javascript`; ACAO `*`; nosniff; CORP `cross-origin`; COOP `same-origin; report-to="dialogflow-console"`; Cache-Control `no-cache, must-revalidate` |
| SDK Report-Only | `require-trusted-types-for 'script'; report-uri https://csp.withgoogle.com/csp/dialogflow-console` |

Known SDK URL retrieved:
`https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js`.
Separate HEAD to `https://dialogflow.cloud.google.com/` returned 200; its root
headers are not Messenger API/query/CORS evidence. At 09:50:32 Asia/Taipei,
`https://fonts.googleapis.com/` HEAD returned proxy CONNECT 403 (curl 56), before
origin. Fonts was not observed as a browser SDK request; do not assume necessity
or infer the actual Messenger endpoint from this host probe.

## Live browser blocker and gate decision

Chromium 151, real deployed URL, 390×844 viewport, inherited proxy, no synthetic
SDK/network fulfillment. Attempts at 09:48:20 and 09:49:33 Asia/Taipei stop at
document GET with `net::ERR_CERT_AUTHORITY_INVALID`, with zero browser origin
responses. A workspace-local NSS database import of the supplied public
proxy CA with XDG_DATA_HOME did not resolve Chromium trust. No global
certificate-ignore option or proxy bypass was used.

**Production queries: 0.** Page JavaScript never executed. Messenger
initialization, enabled button, initial Playbook routing, first/follow-up/reset/
post-reset answers, browser resource/connect inventory, CSP/CORS/console and
mobile live layout remain unverified. HTTPS file parity cannot replace those
checks. HTTP retrieval hosts observed: taipei-tax-lab.github.io and
www.gstatic.com; API root was only probed separately. Browser observed only
the failed Pages document request; no connect destinations observed.

This is a Cloud browser trust limitation, not demonstrated Pages/SDK/binding/
frontend/origin CSP-CORS failure. Keep remaining F/G acceptance checks unchecked.
Use a browser that trusts the execution proxy CA, or an ordinary trusted human
browser, to complete the authorized minimal three-question sequence and collect
actual SDK/connect/CSP/CORS/session evidence. Do not weaken production policy,
change CX/Messenger binding/allowed domains, or add the official entry link.
Agency final path/security headers still require their own validation.

Small scratch reports/headers remain outside tracked source under
/workspace/work/tpctax-pages-resume; durable results are recorded here and in NEXT_TASK.md. No Drive
upload or message to others was performed. Commit/push then STOP for review.


## Final deployed artifact

| Evidence | Value |
| --- | --- |
| Actions run | [37715179426](https://github.com/taipei-tax-lab/tpctax-1999-ai-web/actions/runs/37715179426) |
| Deployed SHA | `0247ad4b14f2069707ae969832db6960c2db01f9` |
| Source/build/deploy | PASS / PASS / PASS |
| Deployment success | 2026-10-08 09:54:08 Asia/Taipei (01:54:08 UTC) |
| Pages URL | <https://taipei-tax-lab.github.io/tpctax-1999-ai-web/> |
| github-pages artifact | `11523566263` |
| ZIP size | 211,729 bytes |
| ZIP SHA-256 | `bc5faed14477cf3eafc390a2889c0ee559c37cdecf0a24ba951d70d73fb9fe65` |

Final hosted GET verification: all 11 files HTTP 200 and byte-identical to the
updated archive, including new IT_HANDOFF.md and MANIFEST.json; all six exclusion
probes still 404. The runtime is unchanged from the first deployed candidate.
Final run rechecks Node tests, deterministic build/committed archive/checksum,
manifest/source/credential validation and production-only upload. Both jobs PASS.

Subsequent reporting-only commit updates NEXT_TASK, PROJECT_STATE and this file;
it is not a new artifact deployment and does not change any ZIP payload or hash.
Both main and live-pages-candidate receive the reporting commit. Preserve the
deployed SHA above when distinguishing branch HEAD from deployed artifact.
