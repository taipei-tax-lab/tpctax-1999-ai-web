# 資訊室靜態網頁交付

交付檔：`hosting.zip`；另附 `hosting.sha256` 與 ZIP 內逐檔 `MANIFEST.json`。
交付策略：先由專案方在 GitHub Pages 以相同 production package 完成 Messenger 真實問答 E2E；通過後，再提供資訊室已驗證 live package。

目前 `packages/hosting.zip` 是 `liveEnabled=true` 的待驗證 candidate，尚未完成 live E2E，**尚不可作為已驗證正式交付版**。放行狀態請以 `NEXT_TASK.md` completion summary 為準。

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
