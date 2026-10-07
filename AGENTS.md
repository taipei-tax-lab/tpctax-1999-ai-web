# AGENTS.md

## Project role

This repository is the frontend source of truth for 臺北市稅捐稽徵處「1999 AI 智慧問答」.

CX backend resources are owned by `taipei-tax-lab/dialogflow-cx-qa-framework`.

## Read order

At the start of every task, read:

1. `README.md`
2. `PROJECT_STATE.md`
3. `NEXT_TASK.md`
4. `docs/PRODUCT_PLAN.md`
5. `docs/RESULT_CONTRACT.md`

## Architecture guardrails

- Static HTML/CSS/JavaScript only unless a later human decision explicitly changes this.
- No new Cloud Run/API server/webhook/proxy/middleware.
- Use Dialogflow Messenger JavaScript API as the browser transport.
- New session first query may set `currentPlaybook` to the 1999 FAQ Playbook; remove the browser-side override after the first request.
- Frontend result contract is answer-first. Sources and FAQ metadata are optional progressive enhancement.
- Do not assume every later turn stays in the 1999 Playbook; the same Agent may route to another Playbook.
- Never fabricate source metadata.
- Never put service-account credentials, ADC, access tokens, API secrets, or private keys in browser code or repo files.
- Do not modify live Messenger settings, CX resources, GCP IAM, Production Environment, or the official Taipei City website from this repo unless separately authorized.
- `assets/config.js` must remain `liveEnabled: false` until explicit deployment authorization.

## Workflow

- Project state lives in Git, not in the current session.
- Keep `PROJECT_STATE.md` and `NEXT_TASK.md` current after meaningful work.
- Prefer small, reviewable commits.
- Run focused offline tests before claiming frontend changes are complete.
- Do not claim Production runtime validation from mock/offline fixtures.
- Large binary/runtime evidence belongs in the project Drive when needed; source code and durable decisions belong in GitHub.
