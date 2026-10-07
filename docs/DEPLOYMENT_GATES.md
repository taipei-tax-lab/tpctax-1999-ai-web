# DEPLOYMENT_GATES

## Gate 1 — confirmed by human

Verified:

- Production origin: `https://services.arpa.tpctax.dof.gov.taipei`
- Hosting owner: Taipei City Revenue Service IT team
- Delivery model: static frontend package hosted on the agency server
- Official 1999 page can add a normal hyperlink/button to the standalone page
- No iframe or custom backend is required by this frontend

Remaining unknown:

- exact public path / final full URL beneath the confirmed origin

**PARTIALLY PASSED** — origin and hosting model confirmed; exact path pending.
Final `hostingUrl` must wait for IT's full URL. No candidate path is assumed.

## Gate 2A — Production Messenger binding / allowed-domain audit

Audit date: 2026-10-07. Synced frontend baseline:
`1847571b9c421d021de90e1ae87bff2a7107201c`.

**Gate 2A PASS — Production binding and allowed-domain readiness verified from
current user-provided Console readback. No setting changes required.**

### Current UI evidence

After login guidance, the user supplied a current Dialogflow CX Console
integration screenshot and its generated embed code in this conversation.
The screenshot's URL identifies:

- project `serviceagent-1150909`
- location `asia-northeast1`
- agent `799426c1-ba69-49dc-85e4-5065985706e2`

The active Dialogflow Messenger dialog visibly reads:

- **Environment: Production**
- **Allowed domains:**
  - `taipei-tax-lab.github.io`
  - `services.arpa.tpctax.dof.gov.taipei`

This is current user-provided UI readback, not a successful authenticated API
read from the agent environment. The source screenshot remains in the review
conversation; the non-secret settings are transcribed here. The user also read
the same agent's Production Environment resource:

```text
projects/serviceagent-1150909/locations/asia-northeast1/agents/799426c1-ba69-49dc-85e4-5065985706e2/environments/a0c712e8-ab0c-4520-b100-d2abcfc85868
```

Together, the selected Environment name and its current name-to-ID readback
establish the expected binding. Access mode is not shown in the screenshot and
is not inferred from the embed code.

| Check | Result |
| --- | --- |
| Actual selected Environment display name | `Production` — verified in current UI |
| Actual bound Environment ID | `a0c712e8-ab0c-4520-b100-d2abcfc85868` |
| Expected Production ID | `a0c712e8-ab0c-4520-b100-d2abcfc85868` |
| Exact ID match | **YES / PASS**, same project/location/agent and expected ID |
| Current allowed-domain entries | The two hostnames listed above |
| Target hostname present | **YES / PASS** |
| Saved domain format | **Hostname**, no scheme, port or page path in either entry |
| Domain change required | **None** |
| Final public path needed for this domain check | **No** |

The screenshot demonstrates the saved hostname representation for this
integration, not every alternative syntax the UI might accept. Do not add an
origin/scheme, wildcard or path to the existing entries.

The generated embed code matches the project/location/agent but contains no
Environment ID or allowlist. Its lack of an Environment attribute is not proof
of Draft binding. The integration Console supplies the binding display name;
the user's current Environments resource readback resolves that name to the
expected ID. No authenticated API read succeeded in this environment.

### Gate decision and minimal proposal

The target host is already allowed; **no domain setting change is needed**.
The final AI-page path is not needed to complete this hostname-level check.
It remains necessary for Gate 1's final URL and later hosting configuration.

Overall Gate 2A is **PASS**: the current Production resource matches the
expected ID and project/location/agent. The minimal change is **none** for
both binding and domain. No integration or Environment mutation is needed.
The audit can complete without knowing the final path.

Passing this audit does not establish runtime routing/SDK/CSP readiness,
authorize live enablement, or complete later deployment gates.

### Next human input / STOP

No further credential or domain input is required for this completed UI audit.
IT still needs to provide the final public path/full URL for Gate 1. Hosting
CSP/resource-policy evidence is a later Gate 3 task, not executed here.
STOP after commit/push and wait for review or an explicit next-gate instruction.

### Direct environment access limitation

The initial direct-read route was unavailable:

- Managed runtime reported current observations, enforced restricted networking,
  no connected secret bindings/runtime variables/outbound identities.
- No GCP manifest/credential selector or standard ADC file was available;
  `gcloud` was not installed. This does not rule out another user-specified mount.
- At 2026-10-07 14:07:58 UTC, an unauthenticated HTTPS HEAD to
  `https://asia-northeast1-dialogflow.googleapis.com/` failed with proxy
  `CONNECT` HTTP 403 (curl exit 56, envoy), before reaching Google.
  This was neither a GCP IAM denial nor a Production query.
