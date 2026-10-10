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
→ 有可靠資料時逐筆 FAQ 區塊／官方原題目連結，否則完整 text fallback
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
  使用 Messenger parsed text，保留完整答案與內部換行。
- 優先從既有 `richContent` info 的 `title/subtitle/actionLink` 建立 optional
  `items[]`，與完整 text 逐筆核對後呈現原題目連結、答案、細分隔線。
  不顯示答案末尾的 FAQ 來源裸網址；不截短答案，不以答案內數字切筆。
- 沒有可靠 cards 時，僅辨識已確認的逐筆 text 訊息格式；未知／合併格式
  保留完整 text-first fallback。Cards 不是上線必要條件。
  契約與前後證據：[result contract](docs/RESULT_CONTRACT.md)、
  [FAQ presentation](docs/FAQ_RESULT_PRESENTATION_2026-10-09.md)。
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

1999 FAQ Flow cutover 已經人工接受為 `LIVE / USABLE`。本輪結果呈現更新的
真實 Messenger 視覺確認另記；Cloud TLS／proxy 阻擋時為 PENDING，離線
replay 不代表新的 live 驗收。GA4 receipt 是 non-blocking operational follow-up，
不因 Realtime／DebugView 暫不可觀察而阻擋此 UI deployment。
原 [frontend-only rollback 計畫](docs/FAQ_FLOW_ROLLBACK_2026-10-09.md) 是 2026-10-09 歷史方案；由於 2026-10-10 後端退役部分舊 FAQ immutable versions，
**此方案已標記 UNVERIFIED / DO NOT EXECUTE**。未來若有實際回滾需求，需先核對當時的 CX 映射與可用目標，另行批准新方案；不得依原文件直接恢復舊 Playbook。

## Migration provenance

本 repo 由 `taipei-tax-lab/dialogflow-cx-qa-framework` 的 Phase 7E3A implementation package 拆出。

來源 checkpoint：

- source repo main: `6d35d1a129a95126b7734100206e32bb58f25cc9`
- implementation source/evidence commit: `5d58feed72b5758d93a943fca5c96536d71bd0f2`
- Drive evidence: `1SZCna6cjEhl3TZeUfTLD790p-q6b4y49`

後續 frontend / UI / hosting 工作以本 repo 為準；原 CX repo 只保留歷史證據與 migration pointer。
