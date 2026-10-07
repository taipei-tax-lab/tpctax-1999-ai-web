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


## Gate 3 — CSP / resource-loading audit

Status: **NEXT**

Goal:
- derive the exact external resource/connect requirements of the frozen frontend and Dialogflow Messenger runtime;
- determine whether the confirmed production host can permit them without broad CSP weakening;
- identify only the IT/server changes actually needed.

Known production origin:
`https://services.arpa.tpctax.dof.gov.taipei`

This gate does not require the final page path for policy analysis, but actual response-header validation on the final deployed page will remain pending until hosting exists.
