# NEXT_TASK

## Active task

**Deployment Gate 3 — CSP / SDK / resource-loading readiness audit**

Do not deploy. Do not enable live mode. Do not change CX Playbooks/Tools/Data Stores or Production Environment.

## Confirmed prerequisites

- CX backend: `CX BACKEND LAUNCH READY`
- Messenger binding: expected Production Environment confirmed
- Allowed domain already includes:
  `services.arpa.tpctax.dof.gov.taipei`
- Production origin:
  `https://services.arpa.tpctax.dof.gov.taipei`
- Final page path is still unknown, but is not required for this policy-readiness audit
- Frontend remains static and `liveEnabled=false`

## Goal

Determine the exact browser resource/security-policy requirements for the frozen frontend + Dialogflow Messenger and identify what the Revenue Service IT team must allow on the production server.

This is primarily an audit/planning gate. Do not weaken security policy broadly and do not invent origins.

## Required work

1. Sync latest `main`.
2. Read the standard project documents plus `docs/DEPLOYMENT_GATES.md`.
3. Inspect:
   - `index.html`
   - `assets/app.js`
   - `assets/messenger-transport.js`
   - `assets/config.js`
   - all locally referenced assets/modules
4. Derive all runtime resource classes required by the frontend:
   - same-origin HTML/CSS/JS/images;
   - Dialogflow Messenger SDK script;
   - any SDK-loaded scripts/styles/fonts/images;
   - network/API connections used by Messenger;
   - any worker/frame/websocket/event-stream requirements if actually observed/documented.
5. Use authoritative Google/Dialogflow Messenger documentation or actual browser/network evidence where available.
6. Do not guess wildcard domains. Prefer exact hosts/origins.
7. Check whether the confirmed production host currently returns security headers that may matter:
   - Content-Security-Policy
   - Content-Security-Policy-Report-Only
   - X-Frame-Options
   - Referrer-Policy
   - Permissions-Policy
   - Cross-Origin-Opener-Policy
   - Cross-Origin-Embedder-Policy
   - Cross-Origin-Resource-Policy
   - any relevant CORS headers
   If the root host is reachable, inspect it only with safe GET/HEAD requests. Do not submit forms or queries.
8. If current production-host headers cannot establish the policy that will apply to the future AI path, say so explicitly.
9. Produce a minimal recommended CSP/resource allowlist for IT, separated into:
   - definitely required;
   - conditionally required / verify during live E2E;
   - not required by the current frontend.
10. Record whether inline scripts/styles are required. Prefer preserving the current external-module architecture rather than adding unsafe-inline.
11. Record whether the page needs iframe permission. Expected: no iframe; verify.
12. Record whether the final page path is needed to complete this gate.

## Output

Update `docs/DEPLOYMENT_GATES.md` with:

- verified runtime resource dependencies;
- observed production-host response headers;
- minimal recommended CSP directives;
- unresolved items to verify only after deployment;
- exact IT action, if any;
- Gate 3 PASS / CONDITIONAL PASS / BLOCKED.

Update `PROJECT_STATE.md` and `NEXT_TASK.md`.

## Important prohibitions

Do not:
- deploy;
- change `liveEnabled=false`;
- change frontend UI;
- mutate Messenger integration;
- change Production binding/domain settings;
- modify backend resources;
- send Production queries;
- add permissive wildcard CSP merely for convenience.

Commit/push and STOP.

Final response must clearly state:
1. what IT needs to allow;
2. what is already safe/local;
3. what cannot be known until the actual page is hosted;
4. whether any human input is needed before the next gate.
