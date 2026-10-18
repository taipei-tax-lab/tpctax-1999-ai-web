# 1999 關鍵字 fallback 可行性研究（2026-10-18）

狀態：**研究交付完成／官網實測與 CORS 證據不完整／STOP FOR REVIEW**。
依據：[唯讀研究計畫](1999_KEYWORD_FALLBACK_FEASIBILITY_PLAN_2026-10-18.md)。本文件沒有實作、資料複製上線或部署授權。

## 1. 決策摘要

目前沒有證據可以把「官網搜尋或開放資料能從 GitHub Pages 的 JS 直接讀取」判為 PASS。官網在 Cloud proxy CONNECT 階段被擋；Pages 的 curl GET 成功，但真實 Chromium 導航遇 CA 錯誤，無法建立目標 origin 進行 fetch。這些是環境阻礙，**不是官網 CORS 拒絕或官網服務故障的證明**。

以最低成本、保留現有架構及目前證據排序：**C → B → A2 → A1 → D**。

1. **C：保留既有官網 FAQ 連結，民眾到官網輸入關鍵字**。不需複製資料或跨網域讀取。現有頁面已提供正常返回連結；本輪不必改功能。能否自動帶入查詢詞尚未實證，不承諾預填。
2. **B：若人工仍要求同頁顯示完整問題／答案／URL，優先評估同源靜態官方副本**。已實測封存標題索引可查「信用卡」8 題、「房屋稅」51 題；但索引沒有答案，完整資料交付、正確性、同步責任仍是前提。
3. **A2：官方 JSON／CSV + 瀏覽器比對**。找到公開資料候選與官網匯出入口的索引證據，尚未取得實體檔、完整 URL 欄位、筆數與 CORS；暫不可選為已驗證方案。
4. **A1：即時抓官網搜尋 HTML/API**。沒有拿到真實表單 method／field name／request，更沒有 browser 可讀證據；即使以後 CORS 可行，HTML／分頁／CSRF 的維護成本仍需評估。
5. **D：代理後端、付費搜尋服務或調整 CX**不符合本輪與既定最小成本邊界。

若唯一目標是改善同頁檢索，B 是條件式首選；若先求最低維護成本，C 最合理。**本輪證據足以排除「直接進入 A1/A2 實作」；尚不足以核准同頁完整問答方案。** 不把 Cloud 阻擋當作已證明 A1/A2 永遠不可行。

## 2. 採樣、版本與現況

