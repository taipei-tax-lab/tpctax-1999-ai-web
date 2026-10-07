# Phase 7E3A Final V1 Plan — Universal AI Answer Renderer

Decision date: 2026-10-07

Status: **AUTHORIZED — BUILD STATIC SEARCH-STYLE PAGE WITH A PLAYBOOK-AGNOSTIC RESULT CONTRACT**

## Final V1 product direction

The 1999 AI page is a static, search-style AI service page.

It must not be implemented as a renderer that only understands FAQ-shaped output.

The same Agent may later route the session from the initial 1999 FAQ Playbook to another Playbook such as Rental Tax Guide. Therefore the frontend must remain usable when the answer is not an exact FAQ answer.

V1 frontend principle:

```text
one Agent
→ initial Playbook depends on entry page
→ later session may use another Playbook
→ frontend always renders a generic AI answer
→ FAQ metadata is only progressive enhancement
```

## Core architecture

```text
official 1999 FAQ page
→ configurable normal hyperlink/button
→ Revenue Service-owned static AI page
→ custom natural-language search input
→ Dialogflow Messenger JavaScript API
→ Production Agent
→ initial currentPlaybook = 1999 FAQ Playbook
→ later turns may continue/reroute inside the same Agent
→ generic answer renderer
→ optional enhanced source/FAQ cards
```

No new backend is introduced.

The page remains static HTML/CSS/JavaScript hosted on the Revenue Service web space.

## Official-page link contract

The municipal CMS insertion mechanism is not yet known.

Do not bind the AI page to any specific link target behavior.

The final official-page maintainer handoff must work whether the CMS supports:

- same-tab navigation;
- new-tab navigation;
- new-window navigation;
- only a standard URL field.

The AI page itself must never depend on:

- `window.opener`;
- `window.close()`;
- the original official page still being open;
- referrer state.

Always provide a normal direct hyperlink back to the canonical official 1999 FAQ page.

## Initial Playbook behavior

On a fresh session:

1. set `QueryParameters.currentPlaybook` to the 1999 FAQ Playbook;
2. submit the first user query;
3. remove the browser-side currentPlaybook override;
4. allow subsequent turns to continue naturally in the Agent session.

Re-arm the initial Playbook only on explicit session reset / clear / expiry.

1999 FAQ Playbook:

`projects/serviceagent-1150909/locations/asia-northeast1/agents/799426c1-ba69-49dc-85e4-5065985706e2/playbooks/f0512949-95f2-40c6-95d0-0c139b84b542`

Do not add `entry_context`.

## Why the renderer must be generic

The 1999 FAQ Data Store is FAQ-structured and may return an answer that closely preserves the matched official FAQ answer.

Rental uses a different knowledge pattern and can return synthesized explanatory text.

The frontend must not assume that every result contains:

- a FAQ question/title;
- exactly one FAQ source;
- an exact-answer payload;
- a specific 1999 URL structure.

Otherwise, future cross-Playbook routing could make the page brittle.

## V1 rendering contract

### Required base contract

Every successful response should be renderable with only:

- primary answer text.

Optional:

- one or more source links;
- source titles/labels;
- other safe metadata already present in the CX response.

### Progressive enhancement

If the response contains reliable FAQ metadata:

- show the answer prominently;
- show an `官方1999常見問答` source block;
- show the FAQ title;
- show the official source URL.

If the response does not contain reliable FAQ metadata:

- show the answer normally;
- show whatever trustworthy source links are available;
- do not fabricate FAQ labels or metadata.

### Cross-Playbook example

1999 FAQ answer:

```text
查詢結果
[answer]

官方1999常見問答
[FAQ title]
[查看官方完整內容]
```

Rental/synthesized answer reached later in the same Agent session:

```text
查詢結果
[synthesized answer]

參考資料
[source link(s), if present]
```

Both are valid in the same frontend.

## V1 page layout

### 1. Header

- 臺北市稅捐稽徵處
- 1999 AI 智慧問答
- concise explanation that the service answers tax questions using official information.

### 2. Search area

- one prominent natural-language input;
- one submit button;
- Enter key support;
- clear loading state;
- clear error/retry message.

### 3. Result area

