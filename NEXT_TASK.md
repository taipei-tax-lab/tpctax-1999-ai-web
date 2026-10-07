# NEXT_TASK

## Active task

**Deployment Gate 2A — Production Messenger binding + allowed-domain readiness audit**

Do not deploy. Do not enable live mode. Do not modify Playbooks/Tools/Data Stores.

## Confirmed facts

- Frontend source of truth: `taipei-tax-lab/tpctax-1999-ai-web`
- CX backend is externally confirmed `CX BACKEND LAUNCH READY`
- Production origin: `https://services.arpa.tpctax.dof.gov.taipei`
- Static package will be hosted by Revenue Service IT on that server
- Existing official 1999 page can add a normal hyperlink/button to the final AI page
- Final public path/full URL is not yet confirmed
- `liveEnabled=false` must remain unchanged in this task

## Goal

Verify the current Dialogflow Messenger integration is bound to the expected Production Environment and determine the exact allowed-domain configuration needed for the confirmed production origin.

This is a read/plan gate first. Do not mutate integration settings unless the task can prove the exact current state and the change is explicitly safe and limited.

## Required work

1. Sync latest `main` and read the standard project documents plus `docs/DEPLOYMENT_GATES.md`.
2. Using the existing GCP/CX credentials available in the environment, read back the Messenger integration configuration for:
   - project `serviceagent-1150909`
   - agent `799426c1-ba69-49dc-85e4-5065985706e2`
3. Confirm which Environment the Messenger integration is actually bound to.
4. Compare it with expected Production Environment:
   `a0c712e8-ab0c-4520-b100-d2abcfc85868`
5. Read the current allowed-domain / domain allowlist configuration if the integration exposes it.
6. Determine whether the production origin must be entered as:
   - hostname only;
   - origin including scheme;
   - another format required by the API/UI.
   Use actual API/UI evidence; do not guess.
7. Determine whether `https://services.arpa.tpctax.dof.gov.taipei` is already allowed.
8. Record findings in `docs/DEPLOYMENT_GATES.md`.

## Important

- Do not change Playbook/Tool/Data Store/version configuration.
- Do not change Production Environment contents.
- Do not send Production queries.
- Do not change `assets/config.js`.
- Do not enable `liveEnabled`.
- Do not deploy frontend files.
- Do not guess the final path; allowed-domain work should be based on the confirmed origin/hostname if that is how Messenger enforces it.

## Outcome

At the end, clearly report:

1. Messenger bound Environment ID
2. PASS/FAIL against expected Production Environment
3. current allowed-domain entries
4. whether `services.arpa.tpctax.dof.gov.taipei` is already allowed
5. exact minimal change required, if any
6. whether Gate 2 can pass without knowing the final page path

Update:
- `PROJECT_STATE.md`
- `docs/DEPLOYMENT_GATES.md`
- `NEXT_TASK.md`

Commit/push and STOP.
