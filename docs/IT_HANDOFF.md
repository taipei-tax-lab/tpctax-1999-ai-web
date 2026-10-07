# 資訊室靜態網頁交付

交付檔：`hosting.zip`；另附 `hosting.sha256` 與 ZIP 內逐檔 `MANIFEST.json`。
此版為首次掛載檢查版，`liveEnabled=false`；畫面顯示「服務準備中」、
查詢按鈕停用是預期行為。先確認靜態頁面，再由專案方交付 live 設定版。

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
不要預先加入 wildcard、全面允許 inline，或停用 CSP。首次 disabled 版不會
載入 Messenger；它通過不代表 live SDK/CORS 已通過。

後續 live 設定版需載入官方 Dialogflow Messenger SDK：
`https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js`。
SDK/resource/API 若被擋，由後續 browser E2E 依實際 request/CSP/CORS 證據，
交付精確來源清單再調整。避免拿網站 root 的 headers 代替此頁的 headers。

## 掛完請回覆

- 完整正式 HTTPS URL、實際可存取方式及是否有 redirect／登入限制。
- 掛載完成時間、使用的 `hosting.zip` SHA-256，並確認資料夾結構完整。
- `index.html`、`assets/config.js`、CSS、圖片的 HTTP status、Content-Type、
  cache headers，以及實際 CSP／CSP-Report-Only、X-Frame-Options、
  Referrer-Policy、Permissions-Policy、COOP／COEP／CORP、相關 CORS headers
  （如未設定，請註明）。可直接提供 headers 擷取，不需另做長篇報告。

收到上述資訊後，專案方核對掛載並另行確認 live switch／Production E2E
時段及授權；再交付 config-only 更新。更新 `assets/config.js` 時請清除或
重新驗證該檔及頁面的快取，避免瀏覽器繼續使用 disabled 版。

Rollback：移除／停用入口連結，或換回前一版 static package（含快取更新）。
