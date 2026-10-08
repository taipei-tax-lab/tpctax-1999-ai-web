# 通用回答 normalized model

```json
{
  "answer": "CX 回傳的主要文字（必要）",
  "sources": [{"url": "https://example.org/", "title": "可省略"}],
  "faqMetadata": {"kind": "official1999Faq", "title": "明確 FAQ 標題", "url": "https://tpctax.gov.taipei/..."}
}
```

`answer` 為 required string；空白值進入 empty state，不合成稅務回答。所有 Playbook 都能只靠 answer 顯示結果。沒有 FAQ metadata 仍是有效回答；有來源則顯示一般「參考資料」。

## Extractor

1. 優先 Messenger `event.detail.data.messages` 中 `type=text`、string `text`；多段以空行連接，保留原字句。
2. 若 parsed text 不存在，讀取 `event.detail.raw.queryResult.responseMessages[].text.text[]`。
3. 僅採用明確 citation message／citation list 或以下 versioned extension 的 sources。答案原文中的安全 HTTP(S) URL／Markdown link 可在答案內點擊；若該 URL 已在答案內呈現，不再重複列入下方一般「參考資料」。只有額外且未在答案內呈現的 structured source 才另列。沒有猜測來源 title；僅有額外 URL 時用實際 hostname 作 link label。
4. 不讀 diagnosticInfo 作 FAQ metadata，不從 active Playbook、question、官方 domain 或 URL pattern 推定 FAQ。

可選未來 extension：`responseMessages[].payload.universalAnswer`，`schemaVersion=1`，含 optional `answer`、`sources[]`、`faqMetadata`。只有主要 text 缺少時才採用 extension answer。這不是已觀察的 Production 契約，也不要求更改任何 CX resource。

FAQ card 必須同時具備 versioned extension、明確 `kind=official1999Faq`、非空 title、absolute safe URL 且 origin 在明確 `officialFaqOrigins` allowlist；缺一即省略。URL 必須 HTTP(S)，不能含 username/password；拒絕 javascript/data／相對 URL。若日後 response 使用其他可靠結構，應另案根據實際 evidence 加 adapter；不得猜欄位。

## Grounding 與呈現

已驗證歷史 Phase7C Drive archive `1bW4PwMhsAAZSilbqRTgYDWUug8_0bYa4`（SHA-256 `c9af5e71aaa30950dddd6e3ec0339d0a818bfd5b3549733bd277d915455436fc`）；其中 `041_response.json` 的 primary responseMessages 只有「銀錢收據之印花稅稅率為每件按金額千分之四計算。」文字，並無 FAQ title/source structured message。本輪沒有重新向 CX 查詢。

Renderer 仍禁止插入或執行 response HTML，但允許以 DOM node 安全呈現已明確核准的最小 Markdown 子集：`**粗體**` 與 `[連結文字](HTTP(S) URL)`；不使用 `innerHTML`，不執行任意 HTML／script，也不擴充圖片、表格等完整 Markdown。裸 HTTP(S) URL 保留安全自動連結。Markdown link 只顯示 link label，不顯示目的 URL 文字；相同 URL 若已在 answer inline 呈現，下方普通 sources 不重複顯示。每次新結果清除舊的 answer／FAQ／sources，只顯示最新 query；無完整 conversation transcript。metadata 驗證僅檢查格式與允許 origin，不宣稱 FAQ 存在或其內容已人工驗證。

## Messenger 與 session

Custom form → `df-messenger.sendQuery(query)` → `df-request-sent` mutates requestBody.queryParams → `df-response-received` → normalized result。首次 request 設定完整 FAQ Playbook name；同 request event 後 `setQueryParameters({timeZone:'Asia/Taipei'})` 解除 defaults；後續 request 明確刪除 `currentPlaybook`。首次 override 是 Playbook resource name，不是 version name。

`startNewSession({retainHistory:false})` + re-arm 用於 reset／expiry；adapter clear() 先 clearStorage 再 reset。任一時間只接受一個 request；timeout 不 retry，SDK 未 settle 前保持 locked，晚到 response 不顯示。Session expiry 中斷 query、等 operation settle 後 reset，不重送原問題。沒有 `entry_context`。

官方 API/event 參考（2026-10-07 閱讀）：

- https://docs.cloud.google.com/dialogflow/cx/docs/concept/integration/dialogflow-messenger/javascript-functions
- https://docs.cloud.google.com/dialogflow/cx/docs/concept/integration/dialogflow-messenger/javascript-events
- https://docs.cloud.google.com/dialogflow/cx/docs/concept/integration/dialogflow-messenger/html
- https://docs.cloud.google.com/dialogflow/cx/docs/concept/integration/dialogflow-messenger

Offline fixtures 不是稅務品質測試，不能證明 live SDK／Production 回答或路由；FAQ metadata fixture 明確標示合成。

## 安全呈現實作與測試 — 2026-10-08

`answerParts()` 是 normalization 的 inline URL 清單與 DOM renderer 共用的
最小 parser。它只建立文字、`strong` 與安全 `a` 節點；Markdown 連結中的
URL 可含成對括號，連結 label 可有粗體，粗體中可有安全連結。不建立巢狀
anchor。未閉合、不安全或空 label 的連結保留原文；`![image](URL)` 保留
原文，不載入圖片。不支援其他 Markdown 語法或 HTML 解譯。

安全裸網址保留原字串作 link label，href 依 `safeUrl()` 正規化；移除句末
標點與未配對的右括號時，標點仍保留為答案文字。所有 ordinary structured
sources 以同一正規化 URL 與 inline 清單比對，在 normalizer 和 renderer
兩處抑制重複項目；未重複的額外 citation 與 optional FAQ metadata 不變。
`answer` 原文在 normalized model 中保持完整，呈現時僅移除核准格式的 delimiters。

Node 與真實 Chromium DOM tests 覆蓋粗體／label／換行、裸 URL、去重、額外
structured source、惡意／未閉合目的 URL、raw HTML/script 不執行，以及後續
一般回答清除前次格式。Screenshot scenario 使用明確合成格式 fixture，
不代表 live 回答或稅務品質證據；session/reset/currentPlaybook regression
維持獨立測試。結果見 `NEXT_TASK.md` 與 `RENDERER_PARITY.md`。
