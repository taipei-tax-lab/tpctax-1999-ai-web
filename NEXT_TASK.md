# NEXT_TASK

## Active task

**Deployment Gate 1 — Hosting / URL discovery and deployment-readiness audit**

Do not deploy. Do not enable live mode. Do not change CX/GCP/Messenger settings.

## Goal

Determine exactly where/how this frozen static frontend is intended to be hosted and identify the minimum human inputs required before any production-domain or Messenger configuration work.

This is an audit/planning gate, not an implementation/deployment gate.

## Required work

1. Sync latest `main`.
2. Read:
   - `AGENTS.md`
   - `README.md`
   - `PROJECT_STATE.md`
   - `NEXT_TASK.md`
   - `docs/PRODUCT_PLAN.md`
   - `docs/RESULT_CONTRACT.md`
   - `docs/VISUAL_REFERENCE.md`
3. Inspect all frontend/config/package/deployment-related files.
4. Confirm every current placeholder or environment-specific value, especially:
   - `assets/config.js hostingUrl`;
   - `liveEnabled`;
   - asset/path assumptions;
   - relative URLs;
   - Messenger SDK resource URL;
   - official FAQ return URL;
   - package contents and expected web-root layout.
5. Determine which hosting shapes the current static package supports without code changes, for example:
   - same existing agency web host under a subpath;
   - separate static subdomain/host;
   - CMS/static-file hosting.
   Do not choose one without evidence.
6. Search project history/docs for any already-recorded intended production URL, hostname, CMS path, server ownership or publishing mechanism.
7. Produce a concise deployment Gate 1 report in a new file:
   `docs/DEPLOYMENT_GATES.md`

## docs/DEPLOYMENT_GATES.md requirements

Create a gate table with:

- Gate
- Purpose
- Verified facts
- Unknowns
- Human input required
- Proposed next action
- Status

Populate all seven gates, but only Gate 1 may be actively analyzed now. Later gates must remain pending.

For Gate 1, explicitly answer:

1. Is a final/public hosting hostname already known anywhere in the repo/history?
2. Is a final path such as `/1999-ai/` confirmed or only a placeholder?
3. Does the package assume it is served from a subdirectory, and are all asset/module paths compatible?
4. Is HTTPS required/assumed?
5. Does the current frontend require any server-side feature? (Expected: static only; verify.)
6. What exact information must the user/agency provide before Gate 1 can pass?
7. Can a non-production temporary host be used safely for integration testing, and if so what constraints would apply? Do not create one.

## Important

Do not:
- invent a production hostname;
- modify `hostingUrl`;
- change `liveEnabled=false`;
- change allowed domains;
- change CSP;
- change Messenger integration;
- change Production Environment;
- deploy files;
- send Production questions;
- modify the frozen UI.

## Verification

Run the existing offline tests/package verification only if needed to confirm path/packaging assumptions.

Update:
- `PROJECT_STATE.md`
- `NEXT_TASK.md`

Commit/push and STOP.

The final response must clearly list **only the human inputs that are actually needed next** to pass Gate 1.
