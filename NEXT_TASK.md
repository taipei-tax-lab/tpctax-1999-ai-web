# NEXT_TASK

## Active task

**Web ChatGPT review of verified standalone frontend and deployment handoff**

Do not deploy live yet.

## Completed prerequisite

Standalone migration verification passed on 2026-10-07: 10 Node tests,
9 offline Chromium checks, deterministic hosting/demo packages, no executable
`web/1999-ai/` dependency and `liveEnabled=false`. Evidence, package hashes and
validation limits are recorded in `PROJECT_STATE.md`.

## Next concrete work — after human review

1. Review the static UI and offline evidence, answer-first result contract,
   optional FAQ metadata, session behavior and hosting/official-site handoff.
2. Record review decisions and any requested frontend changes in this repository.
   Rerun affected offline checks if code changes are separately requested.
3. Resolve the actual hosting URL/owner, HTTPS/MIME/cache requirements and official
   CMS link target behavior with the responsible maintainers.
4. Obtain separate authorization before live hosting, Messenger allowed-domain /
   Production-binding readback, CSP resource inspection or Production runtime tests.

Current execution is complete: commit/push the verification documents and STOP
for Web ChatGPT review. Keep `assets/config.js` with `liveEnabled=false`.
Do not send Production questions or modify CX/GCP/Messenger/official-site settings.

## Environment

A new Codex Cloud environment may be created specifically for this repo.

Keep it frontend-only. Ordinary UI work should not require GCP ADC/IAM/Discovery Engine credentials.
