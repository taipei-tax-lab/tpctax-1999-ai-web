# 1999 傳統關鍵字搜尋整合 — 唯讀可行性研究計畫（2026-10-18）

狀態：**PLAN / CODEX CLOUD RESEARCH ONLY / NO IMPLEMENTATION AUTHORIZED**  
決策者：Web ChatGPT + 人工審閱；執行者：Codex Cloud。  
此文件僅是研究任務，不代表已找到可用的官網搜尋 API、不代表整合方案已核准。

## 1. 使用者目標與範圍

現有 1999 AI 是 **既有 1999 官方 FAQ 傳統標題／內文關鍵字查詢的補充**，強項是語意理解；傳統關鍵字搜尋原則上不需支付 CX 每次語意查詢費用。民眾希望在同一個便捷入口處理兩類問法。例：「信用卡」、「房屋稅」等短關鍵字，可能在現有 CX 原生搜尋取得零結果；希望評估是否能借用原官網搜尋，回傳官方問題／答案／URL 至同一頁。

**此輪只研究、測試、回報，不實作。** 禁止修改 CX Agent/Flow、Knowledge Connector、Tool、Data Store、GCP、原官網及 1999 AI 前端任何 runtime/UI/樣式/分析/部署檔案；禁止 Production CX detectIntent 測試，除非使用者另外核准。只允許在 **本 repository** 增補研究文件、測試腳本（如有必要，必須離線／一次性、不納入 production build）、測試紀錄。不得提交變更其他 repo。不得修改既有 `AGENTS.md` guardrails 以規避禁止項目。

現有架構（先核對當前 repo 與後端正式基準，不可照抄過時交接）：
- 純靜態 HTML/CSS/JavaScript + GitHub Pages；現有網頁每一題都用 `currentPage` 指到 `1999 FAQ Semantic Search` Flow START_PAGE。
- CX Production FAQ Flow v1 → `tax-1999-faq-v4`，623 筆 canonical FAQ，aliases 0；原生結果 0–5 筆，官方原文不改寫。
- 不額外建立 Playbook、Cloud Run、Webhook、proxy、server、第二套 Data Store。
- 現有頁面的使用者發問、結果顯示、timeout／錯誤、accepted query GA4 行為全部保持不變。

## 2. 此輪必答研究問題

1. **官方原網站搜尋的真實入口**：確認官方 1999 FAQ 網頁、搜尋表單、表單 HTTP method、實際送出欄位／參數、是否區分「標題」與「內文」，搜尋結果的 URL 與官方紀錄鏈結；以真實網頁與封包為證，**禁止猜測 endpoint 或參數**。
2. **是否存在可直接供跨網域讀取的官方資料介面**：檢查官網提供的 JSON／CSV 等開放資料、可能的搜尋 API 或可下載清單；記錄權威來源、筆數、更新日期、欄位、是否包含完整問題／答案／URL、是否為與目前 CX 623 題一致的範圍。不得因 623 筆是現有 CX 計數，就假設原網資料集數量一樣。
3. **GitHub Pages 瀏覽器可行性**：在可信的瀏覽器／網路條件下，驗證官方介面的 `Access-Control-Allow-Origin` 等 CORS 行為、redirect、Content-Type、GET/POST、必要 cookie/CSRF、登入要求、rate limits；區分「伺服器端可抓」與「從 GitHub Pages 的瀏覽器 JS 可讀」。避免僅用 curl/Node 成功就宣稱前端整合 PASS。優先在瀏覽器用無憑證、安全的小量請求，不對官網高頻抓取。
4. **資料使用與可維護性**：是否有公開條款、重用限制、robots／存取政策、可用性／流量限制；官網改版時可能失效的點；是否必須由人工或排程更新資料；若需要複製一份靜態 FAQ，估計更新頻率、來源正確性與同步異動風險。
5. **原本 AI 零結果能否可靠識別（只做程式碼靜態閱讀及既有 fixture 離線重播）**：找出目前真正的 no-result 訊號與固定 fallback，與 timeout／transport／SDK 解析錯誤區分；不可把任意 `message.includes("找不到")` 當成可靠判定；原本各類零結果 UI 行為和合約列入評估。這輪不修改判斷邏輯。
6. **成本**：區分「CX 已先查、零結果再免費補查」仍然支付第一次 CX 費用；如未來採前端先判短詞免費查，可能省費但會改變使用者體驗／偵測策略，本輪僅作替代選項，不擅自規劃為既定需求。
7. **限制比較**：如果官網搜尋無法被瀏覽器直接讀取、不能通過 CORS、官方未提供穩定介面，明確評估不加代理後端情況下「靜態 JSON／CSV 副本與本地比對」及「跳到官網搜尋頁」兩條最低成本備援路線，不要為達成理想效果偷偷建 proxy 或引入額外收費服務。

