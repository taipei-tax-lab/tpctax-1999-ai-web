# 資訊室靜態網頁交付

交付檔：`hosting.zip`；另附 `hosting.sha256` 與 ZIP 內逐檔 `MANIFEST.json`。
交付策略：先由專案方在 GitHub Pages 以相同 production package 完成 Messenger 真實問答 E2E；通過後，再提供資訊室已驗證 live package。

目前 `packages/hosting.zip` 是 `liveEnabled=true` 的 candidate。人工作證已確認 Pages 真實問答、renderer、Rental parity、追問、真實 reset 與 reset 後問答 PASS。本版新增官方首頁品牌連結與最小 GA4；GA4 真實網路收送仍待可信任瀏覽器驗證，**尚不可作為 GA4 已驗證正式交付版**。390px 與 Console/network 檢查維持 deferred，並非本次修改或部署 blocker。放行狀態請以 `NEXT_TASK.md` 最新 completion summary 與 `docs/PAGES_DEPLOYMENT.md` 為準；下方早期驗證記錄保留作歷史證據。

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
GA4 失敗不阻擋問答。僅自動 page_view 與每 tab storage session 首次有效
問題的 `ai_question_start`；custom event 無問題、答案或來源參數。
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

Rollback：移除／停用入口連結，或換回前一版 static package（含快取更新）。


## 交付策略更新

正式交資訊室前，專案方會先在 `taipei-tax-lab.github.io` 部署與資訊室
最終收到的相同 production package，完成 Dialogflow Messenger Production
browser E2E。

因此資訊室收到的應是已完成 live 驗證的 package，而不是 disabled 預覽版。
掛載後仍需回覆最終 HTTPS URL，以便做 agency-host 的簡短 headers/resource
確認；不需要再次修改 Playbook、Messenger binding 或 allowed domain。


## GitHub Pages 部署進度 — 2026-10-08（臺北時間）

測試 URL：`https://taipei-tax-lab.github.io/tpctax-1999-ai-web/`。
Pages Source 已驗證為 Actions/workflow；production-only artifact 部署、
ZIP 逐檔線上比對、排除 demo/tests/tools/repo 內部檔案均通過。

Codex Cloud 的 Chromium 在頁面載入前回報 `ERR_CERT_AUTHORITY_INVALID`；
相同代理下 curl/HTTPS 檔案比對通過憑證驗證。另有
`fonts.googleapis.com` hostname 探測遭 CONNECT 403，但尚未觀察到 SDK
實際是否需要此 host。未送出 Production 查詢，不能據此判定 Messenger
或網站故障。需使用可信任代理 CA 的瀏覽器完成首次問答、追問、真實 reset、
reset 後問答及 390px/CSP/CORS/console 檢查，才能放行正式資訊室交付。

此次文件更新隨 candidate 重新打包；runtime 檔案未變更。尚未新增官方入口。

## Renderer parity candidate 更新 — 2026-10-08

本次重新打包安全粗體與 Markdown 連結呈現，以及答案 inline URL 的普通
來源去重修正。實際交付 ZIP 的 SHA-256 以外附 `hosting.sha256` 為準；
部署 run／commit／hash 另記於 repo 的 `docs/RENDERER_PARITY.md`。
封面 UI、config、Messenger session/reset/first-turn routing 與 CX backend
均未變更。資訊室最終路徑仍不需改程式。

原本的人工作證已確認 Pages 可以送出真實問答；新版仍需 trusted-browser
完成格式、追問、reset 後問答、390px 與 console/CSP/CORS 檢查，並取得
Rental native Messenger 的 FAQ-route 格式 parity 證據。離線 renderer PASS
不能代替上述 live 驗證；完成前仍是待驗證 candidate，尚不可當作已驗證
正式交付版。尚未新增官方 1999 入口。

## 最新人工作證與品牌／GA4 candidate — 2026-10-08

人提供普通 Chrome 證據，已完成上述 renderer、Rental native parity、
同 session 追問、真實 reset 與 post-reset 問答；不需再修改 CX backend。
390px 與 Console/network 檢查保留 deferred，不作本次任務 blocker。
本版兩個 header 品牌連結均改為同頁開啟 `https://tpctax.gov.taipei/`，
既有 logo／layout／FAQ 返回連結不變。新增 `assets/analytics.js`，production
ZIP 現含 index.html、九個 assets、IT_HANDOFF.md、MANIFEST.json，共 12 檔。
GA4 ID 已核定並設定；離線測試通過不能代替實際 script／collection 驗證。
正式 IT-ready 仍為 NO，待 GA4 live 網路驗證；這不阻擋已授權的 Pages 部署。
ZIP hash 以外附 checksum 為準，部署 run／SHA／逐檔核對見 repo
`docs/PAGES_DEPLOYMENT.md`。最終 agency 路徑仍不需 rebuild；尚未新增官方入口。
