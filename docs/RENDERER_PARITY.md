# Safe renderer parity — 2026-10-08

Implementation/offline acceptance: **PASS**. Revised production deployment and
trusted-browser 1999/Rental acceptance are recorded below as they complete.
Operational checklist: [NEXT_TASK.md](../NEXT_TASK.md).

## Change and verification

Starting main: `88b14f699216bc1f7a2669216d33285fc7948e99`.
Only runtime change: `assets/result-model.js`.

- `**text**` creates strong nodes; labeled safe HTTP(S) Markdown creates anchors
  showing only the label. Bare safe URLs still create anchors.
- Text/line breaks remain unchanged apart from supported Markdown delimiters.
  Balanced URL parentheses are preserved; sentence punctuation remains text.
- Invalid/unsafe/incomplete links and unsupported images remain literal. Raw
  HTML/script stays inert text; no innerHTML/eval/HTML parser/new dependency.
- Shared parser/canonical href inventory suppresses ordinary inline-source
  duplicates in normalization and direct rendering. Additional structured
  citations and explicit optional FAQ metadata remain intact.
- HTML/CSS/config/app/transport/session/demo and official asset bytes unchanged.
  No CX/backend/Rental/frontend integration mutations.

Validation: Node **14 PASS**; offline Chromium **17 grouped PASS**, zero external
or Production requests and page errors. The reconstructed screenshot scenario
has semantic bold and clickable title, no raw URL and no lower duplicate; actual
DOM/text assertions plus desktop/390/320px screenshots PASS. This is a synthetic
format fixture, not live tax-answer evidence. Hostile links/HTML, additional
citations, generic/FAQ replacement and existing reset/session/currentPlaybook/
timeout tests pass. 390px screenshot was visually inspected; frozen UI remains.

Production and demo builds repeated twice are byte-identical; ZIP CRC/manifest/
source-byte/11-file allowlist/credential-pattern checks PASS. Candidate ZIP:
212,951 bytes, SHA-256
`4abde0ae04a749b1e8ca8a6a7136d7f3f1adb80d6ea6d8ece05be672ba018d2a`.
IT handoff is refreshed in that same package; checksum is external to avoid a
self-referential ZIP hash. Official entry link not added.

## Rental read-only evidence

Rental frontend main:
`e3d786a3f4eb32ba1165644ac2008888b314f936`.

- [site/messenger.html](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/blob/e3d786a3f4eb32ba1165644ac2008888b314f936/site/messenger.html)
  explicitly embeds official Dialogflow Conversational Messenger SDK and native
  df-messenger-chat-bubble. Targets project serviceagent-1150909,
  asia-northeast1, agent 799426c1-ba69-49dc-85e4-5065985706e2, initial Rental
  Playbook 7861bc8f-d2fb-43d3-8ca1-651415eb4205.
- [assets/js/messenger-ui.js](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/blob/e3d786a3f4eb32ba1165644ac2008888b314f936/assets/js/messenger-ui.js)
  retains native sendQuery and one-shot currentPlaybook lifecycle, not this
  frontend's custom answer renderer. Read blob SHA:
  `d212641bb3b7b1199c903fbc4b9229e6c1c8b0cb`.
- [Rental PROJECT_STATE](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/blob/e3d786a3f4eb32ba1165644ac2008888b314f936/PROJECT_STATE.md)
  identifies released URL <https://taipei-tax-lab.github.io/taipei-rental-tax-guide/>.
  Actual HTTPS GET 200 confirms the same native SDK/chat-bubble/project/agent/
  initial Playbook. Retrieved document SHA-256:
  `64e559b0ed1b07a0541f3dd8610e8843b9e097690cfb84f58def8f2483a101d1`.

Backend main read-only checkpoint:
`2f8205c78d62c3e7196f2e818a0edce10dae820b`.
[STATE.md](https://github.com/taipei-tax-lab/dialogflow-cx-qa-framework/blob/2f8205c78d62c3e7196f2e818a0edce10dae820b/STATE.md)
records Conversational Messenger cutover to Production and fresh-incognito
Messenger smoke PASS (2026-10-01). Later
[Phase 7F closeout](https://github.com/taipei-tax-lab/dialogflow-cx-qa-framework/blob/2f8205c78d62c3e7196f2e818a0edce10dae820b/docs/PHASE7F_CX_GO_LIVE_CLOSEOUT_2026-10-07.md)
records exact Production Router v1 + Rental/FAQ v2 + both Tool v1 mappings and
6/6 environment-qualified smoke, including native Rental→FAQ child return.
No Messenger changes in that phase. Local frontend Gate 2A human readback binds
this agent's Messenger to Production environment a0c712e8-ab0c-4520-b100-d2abcfc85868.

These establish retained native/Production integration from project evidence;
they do not establish a newly observed Rental FAQ response or current Console
API readback. Native Markdown support is referenced by the authoritative
[Google fulfillment documentation](https://docs.cloud.google.com/dialogflow/cx/docs/concept/integration/dialogflow-messenger/fulfillment)
in NEXT_TASK. One live FAQ-route answer after this renderer deployment is still
needed for Rental parity acceptance. Do not modify shared FAQ or backend to
compensate for this frontend's former renderer.

## Deployment and remaining live acceptance

Pending Actions result, deployed SHA and hosted-byte readback are appended after
push. Normal trusted-browser 1999 format/session/mobile/console and Rental
native bold/link/no-duplicate acceptance remain separate from offline PASS.
Gate 3 CONDITIONAL PASS and formal Revenue Service IT-ready NO remain unchanged.
Scratch screenshots/reports are outside tracked source in
`/workspace/work/renderer-parity/`; source and durable decisions are in Git.
