# 1999 AI Web — CX Backend Flow Handoff

Date: 2026-10-09

Status: **BACKEND READY / WEB CUTOVER PENDING**

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

## Rollback

Frontend rollback target is the existing old FAQ Playbook:

```text
projects/serviceagent-1150909/locations/asia-northeast1/agents/799426c1-ba69-49dc-85e4-5065985706e2/playbooks/f0512949-95f2-40c6-95d0-0c139b84b542
```

Rollback:
- restore prior `initialPlaybook` config;
- restore first-request `currentPlaybook` behavior;
- remove FAQ `currentPage`;
- redeploy.

No Rental/Agent rollback is required for frontend rollback.
