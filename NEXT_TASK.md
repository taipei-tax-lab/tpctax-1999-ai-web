# NEXT_TASK

## Status

**STOP — Deployment Gate 2A PASS; wait for review / next-gate instruction.**

Frozen UI and `liveEnabled=false` remain unchanged. No deployment, Production
query, integration mutation or CX resource change occurred in this audit.
See `docs/DEPLOYMENT_GATES.md` for the current UI evidence and limits.

## Completed Gate 2A

- Current user-provided Messenger Console shows **Production** for project
  `serviceagent-1150909`, location `asia-northeast1`, agent
  `799426c1-ba69-49dc-85e4-5065985706e2`.
- Same agent's current Production resource readback resolves to
  `a0c712e8-ab0c-4520-b100-d2abcfc85868`, matching the expected Environment ID.
- Current domain entries:
  - `taipei-tax-lab.github.io`
  - `services.arpa.tpctax.dof.gov.taipei`
- Saved format is hostname, without scheme or page path.
- Target production host is already allowed: **domain PASS**.
- Minimal binding/domain change: **none**.
- Final page path is not needed for this completed readiness audit.
- No authenticated API read succeeded in the agent environment; results are
  grounded in current user-provided Console screenshot/resource readback.

## Remaining deployment facts / human inputs

- Frontend source: `taipei-tax-lab/tpctax-1999-ai-web`.
- CX backend is externally confirmed `CX BACKEND LAUNCH READY`.
- Production origin: `https://services.arpa.tpctax.dof.gov.taipei`.
- Revenue Service IT hosts a static package; official 1999 uses a normal link/button.
- Gate 1 remains partially passed: IT must supply the final public path/full URL.
  Do not guess a path or replace the `hostingUrl` placeholder yet.
- No further credential or domain input is needed for this completed UI audit.
- Gate 3 would need the actual hosting CSP/resource-policy constraints or
  response-header evidence from IT. Do not start it without a new instruction.

## Next authorized task

Wait for review / an explicit next-gate instruction. Sync main and read the
project documents at the start of that task. Do not automatically enable live
mode or treat this configuration audit as runtime routing evidence.

The direct agent API route remains unavailable: no connected GCP identity or
identified credential selector and proxy CONNECT HTTP 403 for the regional API.
If later direct reads are needed, reconnect an existing identity and allow the
required API/refresh hosts through environment configuration. Never share
credential contents in chat; the proxy failure is not a GCP IAM denial.

Keep frontend config, one-shot Playbook/session semantics, renderers and backend
resources unchanged. No deployment or Production query until explicitly authorized.