- primary answer card;
- optional source section;
- optional FAQ-enhanced source card;
- no chat bubbles;
- no avatars;
- no mandatory visible conversation transcript.

### 4. Continue searching

Keep the input available after each result.

Reuse the same CX session unless the user explicitly resets it.

### 5. Navigation

Always provide:

`返回本府1999常見問答`

as a normal hyperlink to the canonical official 1999 FAQ page.

### 6. Responsive behavior

- desktop: centered readable content column;
- mobile: full-width page and normal scrolling;
- no popup-window dependency.

## Messenger usage

Reuse Dialogflow Messenger only as browser transport/session integration.

Intended browser-side flow:

```text
custom search input
→ df-messenger.sendQuery()
→ existing Production Agent
→ df-response-received
→ prevent/default rendering only if safe
→ custom result renderer
```

Do not add a custom API server, Cloud Run service, webhook, proxy or middleware.

## Response parsing rules

- Prefer structured parsed response messages/events from Messenger.
- Preserve answer wording returned by CX.
- Do not rewrite tax content in JavaScript.
- Render source title/link only when reliably present.
- Avoid brittle regex/string parsing tied to a single FAQ answer template.
- If reliable structured extraction is not available, fall back to faithfully rendering the response text and clickable URLs.
- Keep raw payload debugging available only for development, not citizens.

## Relationship to Rental page

Rental and 1999 may use different frontend presentations.

This is allowed.

```text
Rental frontend
→ conversational Messenger UI
→ can still display FAQ-like answer text if session later reaches 1999 FAQ Playbook

1999 frontend
→ search/result UI
→ must also display generic synthesized answers if session later reaches Rental Playbook
```

The common compatibility requirement is therefore **answer-text-first**, not a shared visual format.

Do not attach the 1999 FAQ Tool directly to Rental Tax Guide in this phase. Cross-domain behavior remains a Playbook/routing concern, not a frontend reason to merge Tool scopes.

## Implementation sequence

1. Read this final V1 contract and treat it as superseding earlier 7E3A UI assumptions where they conflict.
2. Reuse the accepted Rental one-shot currentPlaybook mechanism only as a behavioral reference.
3. Inspect existing available Messenger response structures from repository/evidence first; avoid unnecessary Production traffic.
4. Define a small frontend-normalized result model, e.g.:
   - `answer`
   - optional `sources[]`
   - optional `faqMetadata`
5. Build the static HTML/CSS/JS page.
6. Wire the custom search input to Messenger `sendQuery()`.
7. Implement first-turn 1999 currentPlaybook and post-first-request disarm.
8. Implement generic answer rendering.
9. Add FAQ progressive enhancement only when metadata is reliable.
10. Add loading/error/empty-state behavior.
11. Add stable return link to the official 1999 page.
12. Make desktop/mobile responsive.
13. Build an isolated local/static demo harness.
14. Prepare hosting package with placeholder Revenue Service URL.
15. Prepare official-site maintainer handoff containing only:
    - proposed button/link label;
    - destination URL placeholder;
    - optional same-tab/new-tab setting if the CMS exposes one.
16. Record unresolved deployment prerequisites:
    - actual Revenue Service hosting URL;
    - Messenger allowed-domain status for that hostname;
    - CSP/resource-loading requirements.
17. Update GitHub and Drive artifacts.
18. STOP for Web ChatGPT review before live deployment.

## Explicit non-goals

Do not:

- add any new backend;
- add Cloud Run;
- add webhook/proxy/middleware;
- modify live official site;
- modify Messenger integration settings;
- modify Agent/Router/Playbook/Tool/Data Store/Engine/IAM;
- create Versions;
- modify Production Environment;
- add `entry_context`;
- depend on FAQ-only response shape;
- depend on window/tab behavior;
- run broad Production regression/smoke unless specifically needed and separately authorized.

## Expected deliverables

At minimum:

- static search-style page implementation;
- isolated demo;
- normalized result-model documentation;
- generic answer renderer;
- FAQ progressive-enhancement renderer;
- one-shot currentPlaybook implementation;
- official return link;
- hosting package/readme;
- official-site hyperlink handoff;
- concise report of unresolved hosting/domain/CSP items.

Then STOP for human review.
