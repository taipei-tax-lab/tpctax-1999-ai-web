# tpctax-1999-ai-web

臺北市稅捐稽徵處 1999 AI 智慧問答前端專案。

本 repository 是 1999 AI 網頁的 **frontend source of truth**。Dialogflow CX 的 Agent / Playbook / Tool / Data Store / Version / Production Environment 仍由 `taipei-tax-lab/dialogflow-cx-qa-framework` 管理。

## 1999 FAQ 搜尋架構（2026-10-09）

```text
1999 AI Web 自然語言查詢
→ Dialogflow Messenger（既有 Agent / Production binding）
→ 每題 currentPage = 1999 FAQ Semantic Search Flow START_PAGE
→ canonical 623 FAQ semantic search
→ 1～5 筆官方問題、完整答案與 URL，或零結果 fallback
→ text-first renderer，只顯示最新查詢結果
```

每題是獨立搜尋，請完整描述問題；不承諾依前一題補足上下文。
沒有使用者 reset 對話按鈕或聊天 transcript。Messenger 接受送出後才清空
輸入框；接受前失敗保留文字，答案標題仍使用實際送出的問題。

## 原則

- 純 HTML / CSS / JavaScript，不新增 query backend、proxy 或 middleware。
- 每個 request 與 SDK defaults 固定使用 `config.faqCurrentPage`、
  `timeZone=Asia/Taipei`；正式 request 不送 `currentPlaybook`。
- 固定 IDs／Production 來源：[backend handoff](docs/CX_BACKEND_FLOW_HANDOFF_2026-10-09.md)。
- 所有 raw `responseMessages[].text.text[]` 按順序完整組合；raw 無文字時
  使用 Messenger parsed text。安全 URL 可點擊，保留編號與換行。
- richContent／FAQ metadata 為 optional enhancement，不是上線必要條件。
- Rental 僅顯示 backend 固定官方專區連結；不分類、不內部切換或呼叫 Rental。
- GA4 `G-S891SFSMBH`：每個 accepted query 一次 `ai_query_submit`，無業務文字
  參數。沿用 core 初始化後 idle 載入與失敗隔離，demo 不啟用 analytics。
- timeout 不自動 retry；晚到答案忽略，SDK settle 前鎖住送出；session recovery
  僅限 transport 內部。請手動送出完整的新問題。
- 正式 origin／Messenger domain／Production binding 保留；資訊室 final path
  待回覆。官網 entry 尚未新增，頁面不依賴 opener／close／referrer。

## 測試、部署與 rollback

`npm test`；隔離 demo：`python3 -m http.server 8765 --bind 127.0.0.1` 後開啟
`http://127.0.0.1:8765/demo.html`。離線 Chromium tests 攔截外部 SDK／GA：
`python3 tests/phase7e3a_browser.py --base-url http://127.0.0.1:8765/`。

`python3 tools/package_static.py --output-dir <directory>` 產製可重現 hosting／
demo ZIP。正式 hosting ZIP 只有 12 檔；使用既有 Actions workflow 部署。
[Hosting](docs/HOSTING.md)、[IT handoff](docs/IT_HANDOFF.md)、
[部署證據](docs/PAGES_DEPLOYMENT.md)、[操作 checklist](NEXT_TASK.md)。

若 Cloud TLS／proxy 無法執行真正 Messenger／GA4 smoke，只能記為
`DEPLOYED / HUMAN LIVE ACCEPTANCE PENDING`；離線 PASS 不代表 Production live。
Launch-critical 問題僅依 [frontend rollback](docs/FAQ_FLOW_ROLLBACK_2026-10-09.md)
恢復舊 Playbook transport 並 redeploy，不修改 Rental／Agent／Production。

## Migration provenance

本 repo 由 `taipei-tax-lab/dialogflow-cx-qa-framework` 的 Phase 7E3A implementation package 拆出。

來源 checkpoint：

- source repo main: `6d35d1a129a95126b7734100206e32bb58f25cc9`
- implementation source/evidence commit: `5d58feed72b5758d93a943fca5c96536d71bd0f2`
- Drive evidence: `1SZCna6cjEhl3TZeUfTLD790p-q6b4y49`

後續 frontend / UI / hosting 工作以本 repo 為準；原 CX repo 只保留歷史證據與 migration pointer。