| 項目 | 核對結果 |
| --- | --- |
| 採樣日期 | 2026-10-18，Asia/Taipei；HTTP 主要樣本約 17:11–17:13，browser probe 自 17:13:58 起 |
| Web main 基準 | `5f180504c085754256842fa3a2214ab1f0e671bb`，已 fetch 同步 |
| 研究分支 | `research/1999-keyword-fallback-2026-10-18`，從上述 main 分出；不 merge |
| 後端 main 唯讀基準 | `63fa97d61b426b09d16302f7ad8d522b9bebb25f` |
| 後端權威文件 | [current architecture](https://github.com/taipei-tax-lab/dialogflow-cx-qa-framework/blob/63fa97d61b426b09d16302f7ad8d522b9bebb25f/docs/CX_CURRENT_PRODUCTION_ARCHITECTURE.md)、[baseline JSON](https://github.com/taipei-tax-lab/dialogflow-cx-qa-framework/blob/63fa97d61b426b09d16302f7ad8d522b9bebb25f/config/current_production_baseline.json)，最後 authenticated 驗證 2026-10-13；本輪沒有重跑 GCP 驗證 |
| 現行 1999 | 每題 `currentPage` → FAQ Flow `676409b6-b02f-4a24-9d3a-81e14cb77d4f/pages/START_PAGE`；Production FAQ Flow v1 → `tax-1999-faq-v4`；623 indexed canonical、aliases 0 |
| Tokyo Production | 四項 mappings：FAQ Flow v1、Router v1、Rental v3、Rental Tool v1；不是舊交接的六項／Rental v2 |
| 正式前端 | 純 HTML/CSS/JS、Messenger transport；`liveEnabled=true`、既有 LIVE / USABLE 延續 |
| 已知部署來源 | `87411897eb48ffc21516498f18542206cdd45908`；hosting ZIP SHA-256 `8a2937cd4c43b2c8e99a17b0d13a381edec4cc467ca2976bc1a7b00da7baf1b4`，本輪未變 |
| Pages URL／目標 origin | `https://taipei-tax-lab.github.io/tpctax-1999-ai-web/`／`https://taipei-tax-lab.github.io`（origin 不含 repo path） |
| 官網歷史參考入口 F | [本府1999常見問答](https://tpctax.gov.taipei/News.aspx?n=BB8B93F0A49EAB80&sms=87415A8B9CE81B16)；當日最終 redirect／頁面內容未能直接核對 |
| Runtime | Node 24.19.0、Python 3.12.14、Chromium 151.0.7922.173、Playwright；本機暫存 `work/keyword-fallback/`，不納入 production build／提交 |

先讀 `AGENTS.md` 及指定五份現況文件，再讀研究計畫、現行 app／transport／model／demo／tests／packager／Pages workflow。歷史 Playbook 路由及舊 rollback 不適用；沒有恢復或變更任何後端資源。

Cloud runtime status 為 current observations，但 HTTP policy state 為 `unknown`，不能宣稱已完整 enforced。executor 的 `/etc/codex/network-policy.json` v1 是 restricted；custom hosts 僅 `dialogflow.cloud.google.com`、`services.arpa.tpctax.dof.gov.taipei`、`taipei-tax-lab.github.io`、`www.gstatic.com`，未含 `tpctax.gov.taipei`／`data.taipei`；VPN false、TCP grants 空，無已配置 GCP identity／secret。本輪沒有變更環境設定。

初次 git fetch 遇本機 socket sandbox 限制；使用執行工具支援的 network permission 後，同一受管 proxy 下 fetch 成功。這不會擴充目的地 allowlist；官網仍 CONNECT403。沒有關閉 TLS、改走直連、設定不安全 bypass 或要求私人 Cookie。

## 3. Gate B：官網搜尋入口與四種關鍵字測試

公開搜尋索引的官方頁面摘要顯示 F 有「單元查詢」、分開的「標題」「內容」輸入欄，以及 RSS/XML/JSON/CSV 標籤。例如 [官方分類頁索引來源](https://tpctax.gov.taipei/news.aspx?_CSN=0C40F138799A2FD6&n=BB8B93F0A49EAB80&sms=87415A8B9CE81B16)；這是索引中的內容，**不是真實表單 DOM／封包**。`_CSN` 的索引頁也不能當作 keyword 參數證據。

| 必答欄位 | 結果與證據界限 |
| --- | --- |
| 現行可存取入口／redirect | F 的 GET 在 CONNECT 被擋；最終官網 URL 未驗證，不能以索引 URL 保證當日可用 |
| 表單 HTTP method／action | UNKNOWN；未取得 origin HTML／script／request |
| 標題／內文欄位 | 索引可見兩個欄位的標籤；實際 HTML `name`／request key UNKNOWN |
| keyword 參數、編碼、GET/POST | UNKNOWN；未猜 `q`、`keyword`、`Search` 等參數，未送未知 POST |
| 分頁／分類是否改變匯出範圍 | UNKNOWN；索引有分類／分頁，尚無封包證據 |
| 結果 URL／逐題鏈結 | 有封存 canonical URL 可核對；不是本輪搜尋表單回傳的結果鏈結 |

| 測試詞 | 官網標題查詢 | 官網內文查詢 | 預期核對方式 |
| --- | --- | --- | --- |
| 信用卡 | **NOT EXECUTED / BLOCKED** | **NOT EXECUTED / BLOCKED** | 看是否有信用卡繳地方稅的公開題目；不可虛構筆數 |
| 房屋稅 | **NOT EXECUTED / BLOCKED** | **NOT EXECUTED / BLOCKED** | 記錄實際 total／分頁、原題目／完整答案／URL |
| 有那些地方稅可以用信用卡繳納？ | **NOT EXECUTED / BLOCKED** | **NOT EXECUTED / BLOCKED** | 封存對照題；不是新 live 查詢 |
| 房屋稅差別稅率2.0修法重點為何? | **NOT EXECUTED / BLOCKED** | **NOT EXECUTED / BLOCKED** | 同上 |

未提交的原因是入口已無法讀取，無法知道真實 action／method／欄位；不是查詢已成功但零結果。沒有用搜尋引擎命中數代替官網查詢數，也沒有將使用者所述 CX 短詞 miss 當成本輪再現結果。

## 4. Gate C：HTTP、資料介面與瀏覽器跨網域

### 4.1 實際 request／response

以下均匿名、無私人 Cookie／Authorization、TLS verification enabled。完整去敏摘要、重現程式與 hashes 見 [測試證據](1999_KEYWORD_FALLBACK_TEST_EVIDENCE_2026-10-18.md)。

| ID | Request | 真實結果 | CORS／格式／redirect 解讀 |
| --- | --- | --- | --- |
| H0 | GET F | curl exit56、CONNECT403、origin HTTP `000` | 未取得官網 headers/body；不是官網403 |
| H1 | GET F，`Origin: https://taipei-tax-lab.github.io` | 同 H0 | ACAO／ACAC／Vary／Content-Type **UNKNOWN**；proxy 自身 `text/plain` 不算來源格式 |
| H2 | OPTIONS F，Origin 同上、`Access-Control-Request-Method: GET` | 同 H0 | 僅入口探測，未到 origin；不代表已對真實搜尋／匯出 API 完成 preflight |
| H3 | GET Pages URL | **HTTP200**、2,908 bytes、`text/html; charset=utf-8`、redirect0 | Pages 回 `Access-Control-Allow-Origin: *`；這只屬 Pages，不能用來推論官網 CORS |
| H4 | GET [資料平台 FAQ metadata](https://data.taipei/dataset/detail?id=2ab479d3-a115-431f-92de-a1a5c5dea5a0) | curl exit56、CONNECT403、origin HTTP `000` | 未下載 CSV，資料格式／來源 headers 未驗證 |
| B1 | 真實 Chromium 導航 Pages URL | `net::ERR_CERT_AUTHORITY_INVALID`，無 document status | 實際目標 origin 未建立，停在 `about:blank`；跨域 fetch **NOT EXECUTED** |
| B2 | 真實 Chromium 導航 F | `net::ERR_TUNNEL_CONNECTION_FAILED`，無 document status | 表單未載入；不是瀏覽器收到官網 CORS error |

Browser `ignore_https_errors=False`，使用既有 proxy；探測只允許目的 document／預定匿名 fetch，其餘 subresources 阻擋，沒有執行 SDK 或 GA。探測程式首次在錯誤頁讀取 origin 時遇 execution context destroyed；修正記錄方式後僅重跑 browser，沒有再次重試已遭拒的 HTTP 目的地。後次 browser 結果如表。

因此 browser JS 可讀結果一律 **UNKNOWN / BLOCKED**。GET/OPTIONS 在 proxy 層觀察到 redirect0，不表示來源沒有 redirect。Cookie／CSRF／登入要求、rate limit／Retry-After、API SLA 與 CDN cache 全未確認；未做壓力測試。沒有以 `mode:no-cors` 的 opaque response、curl／Node 成功或虛造 Pages origin 取代 browser 驗證。

### 4.2 官方資料候選

| 候選來源 | 已有證據 | 尚缺的關鍵事實 |
| --- | --- | --- |
| F 的 JSON／CSV 匯出 | 官方頁搜尋索引有標籤 | exact href／endpoint、是否有全文、全單元或當頁／分類範圍、筆數、版本日期、跨域 headers、browser fetch |
| [臺北市資料大平臺：臺北市稅捐稽徵處常見問答集](https://data.taipei/dataset/detail?id=2ab479d3-a115-431f-92de-a1a5c5dea5a0) | 官方 metadata 的搜尋索引列 CSV 40.6 KB；資料更新 2026-02-09 15:02:43，詮釋資料更新 2026-02-11 15:19:19；不定期、免費；主要欄位為項次／機關名稱／問題／答案／題數 | CSV 實體網址與資料未取得；實際列數、全文完整性、逐題官方 URL、是否與1999單元一致均 UNKNOWN。欄位清單**沒有列 URL**，不能自行補造；「題數」也不是已實測 row count |
| 後端 [canonical recency index](https://github.com/taipei-tax-lab/dialogflow-cx-qa-framework/blob/63fa97d61b426b09d16302f7ad8d522b9bebb25f/data/1999faq/canonical_recency_index.csv) | GitHub 唯讀實取，623 rows／623 unique URLs，177,656 bytes；問題、canonical URL、日期欄位俱在 | **沒有答案欄位**；這是封存專案索引，不是官網現行開放 API，不能當作 A2 完整 corpus |

資料平台摘要是搜尋索引（當時標示約5日前 crawl），不是本輪直接讀到的 metadata HTTP200。網站共用 footer 的更新日也不能代替資料集更新日。沒有證據證明官網或開放資料剛好623筆；623只屬目前CX／封存索引範圍。

### 4.3 靜態副本的離線可行性實測

從後端 pinned commit 取得標題索引，核對 SHA-256 `bf24c3708ac02b05bdcbcf6947de55429e46b30873793c620fa1878ccf9522d5`，只在 `work/` 做 Python literal substring 比對，沒有製作可上線搜尋模組或修改任何正式檔。

| 查詢 | 封存標題字面命中 | 解讀 |
| --- | ---: | --- |
| 信用卡 | 8 | 標題可找；不代表內文8筆、官網搜尋8筆或CX8筆 |
| 房屋稅 | 51 | 短詞結果可能很多，未做相關性排序或截成5筆 |
| 有那些地方稅可以用信用卡繳納？ | 1 | 完整官方原題的對照 |
| 房屋稅差別稅率2.0修法重點為何? | 1 | 同上 |
| 房屋稅的課稅範圍為何？ | 0 | 原句不在標題中；字面完整問句 miss 不等於 corpus 沒有相關內容 |
| 不存在關鍵詞_20261018 | 0 | 離線無結果控制組 |

信用卡對照 URL 是封存來源明列的 [官方原題](https://tpctax.gov.taipei/News_Content.aspx?n=BB8B93F0A49EAB80&sms=87415A8B9CE81B16&s=4EC468D46203547D)，不是猜出的 URL；本輪未驗證該 URL 當日 HTTP／內容。

研究時計算僅保留 title/url 的 compact JSON 大小為 **125,139 bytes**，gzip **26,267 bytes**（未寫入正式資產）。完整 Q/A/URL corpus 的實測大小 **UNKNOWN**。容量規劃若假設每題答案 UTF-8 1–4 KiB，623題約加0.61–2.43 MiB，再加 metadata；這只是條件估算，不能當下載量實測。標題掃描單次Python觀察小於1ms，但沒有 browser full-answer、低階手機或記憶體 benchmark，不作效能承諾。

## 5. Gate D：真正零結果、錯誤與未來整合邊界

### 5.1 現況程式與離線證據

`assets/app.js:48` 先 await `transport.send()`，再 normalize；只有「沒有非空 answer 也沒有 items」進 empty state。**真正 backend 零結果是非空答案，現在走正常 result，而非 empty/error UI。** `assets/result-model.js:128` 沒有輸出 `noResult`／`resultCount`；缺少 FAQ card 並不代表零結果。

[既有交接](CX_BACKEND_FLOW_HANDOFF_2026-10-09.md)與 `demo/mock-messenger.js:5` 的封存零結果文字為：

```text
找不到可用的 FAQ 搜尋結果，請換個方式描述問題。
出租房屋租稅優惠專責諮詢，請前往出租專區：https://tpctax.gov.taipei/cp.aspx?n=3A978B4E3ADD88F2
```

這是兩個 text array items；normalizer 以空行連接。現有零結果 fixture 是合成契約重播；Production fixture `tests/fixtures/faq-production-messages.json` 是既有正向封存樣本，不能冒充本輪新 Production 零結果。既有文件已記 genuine-zero 驗證，本輪沒有再向CX詢問。

| 類型／重播結果 | 現行 UI／transport | 能否啟動未來自動補查 |
| --- | --- | --- |
| 封存 fixed-zero：answer非空、items0 | result；保留Rental導引，不顯示舊卡 | 僅可能用當前版本完整成功文案／訊息邊界、無矛盾cards作保守判定；尚無穩定結構化no-result contract |
| 正向兩題／card-only | result；cards可獨立有效 | 不可 |
| empty response／malformed text | empty | 不可冒充搜尋零筆；解析錯誤可能丟失有效結果 |
| 普通答案含「找不到」 | result；無FAQ metadata仍合法 | 不可；`includes("找不到")`會誤判 |
| parsed-only文字與fixed-zero相等 | result | 單靠normalize後文字無法知道raw是否完整；應保留未知狀態，不宣稱同等可靠 |
| 未知／改版零結果文案 | result | 不匹配時應保留原答案，不能擴大模糊匹配 |
| SDK錯誤／promise reject | error，`service` | 不可 |
| timeout | error；SDK settle前 locked，晚到答案忽略、不重試 | 不可 |
| session expiry／ended | session提示，settle後內部recovery | 不可；恢復不自動重送，也不加GA事件 |
| SDK尚未載入 | unavailable | 不可 |

現有 frontend **沒有已實作的自動 keyword fallback**。`items.length===0`、無sources、generic answer 或error都不是零筆訊號。若要求跨版本完全可靠的機器旗標，需要另議backend契約；那會超出本輪不改CX範圍。若未來堅持不改backend，應接受保守文案辨識的限制，或用明確人工操作的官網連結。

### 5.2 若下一輪獲准，必須保留的條件（僅研究建議）

- 先取得成功CX回應再辨識當前封存完整zero envelope；錯誤／timeout／empty不觸發。保留原fallback與Rental導引，補查失敗不改寫成無資料。
- 新增非同步補查將超出現有單一CX lock的保護範圍。每次submit需一致的query generation，舊generation的結果不可render；新題開始、expiry或中止時取消舊fetch，render前再比對，避免舊keyword結果蓋新AI答案。這是未來需驗證的新行為，不宣稱現有測試已涵蓋。
- `assets/app.js:66` 的WeakSet目前保證每個accepted Messenger query只記一次`ai_query_submit`。同一題補查不能再送Messenger、再清input或增加GA；不記query/answer/source。若改成免費先查，沒有accepted Messenger request時不應冒記此事件，須先人工決定新的統計語義。
- 官方來源題目／完整答案忠實呈現；不從hostname推定FAQ、不改寫稅務內容、不用HTML直接插入。保留safeUrl、官方origin限制、文字節點與不安全URL拒絕。遠端HTML即使可抓也不可把script/事件屬性送入DOM。
- 既有per-query currentPage、timeout不retry、accepted-send清空、最新query heading、新草稿保留與Rental正常鏈結全部保留。任何變更仍需下一輪明確授權。

## 6. 資料使用與維護

[官網政府網站資料開放宣告](https://tpctax.gov.taipei/cp.aspx?n=0BE82485ABAC7EA8)的公開索引顯示採政府資料開放授權條款第1版並要求出處，保留第三方作品、人格權等例外；索引的宣告資料更新為111-12-21。這支持繼續評估重用，**不能推論允許任意高頻抓取、取得API SLA，或所有資料候選的授權均相同**。資料平台摘要僅標「公開／免費」，仍須讀實際檔案授權與來源。

`robots.txt`、當日存取／流量政策、RateLimit／Retry-After與API服務條款未驗證。已知host被拒後沒有再對猜測路徑發請求；robots未讀不能當作無限制或禁止。採樣只做少量document/OPTIONS及索引查詢，沒有遍歷官網623頁或壓測。

若選B，建議由FAQ內容維護者負責正式原始資料與異動通知，Repo維護者負責review後同步。每日或每週比對manifest／日期、重大法規或FAQ下架時即更新，可作討論起點；這是**建議頻率，非現有排程**。實際owner／時效須人工決定。本輪未建automation。

每批副本應附官方來源、擷取日期、row count、逐題URL、hash、修改／下架資訊及版本manifest；同步需核對新增／刪除／更正、重複題與完整答案差異。副本與CX canonical來源若不同步，同一題會出現兩種答案；應先決定是否限定同批623題，或承認官網更廣範圍。日期欄位不是內容未變的充分證據；不可只看全站footer。來源缺少逐題URL時不能用題名自行造連結。

## 7. Gate E：方案比較、成本與推薦順序

所有變更量均為相對估計，不是工期或已授權規格。

| 順序／方案 | 可行性證據 | 未來改動範圍／相對量 | 同步、性能與維護風險 | 費用 |
| --- | --- | --- | --- | --- |
| 1／C 官網跳轉 | 既有`officialFaqUrl`與正常返回連結已在頁面；索引有標題／內容搜尋。官網當日可用性受阻，預填query UNKNOWN | 維持現狀可0變更；若另設入口文案／預填則小量，但需授權與實證 | 不複製答案；由官網維護，增加一次跳頁。不能在同頁顯示完整答案 | 直接使用官網不增加CX查詢；若先AI後跳轉，第一筆CX仍付費 |
| 2／B 同源靜態FAQ | 標題／URL的623題比對與大小已實測；不依賴跨域CORS。完整答案未取得 | 靜態資料、lazy load／比對、結果來源／狀態、異步競態、測試與packager allowlist；中量 | 主要負擔是來源正確、版本、下架與同步。完整大小／手機效能待測；兩套語料可能漂移 | keyword本地比對無新增CX費；靜態流量／人工作業仍有成本；AI先查仍付第一次 |
| 3／A2 官方JSON/CSV即時讀取 | 只找到候選；欄位、URL、筆數、實體下載／CORS均未過 | fetch／parse／完整性／safe links／cache／查詢；中量 | 減少手動副本但依賴官方availability、rate limit、schema／分頁與更新。40.6KB候選不保證等於623題 | 官方索引稱免費；不是免費SLA。AI先查仍有第一次CX費 |
| 4／A1 官網即時搜尋 | method／request／browser CORS皆UNKNOWN / BLOCKED | 若JSON search API完整可能中量；若HTML scraping則較大 | DOM、JS、cookie/CSRF、分類／分頁或改版易失效；現在無穩定API證據 | 不能假設每次搜尋收費，也不能承諾無rate限制；AI先查仍付第一次 |
| 排除／D 新proxy／付費搜尋／調CX | 非必要，不解決本輪證據缺口 | 新基礎設施／權限／運維或backend改動，大量 | 違反不設後端／不改CX原則；第三方CORS proxy也不採用 | 增加服務／開發／運維成本 |

成本須分兩種觸發模式：

- **AI先查、真零結果再查keyword**：每題已送CX，總成本約為`N × 單次CX實際帳單成本 + 補查流量／維護`，不因後段免費而省掉前段。只改善可能的召回率；最壞延遲是AI時間再加補查時間。
- **人工選keyword或前端先判短詞**：若其中`K`題完全未送CX，理論CX次數變成`N-K`；能省多少取決於命中／再轉AI比例。短詞分類、UI、GA語義與獨立查詢契約都會改變，**僅列替代選項，沒有選定、設計或實作**。若每題都並行送CX，仍不省CX費。

未取得本project帳單／實際計價sku，沒有杜撰每次單價。官方資料「免費」不包含維護人力、靜態頻寬及可用性承諾。

## 8. 測試、改動範圍與交接

已執行：`npm test` **37 PASS（30+7）**；既有offline Chromium **30 grouped PASS**，page errors0、forwarded external requests0、Production requests0。另做7個一次性normalization觀察與6個標題查詢，結果見測試證據。沒有新增正式tests或修改任何既有fixture；離線mock／封存重播不證明live答案品質或官網整合。

提交範圍只包含：

```text
NEXT_TASK.md
docs/1999_KEYWORD_FALLBACK_FEASIBILITY_REPORT_2026-10-18.md
docs/1999_KEYWORD_FALLBACK_TEST_EVIDENCE_2026-10-18.md
```

以`git diff --name-only 5f180504c085754256842fa3a2214ab1f0e671bb`及protected-file byte comparison核對。**正式網頁、runtime、UI、CX、Data Store、GCP、官網、Pages部署、GA4寫入／設定、Production detectIntent次數全部0**。研究中只有公開HTTP讀取／OPTIONS與Git文件提交；沒有workflow dispatch、merge或deploy。`PROJECT_STATE.md`不變：本輪沒有新增持久產品決策或正式系統狀態。

後續待審閱的缺口：

1. 透過受支援環境設定取得官網`tpctax.gov.taipei`及已知資料平台`data.taipei`的讀取能力，並使瀏覽器信任既有受管CA；不是停用TLS。若匯出連結到其他host，先以真實href確認，不預先放寬萬用網域。
2. 取得當日表單method/action/field names，匿名小量完成信用卡／房屋稅標題與內文四組查詢，保留去token封包、結果筆數與原題／全文／URL；再測完整問句。若有CSRF僅記機制，不要求私人cookie。
3. 對**實際**JSON/CSV/search介面驗證匿名GET（必要才OPTIONS）、redirect、Content-Type、更新日、總筆數、URL完整性及從真實Pages origin的`credentials:omit` fetch；目前尚不能勾PASS。
4. 若選B，取得完整可重用的官方Q/A/URL批次、對齊範圍／hash、決定owner與同步時效。不能用目前title-only索引充當完整答案資料。
5. 人工決定C或B／A2後，才另開明確實作授權；本輪不自動續做、不merge研究分支。

**STOP：等待使用者與Web ChatGPT審閱。** 官網四組實測／資料CORS維持未完成；研究交付不等於整合可上線。
