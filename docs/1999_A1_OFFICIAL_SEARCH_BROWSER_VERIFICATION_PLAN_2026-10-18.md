# 1999 A1 官網即時搜尋／嵌入可行性鑑別 — Codex Cloud 驗證計畫（2026-10-18）

**狀態：PLAN / READ-ONLY TEST / STOP FOR HUMAN REVIEW。** 本輪僅測試與留下證據，不實作產品功能、不部署、不 merge。依據先前 `docs/1999_KEYWORD_FALLBACK_FEASIBILITY_REPORT_2026-10-18.md`（位於 `research/1999-keyword-fallback-2026-10-18` 分支）、既有研究計畫與當前 Web Repo guardrails；先 fetch 所有相關分支再工作。**目前研究報告尚未合併 main；不可將 main 上沒有報告誤認為工作遺失。**

## 一、唯一決策問題

在完全不動 CX、Data Store、原官網、正式 1999 AI 前端功能/UI/部署，且不增設後端、靜態題庫、JSON/CSV 資料同步的條件下，能否在既有 AI 網頁取得 CX 真零結果後：
1. A1a：由瀏覽器 JS 直接向原 1999 FAQ 官網發出有參數的標題／內文關鍵字搜尋，取得 **合法、完整、可解析的官方 FAQ 結果**，在 AI 頁呈現；
2. A1b：若 A1a 不行，是否可在 AI 網頁以 iframe 顯示原官網 **可操作且最好可帶入查詢詞** 的搜尋畫面，避免整頁來回切換。

不是在問 Codex Cloud 自己能否連線。每項明確判定：
- `SUPPORTED/PASS`：有目標使用方式的真實原站／真實瀏覽器證據。
- `TECHNICALLY BLOCKED`：取得官網 origin 回應或瀏覽器政策證據，證明該用法被 CORS、X-Frame-Options、CSP frame-ancestors、cookie/CSRF/身份等機制禁止；**不要將單次403、Cloud proxy 拒絕直接等同永久不可行**。
- `ENVIRONMENT BLOCKED`：Cloud 代理 CONNECT403、CA 錯誤、目的地 allowlist 等；原站能力維持 UNKNOWN。
- `UNKNOWN`：其他證據不足；要明列仍缺的觀察與人手驗證方法。

## 二、保護範圍

- 僅可修改本 repo 的研究文件與**未被 production build 引用的**一次性離線／瀏覽器探針（建議 `research/` 或 `tools/research/`，可另存可複製的 DevTools Snippet）。
- 禁止改 `index.html`, `demo.html`, `assets/`, production tests/fixtures、Actions、hosting ZIP、GA4、SDK/transport/query契約、CX/GCP、資料來源、官網；禁止任何 production deploy / detectIntent，無須 GCP credentials。
- **不得自行要求放寬雲端網路政策、關閉 TLS 驗證、忽略 HTTPS 憑證、繞 proxy／透過第三方 CORS proxy、登入、提交 Cookie/Token 或執行高頻爬取。**
- 只允許匿名公開少量 GET，已確認表單行為前不可猜參數或盲送 POST；不在 Git 儲存 session/cookie/CSRF token 或民眾輸入資料。
- 如果遇到 Cloud 阻擋，該子項停止重試，轉為產生可在使用者一般瀏覽器手動驗證的操作與證據表。不要聲稱因未能在 Cloud 測試就技術不可能。

## 三、執行程序

### Gate 0 — Baseline 與延續研究
讀 `AGENTS.md`, `README.md`, `PROJECT_STATE.md`, `NEXT_TASK.md` 及研究計畫、上一輪分支報告／證據；記錄最新 main SHA、研究分支 SHA、此輪 branch 名稱。維持既有現況不動。不得把上一輪 `CONNECT403` 和 `ERR_CERT_AUTHORITY_INVALID` 解釋為官網拒絕 CORS 或 iframe。

### Gate 1 — 官方原站 HTTP 證據
官網參考入口：`https://tpctax.gov.taipei/News.aspx?n=BB8B93F0A49EAB80&sms=87415A8B9CE81B16`。先單次匿名 request，逐層分辨 **proxy CONNECT 回應**、TLS、origin response、redirect（各跳）及實際 status/header。若能讀真正 HTML，解析標題／內容欄位的 form action、method、input name、頁碼、查詢 submit 機制和結果 link；以真正 UI 操作或 DevTools Network 觀察判定，不猜 `q` 等參數。只做「信用卡」「房屋稅」及必要完整問句少量測試，不批次遍歷。記錄匿名搜尋能否得到問題、完整答案、官方連結及分頁。

