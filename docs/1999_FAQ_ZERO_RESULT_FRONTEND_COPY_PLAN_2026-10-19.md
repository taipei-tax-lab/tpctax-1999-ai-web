# 1999 AI｜FAQ 查無結果提示前端小改版計畫（2026-10-19）

**狀態：人工已核定文案與前端小改方向；交 Codex 實作於獨立分支。未授權直接合併 main 或部署。**

## 一、決策與背景

- 1999 AI 以如期上線為優先。已核定：目前保留現行 CX 原生結構化 FAQ 檢索，不在這輪改善簡短關鍵字的 recall。
- CX 後端 Repo 為 `taipei-tax-lab/dialogflow-cx-qa-framework`；本輪**只在本前端 Repo**處理真正 FAQ 零結果的顯示文字。
- Production FAQ Flow v1、Data Store `tax-1999-faq-v4` 623 題、四欄 schema、Messenger currentPage、Environment、GA4、出租專區導引與官方原文連結**全部維持不變**。
- 不整合傳統關鍵字搜尋、不新增第二套 FAQ、不新增後端或重試、不做任何 CX runtime 研究或 GCP mutation。
- 後端「短詞查無結果」的研究保留於研究分支，不是前端此輪部署依賴；請勿擅自將其合併入後端 main。

## 二、民眾實際看到的確定文案

只在**確定為真正 1999 FAQ zero-result**時，將原本的第一段：

> 找不到可用的 FAQ 搜尋結果，請換個方式描述問題。

在本頁的**顯示層**改成下列**完全一致**文字（不增加標題、例句或官網搜尋建議）：

> 暫時沒有找到符合您需求的 1999 常見問答。請試著補充問題的具體情況，讓我們為您搜尋更相關的官方資訊。

現有第二段固定出租導引必須原樣保留，且仍可點擊「出租專區」：

`出租房屋租稅優惠專責諮詢，請前往出租專區：https://tpctax.gov.taipei/cp.aspx?n=3A978B4E3ADD88F2`

網頁右上角原有「返回本府1999常見問答」連結**不刪、不改、不刻意加入本提示文字**。不新增查詢關鍵字、返回官網按鈕、動態問句建議或額外 UI。

## 三、辨識真正零結果的嚴格規則

已封存且正式使用中的 FAQ zero backend 回應，含**固定兩段**文字：

1. `找不到可用的 FAQ 搜尋結果，請換個方式描述問題。`
2. `出租房屋租稅優惠專責諮詢，請前往出租專區：https://tpctax.gov.taipei/cp.aspx?n=3A978B4E3ADD88F2`

僅在**Messenger 成功收到的 FAQ 查詢結果**中，完整文字等於上面兩段（容許既有受控的換行／空白分段處理），且沒有 FAQ info card、有效 FAQ item、額外非預期答案文字或與 zero 矛盾的正面結果，才觸發特殊顯示。

- 原始 backend 回應保持不變、可追查；**僅前端顯示文字替換**。若需標記零結果，可在正常化結果增加明確、經驗證的標記，但不要對所有文字套用關鍵字替換。
- **不可**只以 `items.length === 0`、一般「找不到」字樣、無 cards、空字串、empty payload 或 generic text 判定 zero。
- API/service error、timeout、session expiry、SDK 解析問題、遲到／過期回答，都**不**能偽裝成查無結果。
- 對於未知格式、缺少完整兩段文字或互相矛盾的 response，維持原有完整 text-first 顯示與錯誤分流；不可臆測或丟失官方答案。
- 確保加入新文案後仍保留既有 `appendText` 的 Rental 特殊可點擊連結處理；FAQ 0 結果是有內容的有效回應，不能誤走 `app.js` 的 empty state。
- 優先修改 `assets/result-model.js` 的安全辨識／呈現相關部分與其對應測試；只有必要才修改 `assets/app.js`。避免大範圍重構與 CSS 改版。

## 四、測試與驗收

- 以既有正式 zero 回應形狀與合成 fixtures 覆蓋：raw text、SDK parsed-only（完整兩段時）、正常 1／2／5 題、一般純文字、混合／未知格式、帶有「找不到」但不是 fixed zero 的文字、空結果、缺卡／壞卡、service error、timeout、session expiry、連續查詢與 stale result。
- 對真正 zero，斷言**新文案精確一致**、舊文案不出現在民眾可見的回應、Rental 導引保留且連結可正常開啟。
- 對正常 FAQ，原問題、完整答案、官方連結、列表順序、來源驗證與安全 DOM/text-first 行為維持原樣；不得為修改文案而改動 CX 回應內容。
- GA4 每次 accepted send **仍僅一次** `ai_query_submit`，不送查詢／答案文字；輸入框 accepted 後清空與結果標題、Messenger per-query currentPage、相關 session 恢復行為不退步。
- 執行 `npm test` 及可用的既有離線瀏覽器測試（包含 390／320px），並以既有 deterministic packaging、SHA/manifest 等流程驗證候選打包的完整性；如環境擋住實測，誠實標記 PENDING，不能冒充通過。
- 不向 Production CX 發送新的測試查詢，除非未來另獲明確授權；本輪優先使用封存 fixture／本機 mock。

## 五、Codex 工作流程與停止條件

1. 從**目前前端 main** 開新工作分支；依 `AGENTS.md` 規定閱讀 README、PROJECT_STATE、NEXT_TASK、PRODUCT_PLAN、RESULT_CONTRACT 與本計畫。
2. 只實作前端 FAQ zero 的文案替換與必要的單元／離線瀏覽器測試；保留所有原有功能。
3. 依 repo 現行打包流程產生候選驗收檔（如有 package 內容變更則同步更新 package/checksum）。列出實際變更檔案及測試證據。
4. Commit/push 工作分支，**停止交由 ChatGPT 審核**；不自行合併 main、不觸發 GitHub Pages 正式部署、不修改後端 Repo、GCP 或官方網站。
5. 人工審核確認後，才另行批准 merge／正式部署；不因前端文案改動重跑後端研究或修改 Data Store。

**完成標準：**只讓真正 FAQ 查無結果的民眾看到核定的新版提示，其餘功能、CX、Data Store、GA4 和官方連結均無變更。
