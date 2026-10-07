# 1999 AI 靜態 hosting package

本輪僅交付待審查的實作套件；`config.liveEnabled=false`，沒有部署、修改 Messenger Console 或送出 Production 問題。

## 本機預覽

在本目錄執行 `python -m http.server 8765 --bind 127.0.0.1`，開啟 `http://127.0.0.1:8765/demo.html`。此 server 僅提供靜態檔案，不是新增正式 backend。

- `demo.html`：隔離 mock transport，六種合成 fixture；不載入 Google SDK，不呼叫 CX。開發 console 可讀 `demoHarness.requests`、`demoHarness.lastResponse`。
- `index.html`：正式頁面的待部署檔案，預設顯示「服務準備中」，查詢停用。只有經另案確認後才設定 `liveEnabled=true`。
- 頁面只保留最新結果；Messenger transport 維持同 session，首次 request 指定 FAQ Playbook，後續移除 override。新載入、明確 reset／clear／expiry 重新 arm；不新增 `entry_context`。
- 沒有自訂 API、fetch、webhook、proxy、Cloud Run、聊天泡泡、opener／close／referrer 相依性。

## Hosting package

正式 Revenue Service URL：`https://REVENUE_SERVICE_HOST_PLACEHOLDER/1999-ai/`（placeholder，未建立）。

`hosting.zip` 僅包含 `index.html` 與 `assets/`，另附本 README、result contract 及 maintainer handoff；不包含 demo、測試、raw debugging 或 credentials。以 HTTPS 靜態檔案服務保留相對路徑即可，無 build、npm install 或 runtime server 相依性；JS 必須以正確 JavaScript MIME type 提供。ES modules 需透過 HTTP(S)，不使用 `file://`。

## 另案上線前待確認

|項目|本輪狀態／應確認內容|
|---|---|
|Hosting URL|placeholder；須確認實際 hostname、子目錄、HTTPS、MIME、cache policy 與負責人。|
|Messenger allowed-domain|未讀／未改 Console；須確認實際 hosting hostname 被既有 integration 允許。|
|Production binding|應使用 Environment `a0c712e8-ab0c-4520-b100-d2abcfc85868`；binding 是 Console integration 設定，不是猜測的 HTML `environment` attribute。尚未驗證當前 integration binding。|
|SDK resources／CSP|JS 入口為 `https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js`。主頁自己的 JS／CSS 同源；SDK 可能再載入資源、動態樣式與建立 API connections。須在獲授權的部署驗證中記錄實際 resource／connect／font／style origins，再由 hosting owner 訂定 CSP。此套件未宣稱一份未驗證 CSP 可直接上線，未要求停用 CSP。|
|Default UI suppression|使用文件所列 inline `df-messenger-chat` 作 hidden transport child；`df-response-received.preventDefault()` 抑制 SDK transcript。離線 adapter 驗證通過，真實 SDK／指定 hostname 的初始化、事件時序與回應仍未執行驗證。|
|Authentication／privacy|不得把 service account 或 ADC credentials 放入 browser。既有 Messenger 的 auth/domain 模式與資料保留說明須由維運確認；browser SDK storage-option=none、session TTL=1800 秒，初始化開始新 session。|
|Response metadata|歷史 response 有 answer-only；不假定現有 Production 回傳 FAQ title/source。擴充 contract 是 optional，不能為此修改 Playbook/Tool。|
|官網連結|只交付 label + placeholder destination；CMS 的 same-tab／new-tab／window 由維護人設定。|

`sendQuery()` 的 Promise 不含回答；依 documented events 取得 raw／parsed response。載入失敗顯示服務準備中；查詢 timeout／錯誤無自動 retry。Timeout 後等待 SDK operation 結束才允許下一查詢，避免晚到回應混入新結果；未結束時可重新載入頁面開始新查詢。

完整 result contract 見 [RESULT_CONTRACT.md](RESULT_CONTRACT.md)。官方維護人交接見 [OFFICIAL_SITE_HANDOFF.md](OFFICIAL_SITE_HANDOFF.md)。本輪 STOP 等待 Web ChatGPT review，尚未驗證 Production runtime。
