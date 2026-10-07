# PROJECT_STATE

Last updated: 2026-10-07

## Status

**MIGRATED FROM CX QA REPO — FRONTEND SOURCE OF TRUTH ESTABLISHED — NO LIVE DEPLOYMENT**

This repository owns the 1999 AI frontend, UI, static hosting package, demo, and frontend tests.

Dialogflow CX backend source of truth:

`taipei-tax-lab/dialogflow-cx-qa-framework`

## Migration baseline

- source repo main: `6d35d1a129a95126b7734100206e32bb58f25cc9`
- Phase 7E3A source/evidence commit: `5d58feed72b5758d93a943fca5c96536d71bd0f2`
- Drive review package: `1SZCna6cjEhl3TZeUfTLD790p-q6b4y49`

## Current implementation

- Static search-style page.
- No custom backend.
- Dialogflow Messenger is the intended browser transport.
- `liveEnabled=false`.
- Hosting URL remains a placeholder.
- First-turn initial Playbook is the 1999 FAQ Playbook.
- Generic answer rendering works without FAQ metadata.
- FAQ source card is optional progressive enhancement only.
- Official-site same-tab/new-tab/window behavior remains deliberately unspecified.
- No official-site deployment has occurred.
- No Production Messenger runtime validation has occurred from this repo.

## Backend contract

- project: `serviceagent-1150909`
- location: `asia-northeast1`
- agent: `799426c1-ba69-49dc-85e4-5065985706e2`
- initial 1999 Playbook: `projects/serviceagent-1150909/locations/asia-northeast1/agents/799426c1-ba69-49dc-85e4-5065985706e2/playbooks/f0512949-95f2-40c6-95d0-0c139b84b542`
- expected Production Environment: `a0c712e8-ab0c-4520-b100-d2abcfc85868`

Environment binding is integration-side and must not be guessed from HTML attributes.

## Open deployment items

- actual Revenue Service hosting URL / hostname;
- Messenger allowed-domain status;
- current Messenger Production binding readback;
- CSP / SDK resource / connect requirements on the actual host;
- official municipal CMS link insertion capability and target behavior;
- authorized live runtime validation after hosting.
