# 1999 AI Web — CX Backend Flow Handoff

Date: 2026-10-09

Status: **BACKEND READY / WEB DEPLOYED / HUMAN LIVE ACCEPTANCE PENDING**

> **狀態註記（2026-10-10）：** 此份 Handoff 是 2026-10-09 當時的交接快照，上述 `HUMAN LIVE ACCEPTANCE PENDING` 不代表目前網站狀態。[前端 PROJECT_STATE.md](../PROJECT_STATE.md) 後續已記載 1999 FAQ Flow Web cutover 經人工接受為 `LIVE / USABLE`（GA4 receipt 仍待觀察）。後端 [2026-10-10 retained-service acceptance](https://github.com/taipei-tax-lab/dialogflow-cx-qa-framework/blob/0426acd0efbfc8a67b0e1ae24760c5b456d11898/docs/GCP_CX_POST_CLEANUP_ACCEPTANCE_2026-10-10.md) 完成 1999／Rental 保留服務抽測；同日 [Phase3B](https://github.com/taipei-tax-lab/dialogflow-cx-qa-framework/blob/0426acd0efbfc8a67b0e1ae24760c5b456d11898/docs/GCP_CX_CLEANUP_PHASE3B_LEGACY_RETIREMENT_2026-10-10.md) 已退役部分舊 FAQ versions，原 Handoff 中以舊 FAQ Playbook 為目標的 rollback **已被正式基準取代，不能照舊執行**；請看 [回滾文件警示](FAQ_FLOW_ROLLBACK_2026-10-09.md)。以上僅文件校正，沒有更改前端或後端。



Backend source of truth:
`taipei-tax-lab/dialogflow-cx-qa-framework`

Authoritative backend handoff:
`docs/1999_FAQ_WEB_FLOW_HANDOFF_2026-10-09.md`

Backend main at review:
`39e176ed40a4ad81cb9b39b6a7b15687bbcea4bb`

## Fixed production parameters

- Project ID: `serviceagent-1150909`
- Agent ID: `799426c1-ba69-49dc-85e4-5065985706e2`
- Location: `asia-northeast1`
- Production Environment ID: `a0c712e8-ab0c-4520-b100-d2abcfc85868`
- FAQ Flow display name: `1999 FAQ Semantic Search`
- FAQ Flow ID: `676409b6-b02f-4a24-9d3a-81e14cb77d4f`
- Full FAQ START_PAGE currentPage:

```text
projects/serviceagent-1150909/locations/asia-northeast1/agents/799426c1-ba69-49dc-85e4-5065985706e2/flows/676409b6-b02f-4a24-9d3a-81e14cb77d4f/pages/START_PAGE
```

- languageCode: `zh-tw`
- timeZone: `Asia/Taipei`
- canonical Data Store: `tax-1999-faq-v4`
- canonical count: 623
- aliases: 0
- GA4 Measurement ID remains: `G-S891SFSMBH`

## Web transport contract

Every accepted user text query must set:

```js
queryParams.currentPage = config.faqCurrentPage;
queryParams.timeZone = 'Asia/Taipei';
```

Do not send the old 1999 `currentPlaybook` override.

This applies to first, second and later searches.

The same Agent ID/location and existing integration-side Production Environment binding remain unchanged.

Do not add a guessed Environment HTML attribute.

## Product semantics

Every submitted question is an independent semantic search.

Do not rely on previous question/answer context.

The web page itself is the specialist-service routing boundary:
- this page stays in 1999 FAQ semantic search;
- Rental-specialist questions are guided to the Rental special-zone link;
- do not internally invoke Rental.

Official Rental specialist link:

`https://tpctax.gov.taipei/cp.aspx?n=3A978B4E3ADD88F2`

The backend currently includes this as a static navigation note in the FAQ Flow text contract. No automatic Rental classifier is part of this release.

## Response contract

Backend Production has already proven direct-currentPage runtime.

Visible text:

```text
以下是本府 1999 常見問答中與您的問題較相關的內容：

1. {official question}
{complete official answer}
{official URL}

... up to 5 ...

若以上內容不是您要找的資訊，可以換個方式描述您的問題。
出租房屋租稅優惠專責諮詢，請前往出租專區：https://tpctax.gov.taipei/cp.aspx?n=3A978B4E3ADD88F2
```

Zero-result fallback:

```text
找不到可用的 FAQ 搜尋結果，請換個方式描述問題。
出租房屋租稅優惠專責諮詢，請前往出租專區：https://tpctax.gov.taipei/cp.aspx?n=3A978B4E3ADD88F2
```

The frontend should combine all text ResponseMessages in response order. RichContent cards are optional progressive enhancement and are not required for this release.

## Backend evidence already passed

- immutable FAQ Flow v1 created and mapped to Production;
- original five Production mappings preserved;
- Agent startPlaybook unchanged;
- Production direct-currentPage: 18/18 + 4/4 PASS;
- repeated same-session independent searches PASS;
- fallback/no stale cards PASS;
- canonical 623 exact / aliases0 / indexed623;
- Rental preservation before/after: 6 + 6 turns PASS.

Therefore Web Codex must not re-open backend architecture or routing design.

## Reset UX

Because every query is independent:
- remove the visible "清除前次問答，重新提問" control;
- a new submitted question is already a new search;
- technical Messenger session reset may remain internal for recovery only;
- latest query/result replaces the previous displayed result.

## Rollback (2026-10-09 historical plan; **SUPERSEDED / DO NOT EXECUTE**)

**2026-10-10 authoritative correction:** Backend [Phase3B](https://github.com/taipei-tax-lab/dialogflow-cx-qa-framework/blob/0426acd0efbfc8a67b0e1ae24760c5b456d11898/docs/GCP_CX_CLEANUP_PHASE3B_LEGACY_RETIREMENT_2026-10-10.md) retired the old FAQ Playbook immutable v1/v2 and old Tool v1, detached old FAQ mappings, and adopted the **four-mapping / Rental v3** accepted baseline. The old frontend-only rollback plan below is archived for provenance, **not an executable recovery procedure**. Existing old parent/Draft does not restore a published Production version. A future rollback requires a newly validated and approved plan.

Original 2026-10-09 rollback target (historical only):

```text
projects/serviceagent-1150909/locations/asia-northeast1/agents/799426c1-ba69-49dc-85e4-5065985706e2/playbooks/f0512949-95f2-40c6-95d0-0c139b84b542
```

Rollback:
- restore prior `initialPlaybook` config;
- restore first-request `currentPlaybook` behavior;
- remove FAQ `currentPage`;
- redeploy.

Historical 2026-10-09 assumption only: no Rental/Agent rollback. This instruction is superseded.

## Web implementation evidence — 2026-10-09

Read-only backend main `39e176ed40a4ad81cb9b39b6a7b15687bbcea4bb` matches all
fixed parameters above. Web main baseline `410db6c` has been cut over in source:
faqCurrentPage config; each request and SDK default gets same currentPage/timeZone,
no currentPlaybook; no reset UI. Raw multi-message text is complete and ordered,
parsed-only fallback retained; existing safe links include backend Rental note.
Accepted-send clear/GA4 boundary and startup scheduling remain intact.

Node 28 PASS; offline Chromium 26 grouped PASS. First/second/third request bodies
and pre-event SDK defaults exact; GA 1/2/3 without custom parameters. Synthetic
0–5 FAQ text coverage, 1280/390/320, input/draft/heading, service/timeout/late-answer
and internal session recovery PASS. No real external/Production fixture requests.
Backend observed 0/2/5 proof remains separate from synthetic frontend counts.

Current source/deployed commit, Actions run, package hash, live blocker and
rollback disposition are maintained in [NEXT_TASK](../NEXT_TASK.md) and
[PAGES_DEPLOYMENT](PAGES_DEPLOYMENT.md). Full frozen frontend-only rollback:
[FAQ_FLOW_ROLLBACK_2026-10-09.md](FAQ_FLOW_ROLLBACK_2026-10-09.md).
No backend/Rental resources were changed.

Web source/deployed `6b79ba571b5d0b2d66b1494d59f0ef157b813362`,
[Actions 37875482165](https://github.com/taipei-tax-lab/tpctax-1999-ai-web/actions/runs/37875482165)
PASS 2026-10-09 10:38:14 Asia/Taipei, artifact 11592311095. Production package
SHA-256 `4f322561e9cff0e36f3ec4d44d5c7bef36088fed0902b16694e06a8de29b63e1`,
214,669 bytes; hosted 12/12 exact at 10:39:26, six exclusions 404. Source and deployed
commit are the same implementation; final reporting HEAD is separate.
Actual browser 10:39:19 Cloud ERR_CERT_AUTHORITY_INVALID before origin/page JS,
gtag 10:39:17 CONNECT403. No Production queries/GA receipt. Seven browser checks
remain PENDING; status is DEPLOYED / HUMAN LIVE ACCEPTANCE PENDING, not Web LIVE.
Historical 2026-10-09 status: rollback previously labelled AVAILABLE / NOT EXECUTED; **superseded by 2026-10-10 CX Phase3B**. No executable launch-critical failure, no
Rental/Agent/backend change.
