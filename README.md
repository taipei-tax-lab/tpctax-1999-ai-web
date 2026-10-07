# tpctax-1999-ai-web

臺北市稅捐稽徵處 1999 AI 智慧問答前端專案。

本 repository 是 1999 AI 網頁的 **frontend source of truth**。Dialogflow CX 的 Agent / Playbook / Tool / Data Store / Version / Production Environment 仍由 `taipei-tax-lab/dialogflow-cx-qa-framework` 管理。

## V1 架構

```text
官方 1999 FAQ 頁
→ 一般 hyperlink/button
→ 稅捐處自有靜態 AI 頁
→ 自訂自然語言搜尋 UI
→ Dialogflow Messenger JavaScript API
→ 同一 Production Agent
→ 新 session 第一題 currentPlaybook = 1999 FAQ Playbook
→ 通用 answer renderer
→ FAQ metadata 有可靠結構時再加強顯示
```

## 原則

- 純 HTML / CSS / JavaScript。
- 不新增 Cloud Run、API server、webhook、proxy 或 middleware。
- 前端最小契約是 `answer`；`sources[]` 與 FAQ metadata 都是 optional。
- 不把 UI 綁死在 FAQ-only response shape。
- 官方頁面未確定是同分頁、新分頁或新視窗，本站不得依賴 opener / close / referrer。
- 正式 hosting URL、Messenger allowed domain、CSP 與 Production binding 尚待部署前確認。

## Migration provenance

本 repo 由 `taipei-tax-lab/dialogflow-cx-qa-framework` 的 Phase 7E3A implementation package 拆出。

來源 checkpoint：

- source repo main: `6d35d1a129a95126b7734100206e32bb58f25cc9`
- implementation source/evidence commit: `5d58feed72b5758d93a943fca5c96536d71bd0f2`
- Drive evidence: `1SZCna6cjEhl3TZeUfTLD790p-q6b4y49`

後續 frontend / UI / hosting 工作以本 repo 為準；原 CX repo 只保留歷史證據與 migration pointer。
