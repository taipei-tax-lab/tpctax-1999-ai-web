# NEXT_TASK

## Status

**STOP — Gate 3 BLOCKED on public SDK / root-header access; local audit complete.**

Wait for review or the pending network/readback input. No UI/config/backend/
Messenger setting change, live enablement, Production query or deployment
is authorized. Gate 2A remains PASS.

## Completed evidence

- Baseline synced: `cbe29da4ea6e4eafbd44a042ba15e20040cafbcf`.
- Frozen production document, four JS modules, CSS and two active images are
  same-origin; no inline script/style or remote font required by our code.
- Exact official SDK entry identified in config and Google documentation.
- Strict CSP enforcing no inline/eval/frame/worker/API/remote-font permissions
  passed local Chromium on disabled index and offline demo, including mock
  answer/reset. No external requests or CSP violations.
- Exact live API host(s), SDK extra resources/styles and origin response
  headers are not verified. Do not guess a regional REST endpoint or wildcard.
- `docs/DEPLOYMENT_GATES.md` contains the resource matrix, tested disabled-page
  CSP, safe read failure evidence and scope limits. The disabled policy is not
  a live Messenger deployment policy.

## Input needed to resume only Gate 3

Apply managed-environment network access for:

- `services.arpa.tpctax.dof.gov.taipei`
- `www.gstatic.com`

Current proxy denies both with CONNECT HTTP 403; this is not an agency CSP or
GCP IAM failure. No GCP credential is needed for public GET/HEAD.

Published-setting retry at 2026-10-07 22:46:16 +08:00 also failed. The user
confirmed the intended environment/settings, but current observed revision `8`
still has no custom allowed hosts and excludes both requested destinations.
Next input must be the actual environment name and allowed-domain list (or
non-secret header/SDK readback), so this configuration/readiness discrepancy can
be diagnosed. A publish confirmation alone does not establish network access.

Alternatively provide current non-secret origin headers and SDK dependency/
network evidence. Do not include Cookie/token/query payloads.

## Resume procedure

1. Sync main/read project instructions and recheck observed network readiness.
2. Read root HEAD/GET safely without forms/queries; record security/CORS headers,
   status/redirects and timestamp. Do not infer final AI-path headers from root.
3. GET the exact public SDK, record retrieval/hash and inspect actual loaders,
   styles, fonts/images and request URL construction.
4. If a local SDK probe is needed, intercept and block all backend/query/event
   requests. Do not enable the frontend or send a Production query.
5. Add only evidenced exact script/style/connect/font/etc. sources; no wildcard,
   broad inline/eval exception, frame/worker allowance or invented endpoint.
6. Separate a complete live CSP candidate from the verified disabled-page policy.
   Record any remaining live-E2E conditions and PASS/CONDITIONAL PASS/BLOCKED.
7. Update the three documents, commit/push and STOP for review.

Production origin and static IT hosting/normal 1999 link are confirmed. Final
public path/full URL remains pending with IT; `hostingUrl` stays a placeholder.
Final-path headers and actual API CORS/routing validation require later
authorized hosting/E2E. Do not advance those gates automatically.