### Gate 2 — A1a JS 跨域能力
在**真正來源為 AI 網頁 origin** `https://taipei-tax-lab.github.io` 的正常 HTTPS 瀏覽器執行最小 fetch 驗證；留存 request URL/method（遮罩動態 token）、Origin、redirect、HTTP status、`Access-Control-Allow-Origin`、`Access-Control-Allow-Credentials`、`Vary`、Content-Type、JS 可否讀 body。GET 是否有不必要 preflight 要據實記錄；只在實際方法／headers 需要時測 OPTIONS。區分 `curl/Node可讀`、`DevTools可見response但 JS被 CORS 擋`、`JS可讀正式結果`。不要拿 `mode:no-cors` opaque 回應當成功。若 GitHub Pages 在 Cloud Chromium 遇 CA 錯誤，不要繞過；標 ENVIRONMENT BLOCKED，提供下述人工步驟與 Console snippet（不得自動送其他請求）。

### Gate 3 — A1b iframe
檢查真正官網 origin 回傳的 `X-Frame-Options`、`Content-Security-Policy: frame-ancestors`、redirect 各階段及 `frame-src` 限制；在正常瀏覽器以 AI origin 測試**實際 iframe navigation 能否載入**，並觀察能否在嵌入畫面送查詢、手機版可用性、是否要 third-party cookie、是否跨站導頁。**只看到沒有 XFO/CSP 不算 iframe 成功；只看到 Cloud tunnel blocked 不算 iframe 技術禁止。** 同源政策即使 iframe 可見，父頁 JS 通常仍不可操作內容／預填；必須分辨「可見可手動輸入」與「可自動帶 keyword」，後者需有實證 deep link、postMessage 或官方支援。禁止假設可以繞過 same-origin policy。未取得真實搜尋 query URL 不准捏造帶參數 iframe。

### Gate 4 — 使用者端補驗工具包
如果 Codex Cloud 環境仍阻擋，將可在台灣一般 PC Chrome/Edge 上由**使用者手動執行**的最小步驟寫清楚，不要求提供遠端桌面、帳密或安裝擴充套件：
1. 打開官網 FAQ，F12→Network→Preserve log，手動輸入「信用卡」搜尋，記錄 document/fetch request 的 HTTP method、URL（可遮罩動態值）、form action/input name、response 類型、結果筆數；標明何者是網頁結果而非開放資料。
2. 打開 1999 AI 正式測試頁，F12→Console，僅在使用者明確選擇下貼入**經閱讀過、目的地固定的匿名 GET fetch** 最小測試碼；Console 只輸出 status、CORS結果和必要 header，**不傳民眾輸入、不帶 credentials**；browser cross-origin error 列為證據。若沒有確定真實搜尋 URL，就只測官方 FAQ 首頁是否可讀，不能宣稱搜尋 API 可用。
3. 對 iframe 用單獨暫時本機 HTML 或 DevTools（不編輯正式頁面）進行 visual/Console 檢驗；顯示/被阻擋/iframe內手動搜尋/可否 deep link 分開記。
4. 提供「使用者回填觀察」清單，避免要求完整 HAR/含 cookie 的封包。若需截圖，遮罩敏感資訊。
5. **如無真實人工測試，這一節只是測試方法，不能回填 PASS。**

### Gate 5 — 決策報告與 STOP
寫 `docs/1999_A1_OFFICIAL_SEARCH_BROWSER_VERIFICATION_2026-10-18.md`：
- 逐項 A1a/A1b conclusion matrix（PASS / TECHNICALLY BLOCKED / ENVIRONMENT BLOCKED / UNKNOWN）；Cloud vs 一般瀏覽器、GET vs JS讀取、iframe顯示 vs 預填各自獨立結論。
- 精確 HTTP/CORS/XFO/CSP 實測（若未取得，填 UNKNOWN）、表單參數/結果的實際來源、測試時間與重現命令；附完整出處連結但不洩漏 cookie/token。
- 若本輪仍受網路阻擋，列出最少的使用者端操作證據，先不選 A1a 或 A1b；**不可用猜測解決尚無證據的事**。
- 對每種已可行方案估計**最小前端變動**、失效隔離與安全風險；不得擴張為 proxy、靜態題庫、官方 CSV、改 CX 的設計。
- 本輪 production frontend/CX/Data Store/官網/部署/GA4 mutation = 0；提供 git diff、研究 commit SHA、branch 與測試執行狀態。
- 研究分支獨立提交並 push；`NEXT_TASK.md` 加一個簡明研究狀態與未決項，勿改動既有正式 runtime 宣告；最後 STOP 等使用者／Web ChatGPT 審閱。不 merge main。

## 四、取捨原則
A1a 若確實可在正常使用者瀏覽器做匿名查詢並解析官方原文，優先於 A1b；A1b 若只能顯示不能自動帶關鍵字，需評估是否真的比在原頁新開視窗友善。本輪任何失敗若只是 Codex Cloud 的代理／CA/allowlist，應當作**工具環境受限**而非**產品技術不可行**。我們只尋求少量使用者、零額外後端與零題庫同步的低維護補充能力，不追求零結果 fallback 的全面架構改造。
