# FAQ Flow Web cutover — frontend-only rollback

> **重要：2026-10-10 文件校正（歷史方案，禁止直接執行）**
>
> 本文為 2026-10-09 當時尚未實施的 frontend-only rollback 計畫，**已被 2026-10-10 CX 正式版本清理與回滾基準決策取代（SUPERSEDED），不是現行可執行程序**。後端 [2026-10-10 Phase3B](https://github.com/taipei-tax-lab/dialogflow-cx-qa-framework/blob/0426acd0efbfc8a67b0e1ae24760c5b456d11898/docs/GCP_CX_CLEANUP_PHASE3B_LEGACY_RETIREMENT_2026-10-10.md) 已退役舊 FAQ Playbook v1/v2 與 Tool v1 immutable versions；[正式保留服務驗收](https://github.com/taipei-tax-lab/dialogflow-cx-qa-framework/blob/0426acd0efbfc8a67b0e1ae24760c5b456d11898/docs/GCP_CX_POST_CLEANUP_ACCEPTANCE_2026-10-10.md) 確認 Production 仍採 1999 FAQ Flow v1／Rental v3／Router v1／Rental Tool v1。後端證據確認：舊 FAQ Playbook **已不在 Production version mappings**，其 immutable v1/v2 和舊 FAQ Tool v1 已刪除；正式回滾基準改為**四項 Production 映射／Rental v3**，不再採用舊六項映射或 Rental v2。舊 Playbook parent／Draft 雖仍存在，但這不代表可以恢復舊正式服務；其其他直接呼叫可能性仍未知。 
>
> 下列 restore 指令、回滾目標與重新發布步驟**僅留作歷史追溯，不得照單執行**。未來確有回滾需求時，必須先核實現行 Web source、正式 CX versions/mappings、可用目標、回歸測試及人為批准，再另外制定新版回滾程序。此次只改文檔，不修改網站前端、CX 或正式部署。

Prepared: 2026-10-09. Historical status: **PREVIOUSLY PLANNED / NOT EXECUTED**. Current applicability: **SUPERSEDED / DO NOT EXECUTE**.

Historical 2026-10-09 intent (superseded; not valid operational instruction): use only for a demonstrated launch-critical frontend/direct Flow problem.
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
