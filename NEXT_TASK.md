# NEXT_TASK

## Status

**STOP — PRE-DEPLOYMENT PACKAGE VERIFIED; wait for review and IT mount readback.**

The authorized package/IT-handoff preparation is complete. No deployment,
official-page link change, live enablement, Production query or backend mutation
occurred. UI frozen; CX BACKEND LAUNCH READY; Gate 2A PASS; Gate 3 CONDITIONAL
PASS. First mount recommendation: **A, `liveEnabled=false`**.

## Deliverables

- `packages/hosting.zip` — production handoff, 210,849 bytes.
- `packages/hosting.sha256` — ZIP SHA-256:
  `5ed9830e1129b9a9a73adbcae4fd9cdda6558249c2ae09520a43b455f920e278`.
- `docs/IT_HANDOFF.md` — concise mounting/MIME/header/readback/rollback instructions;
  included in the ZIP alongside runtime files and `MANIFEST.json`.
- `docs/DEPLOYMENT_GATES.md` — whole-repo hostingUrl reference audit, arbitrary
  subpath evidence, A/B comparison and package verification.

Baseline: `950859846d20f5e5943a5c6dcda4873e34027083`.
All project/deployment documents read. `hostingUrl` is unused metadata; final
path selection requires no code change or rebuild. Runtime URLs are relative
except canonical official links and absolute SDK/resource identifiers.
Use any agreed directory path on `https://services.arpa.tpctax.dof.gov.taipei`,
with ending `/` (or explicit `index.html`) and preserved structure. Do not guess
the path, flatten the ZIP, inject a base tag or embed it in an iframe.

The packager now puts only the current IT document in the production ZIP;
older hosting/placeholder/project docs stay in the separate demo archive/source
for provenance. **Do not give demo.zip or the whole development checkout to IT.**
The production ZIP has 11 allowlisted files; no demo/test/tool/credential files.
The inactive demo import remains in frozen app.js and is not executed by index.
UI, config, transport, currentPlaybook/session and renderer bytes are unchanged.

## Completed checks

- Node: 10 PASS, no failure/skip.
- Offline Chromium on extracted demo at nested local path: 12 grouped checks
  PASS, zero page errors/external/Production requests, local synthetic SDK only.
- Extracted production: six directory/index entry cases across shallow,
  multi-level and Chinese/space paths, 18 viewport checks at 1280/390/320px.
  Local modules/CSS/images, MIME/status, return/brand URLs, disabled mode,
  strict CSP and overflow checks passed; no SDK/demo/external request.
- Nested-path SDK loader passed using a locally fulfilled stub, with original
  config.liveEnabled=false and unused in-memory hostingUrl metadata changed.
  No real Google/API/query traffic.
- ZIP CRC, exact production-file allowlist, manifest counts/hashes, source
  equality, all official image hashes and focused credential scan PASS.
- Hosting/demo repeat builds are byte-identical. Production ZIP/checksum are
  committed; demo/build/browser evidence: `/workspace/work/predeployment/`.

## Required next input

IT mounts the reviewed static package when separately agreed. After mounting,
request only the checklist in `docs/IT_HANDOFF.md`:

1. Complete final HTTPS URL, reachability/redirect/login requirements.
2. Mounted ZIP SHA-256/version, completion time and intact directory structure.
3. Actual page/config/CSS/image status, MIME, cache/security/CORS headers,
   including CSP + Report-Only (and any platform-injected meta CSP), XFO,
   Referrer/Permissions policy, COOP/COEP/CORP. Root headers are insufficient.

Then verify static hosting first. Live browser E2E needs a separately agreed
config-only live switch and explicit Production test authorization/window.
Changing path alone does not require a new ZIP; changing config.liveEnabled
does require a new config hash/manifest/versioned package or verified file
replacement, plus config/page cache invalidation. No frontend compilation.

Gate 3 closes on the actual live-enabled page: capture SDK/subresources,
connect destinations, CSP violations and real API preflight/CORS, then make
only evidence-backed IT adjustments. Do not add wildcard/unsafe-inline,
worker/frame/WebSocket/SSE origins or guess a regional REST endpoint.

Preserve the accepted binding/allowed-domain settings. Do not change UI,
integration/session/currentPlaybook/renderer/backend or liveEnabled without
the corresponding later authorization. After the live page passes, a normal
official 1999 hyperlink/button may be integrated; it is not installed now.
Rollback: remove/disable entry or restore previous static package and caches.