- The network policy excludes that API and `oauth2.googleapis.com`.
  Direct future reads need an existing ready GCP identity and the necessary
  allowed API/refresh hosts through the environment configuration workflow.
  No credential contents, token or authorization code should be sent in chat.

The user-provided Console readback resolves domain evidence despite this direct
access limitation. No agent login or credential installation was performed.

### Historical cross-check

Backend commit `2f8205c78d62c3e7196f2e818a0edce10dae820b` contains:

- [2026-10-01 Console cutover record](https://github.com/taipei-tax-lab/dialogflow-cx-qa-framework/blob/2f8205c78d62c3e7196f2e818a0edce10dae820b/docs/PHASE6A_PRODUCTION_CUTOVER_2026-10-01.md)
- [Matching structured report](https://github.com/taipei-tax-lab/dialogflow-cx-qa-framework/blob/2f8205c78d62c3e7196f2e818a0edce10dae820b/reports/phase6a_production_cutover_2026-10-01.json)

These historical records show Production, anonymous access and the same two
hostname entries, but do not independently establish the current Environment ID.
The current UI evidence above, not history, supports this domain PASS.
OAuth Authorized JavaScript origins are a separate control and are not used to
infer this Messenger allowlist's format.

### Scope and verification

Only `PROJECT_STATE.md`, `docs/DEPLOYMENT_GATES.md` and `NEXT_TASK.md` changed.
Frontend config/frozen UI/transport/session/renderers and CX/Production settings
are unchanged. `liveEnabled=false` remains. No Production query or deployment.
Documentation diff/whitespace, unchanged executable files and the config
invariant are checked before commit. Node/Chromium suites need no rerun for
docs-only work.
Commit/push and STOP for review; do not advance later gates automatically.


## Gate 3 — CSP / SDK / resource-loading readiness audit

Audit date: 2026-10-07 (Asia/Taipei). Synced baseline:
`cbe29da4ea6e4eafbd44a042ba15e20040cafbcf`.

**CONDITIONAL PASS — local frontend requirements are verified; live SDK dependency / connection inventory and actual hosted-page headers remain deployment-time verification conditions.** This is an
environment access blocker, not evidence that the agency server rejects Messenger.

### Evidence and scope

Inspected `index.html` and every production module/stylesheet:
`assets/app.js`, `assets/config.js`, `assets/messenger-transport.js`,
`assets/result-model.js`, `assets/styles.css`, and the local images.
Also checked the isolated demo branch and static package asset list.

Primary Google references read this round:

- [Messenger integration / official script example](https://docs.cloud.google.com/dialogflow/cx/docs/concept/integration/dialogflow-messenger)
- [HTML attributes, region, storage and optional OAuth](https://docs.cloud.google.com/dialogflow/cx/docs/concept/integration/dialogflow-messenger/html)
- [CSS customization / default font-family](https://docs.cloud.google.com/dialogflow/cx/docs/concept/integration/dialogflow-messenger/css)

The official SDK entry in `config.messengerScript` matches Google's example.
These pages do not supply an exhaustive current SDK subresource/connect-host
inventory or prove compatibility with a particular CSP. A font-family name
in CSS documentation is not proof of a remote font request.

No UI/config/transport/session/renderer changes, integration/binding/domain
changes, backend changes, deployment or Production query occurred.
`liveEnabled=false` remains. Final path is neither guessed nor needed to
analyze origin-based CSP source lists.

### Definitely required

| Class | Exact dependency / permission | Evidence |
| --- | --- | --- |
| Document | Same-origin `index.html` | HTML / local Chromium |
| Scripts | Same-origin `assets/app.js`, `config.js`, `result-model.js`, `messenger-transport.js` | External module tag and static imports / Chromium |
| Styles | Same-origin `assets/styles.css` | External stylesheet / Chromium |
| Images | Same-origin `assets/trs-header.png`, `assets/official-page-bg.png` | HTML img / CSS url / Chromium |
| Live SDK script entry | HTTPS GET `https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js` | `loadMessenger()`, config and Google example; only after later authorized live enablement |
| Live API connectivity | A specific `connect-src` matching Messenger's actual request destination(s) | `sendQuery()` delegates to SDK; exact origins still unverified, so not yet an actionable host entry |

IT must preserve relative asset/module paths, serve modules and CSS with correct
JavaScript/CSS MIME types, and allow HTTPS access to the exact SDK entry when
live loading is later authorized. Production local files need no cross-origin
CORS permission. Package documentation and `MANIFEST.json` are not runtime loads.

`assets/trs-logo.gif` is retained/packaged but not referenced by the current
page. `demo.html` and `demo/mock-messenger.js` are offline review resources,
not production-page dependencies. `hostingUrl` is a placeholder, not a fetch
destination. Official FAQ/source links are normal user navigation; the renderer
does not fetch/embed linked websites or source images. Do not add those websites
to `connect-src` merely because a link can point to them.

### Conditional / unresolved SDK permissions

| Item | Current evidence / next verification |
| --- | --- |
| Additional SDK script URLs | SDK GET was blocked; inspect imports/dynamic loaders and capture actual requests before adding exact sources |
| SDK style tags / stylesheets | Hidden `df-messenger-chat` is still instantiated; hiding it does not prove styles are unnecessary. Inspect actual CSP violations and style insertion |
| Default theme CSS | User's Console embed includes `https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css`; the frozen loader does **not** insert this link. Do not mark it required without SDK evidence |
| Remote fonts/images | Not required by our UI; SDK behavior remains unverified. Do not add Google Fonts hosts, `data:` or `blob:` without observed necessity |
| Messenger API host and transport | No actual SDK bundle/network capture obtained. `location=asia-northeast1` does not prove which browser host the integration uses. Do not infer the browser endpoint from the backend's regional REST API |
| SDK inline-style exception | No `unsafe-inline` requirement established. First determine whether actual SDK uses constructed stylesheets, style tags or attributes; assess narrowly scoped nonce/hash support or another reviewed solution |
| Optional SDK authentication/rich media | Frozen loader has no OAuth client ID, speech/media controls or custom remote icons. No auth/media-origin expansion is proposed |

No worker/frame/WebSocket/EventSource destination was observed or documented
as required for this frozen transport. None is added to the allowlist. If a
later real SDK capture demonstrates a requirement, record its exact URL,
initiator and purpose before proposing a change.

A no-query SDK probe may read the public SDK and record attempted connections
with all backend/event/query requests intercepted and blocked. An intercepted
request is a destination observation, not successful CORS/Production validation.
Actual query response/CORS/streaming behavior requires separately authorized
later live E2E; it is not executed in Gate 3.

### Current frontend does not need

- Inline executable code, HTML event-handler attributes, eval or
  `unsafe-eval`; use the existing external modules.
- Inline CSS or remote web fonts: the two `@font-face` declarations use
  `local(...)` only.
- iframe embedding, worker registration, WebSocket or event-stream connections
  in application code. Official 1999 entry is a normal link/button.
- Wildcard hosts, `https:`-wide sources, a custom backend/proxy, GCP Console/
  OAuth domains, backend Data Store/Tool URLs or source-link domains as automatic
  browser allowances.
- Camera/microphone/geolocation permission for this text-query UI.

These statements describe our code, not an uninspected SDK. Do not add
`unsafe-inline`, frame permissions or a wildcard to work around an unknown SDK
requirement. SDK compatibility must be established separately.

### Safe root-header inspection

Attempted unauthenticated, verified-TLS HEAD only at the confirmed root:
`https://services.arpa.tpctax.dof.gov.taipei/`.
At **2026-10-07 22:24:50 +08:00**, the environment proxy returned
`CONNECT tunnel failed, response 403` (curl exit 56, `server: envoy`).
The request did not reach the origin. The same proxy denied the SDK GET.

| Origin response header requested | Result |
| --- | --- |
| Content-Security-Policy | UNVERIFIED |
| Content-Security-Policy-Report-Only | UNVERIFIED |
| X-Frame-Options | UNVERIFIED |
| Referrer-Policy | UNVERIFIED |
| Permissions-Policy | UNVERIFIED |
| Cross-Origin-Opener-Policy (COOP) | UNVERIFIED |
| Cross-Origin-Embedder-Policy (COEP) | UNVERIFIED |
| Cross-Origin-Resource-Policy (CORP) | UNVERIFIED |
| Access-Control-Allow-Origin / Credentials / Methods / Headers / Expose-Headers; Vary: Origin | UNVERIFIED |

Do not label these headers absent or interpret proxy headers as agency headers.
Even a successful root read would describe only that response/redirect, not the
future AI path. Once hosted, inspect the actual page and asset responses,
redirect chain, enforced plus report-only CSP and any HTML meta CSP.
Multiple CSP policies intersect; adding a permissive policy does not override
an existing restrictive one.

X-Frame-Options / frame-ancestors govern who embeds this page, not the normal
1999 hyperlink. An isolated-page `frame-ancestors 'none'` is compatible with
the confirmed entry model. Host-local CORS headers cannot grant permission to
Google's remote API; inspect Google's actual preflight/response during later
authorized validation. COEP `require-corp`, if present, may impose additional
CORS/CORP requirements on cross-origin SDK subresources. No COOP/COEP/CORP
change is proposed without actual header/resource evidence.

### Minimal CSP for IT — verified disabled-page policy only

This enforceable policy was tested against the frozen `liveEnabled=false`
page and offline demo. It is **not a live Messenger policy**:

```text
default-src 'none';
base-uri 'none';
object-src 'none';
frame-ancestors 'none';
script-src 'self';
script-src-attr 'none';
style-src 'self';
style-src-attr 'none';
img-src 'self';
font-src 'none';
connect-src 'none';
frame-src 'none';
worker-src 'none';
media-src 'none';
form-action 'none';
```

This retains the external-module architecture with no nonce/hash required by
our HTML. Form submission is handled by JavaScript; no native form endpoint
exists. No new CSP header is actually installed by this audit.

For a **future live candidate**, the first proven script change is precisely:

```text
script-src 'self' https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js;
```

That exact entry allowance is insufficient by itself: `connect-src 'none'`
would intentionally block all SDK API calls. A complete, directly usable live
policy cannot be supplied yet because exact connect destinations and SDK
style/subresource requirements remain unverified. Do not enforce this partial
live change or replace missing entries with wildcards/`unsafe-inline`.

After readback, build the complete source list from evidence. Test an explicitly
scoped candidate with CSP Report-Only plus actual network/CSP observations before
requesting enforcement; a stricter enforced host policy will still apply.
Do not introduce a report collector/backend in this repository.

### Focused offline verification

Local Chromium served both frozen pages with the strict disabled-page CSP above:

- `index.html`: 8 same-origin document/resource requests, disabled state visible,
  no SDK element, correct local Logo and styles.
- `demo.html`: 9 same-origin requests including the mock module; synthetic
  answer rendering and real mock reset completed.
- Both: zero CSP violations, page errors or external requests; no iframe.
- Evidence outside Git: `/workspace/work/gate3/local_csp_validation.json`.
  This is frontend/CSP evidence only, not live SDK/Production evidence.

### Gate decision, exact input and STOP

#### Published-setting retry — 2026-10-07 22:46:16 +08:00

After the user reported applying/publishing environment settings, synced main
at `d0e64bf4f84f9a407aae08cde116b60af49f0a85` and retried root HEAD and public
SDK GET. Both still failed with proxy CONNECT HTTP 403 (curl exit 56) before
reaching the origins. No SDK bytes or agency response headers were obtained.

Managed-environment observations are current, desired/observed revisions both
`8` (previously `6`), with enforced restricted networking. Its custom
`allowed_hosts` remains `[]`; neither requested hostname is in the effective
allowlist. The executor's policy snapshot also lacks both entries. The published
revision is observed, but access to these destinations is not established.

Asked the user to identify the attached environment name and its network
allowed-domain entries, and verify the two pure hostnames there. Do not infer
what setting was changed or mark this as an origin CSP/IAM rejection. Gate 3
remains BLOCKED. No frontend/config/backend/integration change or Production
query occurred; no broadening or bypass of the proxy was attempted.

The user requested fresh-session continuation and a GitHub handoff update.
See `NEXT_TASK.md`. The new session must verify its current effective policy
and actual public GET/HEAD access; do not assume session restart resolves the
blocker. This session stops without further probing or live-gate advancement.

**Gate 3 BLOCKED**, because a minimum live allowlist cannot yet be substantiated.
Local frontend audit is complete. Root response headers and current SDK
dependency/connection inventory are missing; the failure is environmental.

Requested human input: apply environment network permissions for exactly
`services.arpa.tpctax.dof.gov.taipei` and `www.gstatic.com` so root headers and
the public SDK can be read. No GCP credential or final path is needed for that
step. Alternatively supply non-secret root response headers and the current SDK
resource/network readback; never include Cookie, tokens or user query payloads.

Final AI-path response-header validation and authorized live CORS/routing/E2E
remain later conditions even after this access blocker is resolved. Preserve
Gate 2A PASS; do not reopen binding/domain settings. Update the three requested
documents, commit/push and STOP for review; do not deploy or advance live gates.


### Web review decision

Gate 3 is not treated as a pre-deployment blocker.

The Codex environment's CONNECT 403 is an execution-environment limitation, not
evidence that the agency host blocks Messenger. The next efficient verification
point is the actual hosted candidate page under
`https://services.arpa.tpctax.dof.gov.taipei`.

Close Gate 3 during live browser validation by capturing:
- actual page/asset response headers;
- SDK script/subresource requests;
- exact Messenger connect destinations;
- any CSP violations;
- any CORS/preflight failures.

Only then should IT add or adjust exact CSP sources. Do not pre-emptively add
wildcards or `unsafe-inline`.