## 3. Codex Cloud 執行步驟（讀取／驗證／報告）

- **Gate A — Repo baseline**：先讀 `AGENTS.md`、`README.md`、`PROJECT_STATE.md`、`NEXT_TASK.md`、`docs/PRODUCT_PLAN.md`、`docs/RESULT_CONTRACT.md`，再定位現行檢索 transport 與結果顯示、offline tests、hosting build 的真實檔案；紀錄 main commit SHA、Cloud 環境網路限制。不得修改程式碼。
- **Gate B — 原官網查詢機制**：從 `AGENTS.md` 記錄的官方 1999 FAQ 參考頁起，確認實際現行網址與表單；分別以「信用卡」「房屋稅」測試標題、內文查詢（只要保守少量請求），保留 request 方法／URL／參數（若含敏感 token 必遮罩）、response 狀態與是否找到預期公開題目；不可捏造答案或筆數。
- **Gate C — 資料／跨網域**：對可公開存取的搜尋或匯出介面做小量 CORS preflight／GET、瀏覽器 fetch 測試；以 `https://taipei-tax-lab.github.io` 作目標 origin（必要時記錄實際 browser page origin 與測試限制）。伺服器可取、瀏覽器禁止、Cloud proxy 阻擋／TLS 或 timeout、來源 403／404，分開記錄。禁止關閉 TLS 憑證驗證、改用不安全 bypass、要求加入私人 Cookie／憑證。
- **Gate D — 前端契約**：只用既有 fixture／mock 與原始碼判斷零結果、錯誤及競態條件；提出若日後實作，如何避免舊查詢結果覆蓋新查詢、timeout fallback 誤啟動、GA4 重複記錄與 XSS／不安全來源連結。不要新增正式 UI 或行為。
- **Gate E — 比較與結論**：完成以下決策表（每一項用證據支持）：
  - A1 原官網搜尋可直接在前端跨網域讀取並顯示：是否真的可行、預期變更量、維護風險。
  - A2 官網開放 JSON/CSV 可由瀏覽器讀取並在前端比對：是否可行、更新與性能風險。
  - B 在 repo 保留靜態官方 FAQ 副本供本地比對：是否可行、更新責任／來源一致性及檔案大小。
  - C 僅提供原官網搜尋跳轉：是否可行、是否能帶入查詢詞（實證，不能猜 URL）。
  - D 其他方案：僅列真正必要者，說明為何不符合最小成本／不改 CX／不設後端原則。
- 完成後 **STOP**，等使用者與 Web ChatGPT 評估；不得逕行製作整合功能、改 frontend、部署 Pages、變更 production 或 merge PR。

## 4. 實驗與報告規格

研究結果放在 `docs/1999_KEYWORD_FALLBACK_FEASIBILITY_REPORT_2026-10-18.md`。至少包含：
- 採樣日期、Repo SHA、測試環境與 GitHub Pages 真實 origin；實際官方頁 URL（不假設歷史 URL 永遠有效）。
- 實際可重現的 request/response 摘要（方法、去敏感化 URL／參數、HTTP 狀態、關鍵 CORS headers、資料格式／欄位、更新日期）。
- 用「信用卡」「房屋稅」及必要的完整問句對照；測試成功、無結果、阻擋、未執行必須明確區分。
- 當 CORS 不能驗證時標為 `UNKNOWN / BLOCKED`，不得將 Node/curl 成功等同 browser success。
- 不同方案的改動範圍、同步負擔、查詢費用、風險、維護難度與推薦順序（**研究建議，不是實作授權**）。
- 清楚列出對正式網頁、CX、Data Store、Pages、GA4 的變動均為 **0**；附 Git diff `--name-only` 與執行的測試命令／結果。
- 把重要結果更新到 `NEXT_TASK.md` 的研究小節，持久決策（如有）才更新 `PROJECT_STATE.md`；不得將研究假設寫成現況。若需要獨立 branch/PR 方便審查可以提出，不自行 merge。

## 5. 本輪驗收標準

研究完成的定義是：**有足夠證據可決定下一輪最低成本實作方案**，不是網站已支援關鍵字搜尋。即使發生 Cloud 網路阻擋，也必須交出可查核的部分結果和缺口，不可自行繞過安全限制。

再次強調：本輪只准改本 repo 的 Markdown 研究／交接文件與必要的離線研究腳本，現有 1999 網站視覺、runtime、CX、Data Store、正式官方網站 **全部不動**。
