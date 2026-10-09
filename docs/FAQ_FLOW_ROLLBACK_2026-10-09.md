# FAQ Flow Web cutover — frontend-only rollback

Prepared: 2026-10-09. Status: **AVAILABLE / NOT EXECUTED**.

Use only for a demonstrated launch-critical frontend/direct Flow problem.
Cloud TLS/proxy preventing browser acceptance is PENDING, not a rollback trigger.
Do not mutate Rental frontend/CX, Agent entry, Messenger integration, domains,
Production mappings, Flow, Data Store, IAM or GA4 settings.

## Frozen prior Web baseline

Web main `410db6c1891c58d38197fa55d6b2b1d98be9a51a` has the same runtime as
previous deployed `edd501268216e57c1f5b0eaa1f295f9c19f78ca0`,
[run 37748612115](https://github.com/taipei-tax-lab/tpctax-1999-ai-web/actions/runs/37748612115).
Prior ZIP SHA-256:
`86e3fe7256f5464e599c2e8ec488338b98d1fa8de97dc5ab7273e9239c0373bd`.

Restore config `initialPlaybook`:

```text
projects/serviceagent-1150909/locations/asia-northeast1/agents/799426c1-ba69-49dc-85e4-5065985706e2/playbooks/f0512949-95f2-40c6-95d0-0c139b84b542
```

Restore first-request currentPlaybook + timezone, disarm after accepted request
and rearm only after technical/explicit reset as in the frozen old transport.
Remove FAQ currentPage from config, request interceptor **and SDK defaults**.
GA4 ID/event, accepted-send clearing and fixed binding remain the prior baseline.

## Reviewable restore and redeploy

Start from clean synced main; do not reset branch history or overwrite unrelated
work. Restore the exact prior runtime, its matching demo/tests and package-facing
contracts (the commands below are a plan, not an executed rollback):

```sh
git restore --source=410db6c1891c58d38197fa55d6b2b1d98be9a51a -- \
  assets/config.js assets/messenger-transport.js assets/app.js assets/result-model.js \
  assets/styles.css index.html demo.html demo/mock-messenger.js \
  tests/phase7e3a.test.mjs tests/phase7e3a_browser.py tests/analytics.test.mjs \
  AGENTS.md README.md docs/RESULT_CONTRACT.md docs/PRODUCT_PLAN.md \
  docs/ANALYTICS.md docs/HOSTING.md docs/IT_HANDOFF.md
npm test
```

Run the restored offline Chromium suite at a local server. Rebuild twice with
`tools/package_static.py`; verify equality, fresh exact-12-file manifest/source/
credential checks with `tools/verify_hosting.py`, regenerate hosting.sha256 and
replace committed hosting.zip. Frozen baseline package should match prior hash
unless an explicitly documented payload change is intentionally included.

Update state/checklist/deployment record for the rollback, commit and push main
through the existing Pages workflow. Verify run/deployed SHA/hosted parity and
trusted-browser old first-query Playbook path if possible. Refresh relevant
browser caches. Record any reporting-file merge conflicts against actual final
state; do not restore historical status as a current LIVE claim.

Backend Flow v1 can remain mapped but inert when Web stops supplying currentPage.
No Rental/Agent/backend rollback is part of this procedure.
