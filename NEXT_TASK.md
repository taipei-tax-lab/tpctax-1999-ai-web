# NEXT_TASK

## Active task

**Pre-deployment candidate package and IT handoff preparation**

Do not deploy from Codex. Do not modify CX backend resources.

## Prerequisites

- UI frozen
- CX backend: CX BACKEND LAUNCH READY
- Production Messenger binding: PASS
- Allowed domain: PASS for `services.arpa.tpctax.dof.gov.taipei`
- Gate 3 CSP/resource audit: CONDITIONAL PASS
- Production origin confirmed
- Final public path still chosen by Revenue Service IT

## Goal

Prepare the smallest deployment-ready static handoff package and a concise IT
checklist so Revenue Service IT can place the page under the confirmed production
origin. The actual hosted page will then be used to close CSP/resource validation
and run live browser E2E.

## Required work

1. Sync latest `main` and read all deployment/project documents.
2. Audit whether `config.hostingUrl` is used by runtime code or is metadata only.
   Report every reference.
3. Determine whether the static package can be hosted at an arbitrary subpath
   beneath `https://services.arpa.tpctax.dof.gov.taipei` without rebuilding.
4. Verify all production asset/module URLs are relative and subpath-safe.
5. Do not guess a final path.
6. Prepare a production handoff package that IT can place at the path they choose.

## Live-mode decision

Do not blindly set `liveEnabled=true`.

First determine whether the IT handoff should be:

A. a hosted connectivity candidate with `liveEnabled=false`, followed by a
small config-only switch after header/path verification; or

B. a live integration candidate with `liveEnabled=true` because binding/domain
readiness is already proven and real browser E2E is the next required gate.

Recommend one of A/B based on the current code and rollback simplicity.
Do not deploy it yourself.

If B is recommended, prepare but clearly mark the package as an authorized
Production integration test candidate. Do not send queries from Codex.

## IT handoff document

Create/update a concise:
`docs/IT_HANDOFF.md`

It must tell IT only what they actually need to do:

- host the supplied static package under any agreed HTTPS path beneath
  `services.arpa.tpctax.dof.gov.taipei`;
- preserve file/folder structure and MIME types;
- provide the final full URL after publishing;
- do not iframe it;
- the official 1999 page will use a normal hyperlink/button;
- allow the official Dialogflow Messenger SDK/resource traffic required by the
  hosted browser candidate;
- do not add permissive wildcard CSP pre-emptively;
- if their platform sets CSP/security headers, provide the actual headers or
  allow browser E2E to identify exact required exceptions.

Include a one-line rollback instruction: remove/disable the entry link or restore
the previous static package.

## Package verification

Run:
- Node tests
- offline Chromium tests
- static package integrity/reproducibility checks

Confirm:
- no demo files are accidentally exposed in the production package unless
  intentionally documented;
- no secrets/tokens/credentials are present;
- official images and required assets are included;
- UI remains frozen.

## Output

Update:
- `PROJECT_STATE.md`
- `docs/DEPLOYMENT_GATES.md`
- `docs/IT_HANDOFF.md`
- `NEXT_TASK.md`

Commit/push and STOP.

Final response must answer:
1. Can IT host the package at an arbitrary subpath?
2. Does the package require rebuild after IT chooses the final path?
3. Should the first hosted candidate use `liveEnabled=false` or `true`, and why?
4. Exactly what does IT need to do?
5. Exactly what do we need back from IT before live browser E2E?
