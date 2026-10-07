# NEXT_TASK

## Active task

**Standalone-repo migration verification and frontend handoff preparation**

Do not deploy live yet.

## Required work

1. Treat this repository as the only frontend source of truth.
2. Verify migration did not change behavior:
   - run `npm test`;
   - run the offline Chromium test if Playwright/Chromium are available;
   - build deterministic hosting/demo packages with `tools/package_static.py`.
3. Confirm executable tests/tools no longer depend on the old `web/1999-ai/` path.
4. Review `index.html`, responsive UI, generic answer renderer, FAQ progressive enhancement, and one-shot `currentPlaybook`.
5. Keep `assets/config.js` with `liveEnabled=false`.
6. Do not send Production questions or modify CX/GCP/Messenger/official-site settings.
7. Update `PROJECT_STATE.md` with verification result.
8. Replace this file with the next concrete task after verification.
9. Commit/push and STOP for Web ChatGPT review.

## Environment

A new Codex Cloud environment may be created specifically for this repo.

Keep it frontend-only. Ordinary UI work should not require GCP ADC/IAM/Discovery Engine credentials.
