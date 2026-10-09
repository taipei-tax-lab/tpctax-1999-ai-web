# 資訊室靜態網頁交付

交付檔：`hosting.zip`；另附 `hosting.sha256` 與 ZIP 內逐檔 `MANIFEST.json`。
交付策略：先由專案方在 GitHub Pages 以相同 production package 完成 Messenger 真實問答 E2E；通過後，再提供資訊室已驗證 live package。

## 目前契約 — 2026-10-09

本版是 `liveEnabled=true` 的 direct FAQ Flow production candidate。1999 AI
Web 本身是服務入口，每題獨立搜尋 canonical 623 FAQ，不經 Router／Rental。
每個 accepted text query 與 SDK defaults 固定 currentPage：

`projects/serviceagent-1150909/locations/asia-northeast1/agents/799426c1-ba69-49dc-85e4-5065985706e2/flows/676409b6-b02f-4a24-9d3a-81e14cb77d4f/pages/START_PAGE`

保留 `timeZone=Asia/Taipei`、Agent `799426c1-ba69-49dc-85e4-5065985706e2`、
location `asia-northeast1` 與 integration-side Production Environment
`a0c712e8-ab0c-4520-b100-d2abcfc85868`；不增加猜測的 Environment HTML attribute。
正式 request 不送 currentPlaybook。後端 Flow v1 已部署，權威 handoff 位於
`dialogflow-cx-qa-framework/docs/1999_FAQ_WEB_FLOW_HANDOFF_2026-10-09.md`。

畫面只顯示最新結果；所有 text ResponseMessages／array items 按順序保留。
既有 info cards 的原題目／完整答案／官方 URL 與 text 完整核對後，1～5 筆
以編號、原題目超連結、完整答案與細分隔線呈現；來源裸 URL 不另列。
Cards 非必要：已確認的逐筆 text 可保守轉換，未知格式仍呈現完整 text，
不以答案內的編號拆筆。出租專區導引保留為獨立「出租專區」連結，前端
不分類或呼叫 Rental。
沒有使用者 reset／對話概念；接受送出才清空輸入框，接受前失敗保留文字。
Technical session recovery 內部使用，timeout 不自動 retry，晚到答案不顯示。

Flow cutover 已由人工接受為 LIVE / USABLE。本輪僅更新 FAQ 結果呈現，
新的真實 Messenger 視覺確認仍需可信任瀏覽器；Cloud proxy／CA 阻擋時
該項保持 PENDING。GA4 receipt 為 non-blocking operational follow-up；
不因目前 Realtime／DebugView 無法觀察而阻擋 UI deployment。
資訊室實際 host 的驗證仍獨立，放行以 repo `NEXT_TASK.md`／
`PAGES_DEPLOYMENT.md` 最新證據為準。

## 掛載

1. 將 ZIP 內容解壓至 `services.arpa.tpctax.dof.gov.taipei` 下雙方同意的任一
   HTTPS 目錄；final path 由資訊室決定，選定路徑不需改程式或重新打包。
2. 保留 `index.html`、完整 `assets/` 及其相對資料夾結構。以目錄 URL（結尾
   `/`）或明確的 `index.html` 提供頁面；無結尾斜線的目錄請重新導向至含 `/`
   的 URL。不要移植至 CMS 頁面內、注入 `<base>` 或改寫資源路徑。
3. 依下表提供 MIME；不要把找不到的 `.js`／圖片回傳成 HTML 頁面。
4. 回覆掛載後完整 HTTPS URL。首次檢查版先不增加官網公開入口；驗證完成後，
   原 1999 官網只需一般 hyperlink/button，名稱為「1999 AI 智慧問答」，
   指向回覆的正式 URL。不使用 iframe。

| 檔案 | Content-Type |
| --- | --- |
| `.html` | `text/html; charset=utf-8` |
| `.js`（ES modules） | `text/javascript`（亦可 `application/javascript`） |
| `.css` | `text/css` |
| `.png` | `image/png` |
| `.gif` | `image/gif` |
| `.json` | `application/json` |

## Headers 與後續 live 檢查

若伺服器有 CSP/security headers，請提供實際頁面及資源的 response headers；
不要預先加入 wildcard、全面允許 inline，或停用 CSP。GitHub Pages 驗證
不能代替資訊室實際掛載路徑的 headers／CSP／CORS 驗證。

live package 需載入官方 Dialogflow Messenger SDK：
`https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js`。
SDK/resource/API 若被擋，由後續 browser E2E 依實際 request/CSP/CORS 證據，
交付精確來源清單再調整。避免拿網站 root 的 headers 代替此頁的 headers。

本版另使用直接 GA4 gtag（沒有 GTM），人核定 Measurement ID 為
`G-S891SFSMBH`。本機 module 必須可載入；唯一已知新增外部 bootstrap URL：
`https://www.googletagmanager.com/gtag/js?id=G-S891SFSMBH`。
其 script origin `https://www.googletagmanager.com` 是實作所需的精確來源，
2026-10-08 12:54:12 臺北時間 HTTPS 探測遭 Cloud proxy CONNECT 403，尚未
取得 origin 回應。這不是資訊室 CSP 或 GA4 故障證據。gtag 後續實際
subresource／collection hosts 尚未觀察，**目前不提供猜測的 connect-src
或 wildcard 清單**；需在可信任瀏覽器擷取實際 request 後補齊。
GA4 失敗不阻擋查詢。僅自動 page_view 與每個 accepted query 一次
`ai_query_submit`；第一／第二／第三搜尋各 +1，不送問題、答案、FAQ 或來源
文字／URL 參數，沒有 reset event。Core 初始化後才 idle 載入 GA4，排程不變。
完整契約與報表定義見 repo `docs/ANALYTICS.md`。

## 掛完請回覆

- 完整正式 HTTPS URL、實際可存取方式及是否有 redirect／登入限制。
- 掛載完成時間、使用的 `hosting.zip` SHA-256，並確認資料夾結構完整。
- `index.html`、`assets/config.js`、CSS、圖片的 HTTP status、Content-Type、
  cache headers，以及實際 CSP／CSP-Report-Only、X-Frame-Options、
  Referrer-Policy、Permissions-Policy、COOP／COEP／CORP、相關 CORS headers
  （如未設定，請註明）。可直接提供 headers 擷取，不需另做長篇報告。

收到上述資訊後，專案方核對已驗證 package 的掛載及正式路徑的
headers/resource，於約定時段做 agency-host 的最小 live browser 確認。
選定 final path 不需 rebuild 或再做 live switch；請清除或重新驗證頁面與
`assets/config.js` 的快取，避免瀏覽器使用前一版。

## Frontend rollback

Launch-critical 問題僅恢復 prior static Web／first-query currentPlaybook transport
並重新部署／更新快取；舊 Playbook 完整 resource：

`projects/serviceagent-1150909/locations/asia-northeast1/agents/799426c1-ba69-49dc-85e4-5065985706e2/playbooks/f0512949-95f2-40c6-95d0-0c139b84b542`

移除 request interceptor 與 SDK defaults 的 FAQ currentPage。完整步驟見 repo
`docs/FAQ_FLOW_ROLLBACK_2026-10-09.md`。不修改 Rental／Agent／Production
mappings／Messenger binding，既有 backend Flow mapping 可留存但不被選取。
尚未新增官方入口；agency-host 正式交付需完成上述 live 驗證。
