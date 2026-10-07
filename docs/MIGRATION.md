# Migration from dialogflow-cx-qa-framework

Date: 2026-10-07

The 1999 AI frontend is now an independent product repository:

`taipei-tax-lab/tpctax-1999-ai-web`

The CX repo remains authoritative for Agent / Playbook / Tool / Data Store / Versions / Production Environment.

## Source baseline

- source repo: `taipei-tax-lab/dialogflow-cx-qa-framework`
- source main at migration: `6d35d1a129a95126b7734100206e32bb58f25cc9`
- Phase 7E3A source/evidence commit: `5d58feed72b5758d93a943fca5c96536d71bd0f2`
- Drive implementation package: `1SZCna6cjEhl3TZeUfTLD790p-q6b4y49`

## Path mapping

- `web/1999-ai/index.html` → `index.html`
- `web/1999-ai/assets/*` → `assets/*`
- `web/1999-ai/demo.html` → `demo.html`
- `web/1999-ai/demo/*` → `demo/*`
- `web/1999-ai/RESULT_CONTRACT.md` → `docs/RESULT_CONTRACT.md`
- `web/1999-ai/OFFICIAL_SITE_HANDOFF.md` → `docs/OFFICIAL_SITE_HANDOFF.md`
- `web/1999-ai/README.md` → `docs/HOSTING.md`
- `tests/web/phase7e3a*` → `tests/phase7e3a*`
- `tools/package_phase7e3a_static.py` → `tools/package_static.py`

Executable path references were adjusted for the new repo root; no product behavior was intentionally changed.

## Source-of-truth rule

After migration acceptance:

- frontend/UI/hosting changes go here;
- CX/backend changes go to `dialogflow-cx-qa-framework`;
- do not maintain two independently editable frontend copies.
