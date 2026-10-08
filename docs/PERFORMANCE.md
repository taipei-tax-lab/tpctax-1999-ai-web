# Startup performance evidence — 2026-10-08

## Baseline and scope

Baseline: latest main `198bab784fd34dc94982ece217fd5e7fbc336341`, with runtime
artifact deployed as `9cd6aabad0862b34127211e98550e9b987aefcc7`.
Verified HTTPS GETs of production HTML, five modules, CSS and two active images
all returned 200 and matched the committed ZIP. Captured responses used
`max-age=600`, correct MIME and no Content-Encoding in those responses.
Real Cloud Chromium/GA4 timing is unavailable because of proxy CA trust and
GA hostname access; these are **local controlled startup measurements**.

| Payload | Before bytes | After bytes |
| --- | ---: | ---: |
| index.html | 3,035 | 3,035 |
| styles.css | 7,956 | 7,956 |
| app.js | 4,650 | 4,921 |
| analytics.js | 1,549 | 1,696 |
| config.js | 1,128 | 1,128 |
| result-model.js | 7,191 | 7,191 |
| messenger-transport.js | 5,235 | 5,235 |
| trs-header.png | 28,256 | 28,256 |
| official-page-bg.png | 159,311 | 159,311 |
| retained trs-logo.gif (not requested at runtime) | 12,260 | 12,260 |
| Total local runtime JS | 19,753 | 20,171 |

Module graph remains HTML → deferred module app.js → config/result-model/
Messenger/analytics modules. CSS blocks first render; official local header and
background images are eager. The header already has explicit 1200×256 dimensions.
No remote font/image, demo/test/dev request or framework/runtime server dependency
exists in production. Two known external bootstrap scripts are Messenger at
www.gstatic.com and GA4 at www.googletagmanager.com; their actual further live
resources remain unverified. Previously gtag was requested before Messenger
readiness, competing for the startup network/CPU budget despite being async.

## Applied changes

Only analytics.js and its app wiring change at runtime. The gtag queue stays
available immediately, including sanitized page_view configuration. Network
loading moves after core initialization settles, then to browser idle with a
1500ms timeout / zero-delay timer fallback. Messenger startup is still immediate;
there is no await of GA4, submit-time SDK load, renderer/session/backend change,
HTML/CSS/image modification or added external host. Analytics handles each
accepted query with the new `ai_query_submit` meaning.

No preconnect/dns-prefetch is added: no TLS setup improvement can be established
with these locally fulfilled external fixtures. Modulepreload was measured and
rejected as below. Existing image dimensions and normal loading are retained;
no measured image-decode bottleneck warrants extra priority hints. Official image
bytes remain identical. No bundler/framework/service worker/CDN/router or inline
critical-CSS change is introduced.

## Serial rotated comparison

`tools/measure_startup.py` runs a fresh 1280×900 Chromium context per sample,
cache disabled, local HTTP assets under CDP emulation (80ms latency,
200,000 bytes/s download). External SDK/gtag are locally fulfilled fixtures;
the SDK emits ready after 200ms, gtag has no real collection/CPU workload.
Seven rounds rotate and run baseline/applied/experimental preload **serially**.
0 real GA/Production requests. Timings are medians in milliseconds:

| Metric | Baseline | Applied GA deferral | Experimental four modulepreloads |
| --- | ---: | ---: | ---: |
| Query button ready | 727.6 | 721.9 | 596.7 |
| DOMContentLoaded | 518.6 | 513.2 | 377.3 |
| First contentful paint | 364 | 356 | 424 |
| Observed local LCP | 548 | 540 | 532 |
| Samples with GA request before query readiness | 7/7 | **0/7** | 0/7 |
| Local JS requests per page | 5 | 5 | 5 |

Ready ranges overlap (baseline 718.2–740.0ms, applied 709.1–742.1ms). The 5.7ms
median readiness reduction is within noise; **no material speedup or field LCP
improvement is claimed**. The verified improvement is moving one non-critical
external loader out of the pre-ready stage in all seven samples, with no extra
local request, no missed early queue event and no measured median slowdown.
Local JS grows 418 bytes; transfer-size reduction is not claimed.

The experimental four same-origin modulepreloads start imports in parallel with
app.js and improve readiness, but delay first paint by 60ms versus baseline
(364→424ms). They are not committed. The final small change avoids that regression.
A separate one-module exploratory run also did not establish a first-paint
benefit; no modulepreload is shipped.

Example waterfall (one representative sample, not medians): baseline app starts
121.5ms, imports start about 308.9ms, SDK starts 527.3ms, GA request at 536.4ms
while button is disabled. Applied app starts 106.7ms, imports start about 276.1ms,
SDK starts 510.5ms, GA request at 721.2ms with button already enabled. The module
graph remains unchanged; only the GA readiness ordering is intentionally altered.

## Reproduction and regression evidence

Serve snapshots under any local directory URL: baseline from git archive
`198bab7`, applied runtime from deployed `49ade8e` (current main has the same
runtime). Optional experimental snapshot
adds modulepreload links for config.js, result-model.js, messenger-transport.js
and analytics.js; all other candidate bytes match applied runtime.

```sh
python3 tools/measure_startup.py --base-url http://127.0.0.1:8773/ --variants baseline deferred preloaded --runs 7 --output work/comparison.json
```

The original raw samples/screenshots remain outside Git under
`/workspace/work/query-performance/`; these summarized evidence and the tool are
committed. Scratch snapshot names are local test fixtures, not hosting paths.

- Baseline/applied ready-state screenshots at 1280×900, 390×844 and 320×700:
  **zero changed pixels** and no horizontal overflow. HTML/CSS/official images
  are byte-identical too; original responsive/renderer/session checks remain.
- Node 21 PASS; offline Chromium 22 grouped PASS. It validates first/follow-up/post-reset queue counts,
  early events before idle, eventual official loader, loader/send exceptions,
  and a scoped local CSP fixture with no blocking JS/CSP error. Live Google
  CORS/CSP cannot be inferred from those fixtures.
- Extracted package: shallow/deep/encoded Chinese-space paths × directory/index
  entry × 1280/390/320px = 18 viewport cases PASS, with 1/2/3 query events and
  original first-turn/follow-up/reset routing; no extra runtime asset/request.
  Exact manifest/repeat-build and hosted deployment results are in NEXT_TASK/
  PAGES_DEPLOYMENT. No cache/security policy weakening,
  new external resource or dependency is needed for the applied optimization.

Deployed result: [Actions 37743130011](https://github.com/taipei-tax-lab/tpctax-1999-ai-web/actions/runs/37743130011),
SHA `49ade8ed9904b8f5f379fe5e1d61ff40ba4e6fca`, 15:23:50 Asia/Taipei. Production
ZIP 215,196 bytes, SHA-256
`768190825d260b95d18af44e15ffdabfaa95557b245cf57ad5d18fe34520acc6`;
12/12 hosted byte parity PASS, exclusions 404. Field/live load timings remain
unavailable: fresh browser at 15:24:38 stops at document GET with proxy
ERR_CERT_AUTHORITY_INVALID; fresh gtag probe at 15:24:14 gets CONNECT 403.
No actual Google script execution/collection/Production query is inferred.
