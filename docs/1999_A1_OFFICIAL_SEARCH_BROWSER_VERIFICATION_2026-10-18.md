# 1999 A1 官網即時搜尋／iframe 瀏覽器驗證（2026-10-18）

狀態：**ENVIRONMENT BLOCKED／原站能力UNKNOWN／人工補驗工具包已交付／STOP**。
依據：[本輪計畫](1999_A1_OFFICIAL_SEARCH_BROWSER_VERIFICATION_PLAN_2026-10-18.md)。

## 1. 結論

本輪取得的是**Codex Cloud目的地proxy拒絕及瀏覽器CA錯誤**。沒有取得官網origin response，沒有在真實Pages origin執行官網fetch或iframe navigation，**不能據此認定A1a被官網CORS禁止、A1b被官網XFO／CSP禁止，或官網不支援keyword帶入**。

目前**先不選A1a或A1b**。已交付可在一般Windows Chrome／Edge手動執行的[最小補驗程序及測試碼](1999_A1_WINDOWS_BROWSER_MANUAL_VERIFICATION_2026-10-18.md)，包含唯讀form metadata、固定首頁匿名GET、臨時iframe、去敏回填表。沒有真人人工結果，全部原站判定保持UNKNOWN。離線snippet檢查通過只證明測試碼行為，不證明官網能力。

本輪只研究零後端、零題庫同步的A1；不延伸前輪B靜態副本／A2 CSV或其他後端設計。前輪將A1列在較後順位是當時成本／證據比較，**不是A1技術不可能的證明**。

## 2. Gate 0：基準、前輪延續與保護範圍

| 項目 | 本輪核對 |
| --- | --- |
| 日期／時區 | 2026-10-18，Asia/Taipei；HTTP採樣約17:51:53、browser自17:52:13起 |
| 最新Web main | `ba649d13ff0723f9d3e606d4c44e374f7b211af1`；新增本輪A1計畫 |
| 前輪研究branch／SHA | `research/1999-keyword-fallback-2026-10-18`／`403863f9d529fe32f4bf6e17d99aa9c493368330`，已explicit fetch並閱讀 |
| 前輪出處 | [研究報告](https://github.com/taipei-tax-lab/tpctax-1999-ai-web/blob/403863f9d529fe32f4bf6e17d99aa9c493368330/docs/1999_KEYWORD_FALLBACK_FEASIBILITY_REPORT_2026-10-18.md)、[測試證據](https://github.com/taipei-tax-lab/tpctax-1999-ai-web/blob/403863f9d529fe32f4bf6e17d99aa9c493368330/docs/1999_KEYWORD_FALLBACK_TEST_EVIDENCE_2026-10-18.md)。未合併main，未刪除／覆寫前輪分支；本分支不複製其題庫或報告 |
| 本輪獨立branch | `research/1999-a1-browser-verification-2026-10-18`，從上述main建立；不是merge前輪研究 |
| 官網入口F | `https://tpctax.gov.taipei/News.aspx?n=BB8B93F0A49EAB80&sms=87415A8B9CE81B16`；最終官網URL未能直接驗證 |
| AI頁P／目標origin | `https://taipei-tax-lab.github.io/tpctax-1999-ai-web/`／`https://taipei-tax-lab.github.io` |
| 既有正式契約 | `liveEnabled=true`、每題FAQ START_PAGE currentPage、無currentPlaybook、accepted query GA4；LIVE / USABLE延續，沒有新驗收宣稱 |
| Runtime | Node24.19.0、Python3.12.14、Chromium151.0.7922.173、Playwright；Linux Cloud，不是Windows |
| 暫存 | `work/a1-browser-verification/`；未納入Git／production build，snippet放在研究Markdown供複製 |

已依`AGENTS.md`讀取README、PROJECT_STATE現行狀態、NEXT_TASK、PRODUCT_PLAN與RESULT_CONTRACT，再讀A1計畫及前輪完整報告／證據。定位現行app、transport／result契約、Pages workflow及static packager。本輪不重新操作CX或驗證Production detectIntent。

Cloud status本輪為`observations_current=true`、restricted policy **state=enforced**（前輪為unknown，不能照抄）。custom hosts仍只有`dialogflow.cloud.google.com`、`services.arpa.tpctax.dof.gov.taipei`、`taipei-tax-lab.github.io`、`www.gstatic.com`，未含`tpctax.gov.taipei`；executor policy v1也未包含官網主站，VPN false、TCP grants空。未改環境政策、憑證或proxy；未要求放寬網路。執行工具的network permission只用來連既有受管proxy及啟動本機browser，不授予新的目的地例外。

## 3. Gate 1–3：本輪真實HTTP／browser證據

### 3.1 每層結果

以匿名GET各取F、P一次；不跟redirect、不帶Cookie／Authorization、自訂Origin或其他headers。F遇CONNECT403後，停止F相關fetch／iframe／表單實測，沒有再用其他host、工具、proxy或IP抓取它。P的server-side GET成功後，另做一次嚴格TLS browser導航；遇CA錯誤後停止。

| ID／時間 | 實際方法與層級 | 結果 | 可下的結論 |
| --- | --- | --- | --- |
| H1／17:51:53 | GET F；proxy CONNECT | curl exit56、CONNECT403、origin HTTP000、無body | **ENVIRONMENT BLOCKED**。沒有官網TLS握手／origin headers／搜尋結果 |
| H2／17:51:53 | GET P；CONNECT→HTTPS document | curl exit0、CONNECT200、HTTP200、2,908 bytes、`text/html; charset=utf-8`；body與Repo index完全一致 | 只證curl可讀Pages document；不是browser CORS或iframe成功 |
| B1／自17:52:13 | 真實Chromium導航P | `net::ERR_CERT_AUTHORITY_INVALID`、document status null、actual origin null、停在about:blank | **ENVIRONMENT BLOCKED**；沒有建立目標Pages origin |
| B2／未執行 | Pages→官網CORS fetch | NOT EXECUTED：F已被拒、P browser未建立 | 官網CORS仍UNKNOWN；不發OPTIONS或用no-cors替代 |
| B3／未執行 | Pages→官網iframe navigation | NOT EXECUTED：同上 | iframe顯示／操作／keyword UNKNOWN；不是TECHNICALLY BLOCKED |

H1原始proxy header摘要（UTC Date保留原文）：

```text
HTTP/1.1 403 Forbidden
content-length: 16
content-type: text/plain
date: Sun, 18 Oct 2026 09:51:52 GMT
server: envoy
connection: close

curl: (56) CONNECT tunnel failed, response 403
http_connect=403 / http_code=000 / num_redirects=0
```

16是proxy錯誤回覆宣告的長度，未取得origin body。proxy的`text/plain`不是官網Content-Type，該403不是官網403。沒有來源各跳redirect資料；`num_redirects=0`只能描述本次未跟隨、且CONNECT即失敗，不能推論原站沒有redirect。

H2的真正Pages response：

```text
HTTP/2 200
content-type: text/html; charset=utf-8
access-control-allow-origin: *
vary: Accept-Encoding
date: Sun, 18 Oct 2026 09:51:53 GMT
body_bytes=2908
sha256=f591b07942756d2ec3d4f77f4ad8a49a414409b1027687d516c19a741e937a13
```

Pages當次HTTP headers未見CSP、CSP-Report-Only、XFO或COEP，下載的HTML未見CSP meta；這些只是**P當次curl樣本**。不能拿Pages的ACAO、XFO缺席等資訊代替F的headers，也不能因此宣稱iframe顯示成功。browser因CA未建立頁面，本輪沒有Pages runtime政策執行證據。

### 3.2 Origin headers／表單／搜尋狀態

| 待查項 | 官網證據 |
| --- | --- |
| origin HTTP status、Content-Type、redirect各跳 | UNKNOWN／未取得 |
| ACAO、ACAC、Vary、Expose-Headers | UNKNOWN／未取得，不是「未設定」 |
| X-Frame-Options、CSP frame-ancestors／Report-Only | UNKNOWN／未取得，不是「允許嵌入」 |
| form action／method／input names／submit JS／分頁 | UNKNOWN；前輪只有索引的標題／內容欄位標籤，沒有可重播request |
| 信用卡、房屋稅：標題／內容四組查詢 | NOT EXECUTED／ENVIRONMENT BLOCKED；沒有真實筆數／完整答案，未拿前輪標題索引8／51筆冒充 |
| keyword deep link／postMessage | UNKNOWN；沒有已證實搜尋URL或官方協定，不猜參數、不傳message |
| 匿名／Cookie／CSRF／登入／限流 | UNKNOWN；沒有要求登入或提供私人Cookie／Token，沒有改第三方Cookie設定 |

本輪沒有POST、OPTIONS、CX detectIntent或高頻爬取。GET沒有自訂非safelisted headers，不為「測CORS」盲加preflight。也沒有`no-cors`、停用TLS、忽略browser憑證、第三方CORS proxy或其他安全bypass。

### 3.3 重現命令及browser條件

Repo根目錄的實際HTTP探測由Python `subprocess.run`逐一呼叫以下等價curl，並用`%{json}`保存exit／CONNECT／HTTP metadata：

```bash
mkdir -p work/a1-browser-verification
curl --silent --show-error --request GET --max-time 20 --max-redirs 0 \
  --dump-header work/a1-browser-verification/official-entry.headers \
  --output work/a1-browser-verification/official-entry.body --write-out '%{json}' \
  'https://tpctax.gov.taipei/News.aspx?n=BB8B93F0A49EAB80&sms=87415A8B9CE81B16'

curl --silent --show-error --request GET --max-time 20 --max-redirs 0 \
  --dump-header work/a1-browser-verification/pages-document.headers \
  --output work/a1-browser-verification/pages-document.body --write-out '%{json}' \
  'https://taipei-tax-lab.github.io/tpctax-1999-ai-web/'
```

沒有`--location`；若有真正3xx，只記Location而不自動探測下一跳。本輪F未到origin、P為200，無來源3xx可記錄。

Browser使用`p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox','--disable-crash-reporter'], proxy=既有HTTPS_PROXY)`、`new_context(ignore_https_errors=False, service_workers='block')`。`--no-sandbox`是該容器Chromium啟動選項，沒有關閉TLS／CORS；未加ignore-certificate類旗標。只放行P本身document，其餘subresources abort，避免載入SDK／GA；沒有對F重試。

```json
{
  "started_at_utc": "2026-10-18T09:52:13.486230+00:00",
  "ignore_https_errors": false,
  "document_status": null,
  "actual_origin": null,
  "page_url_after_navigation": "about:blank",
  "error": "net::ERR_CERT_AUTHORITY_INVALID",
  "official_fetch": "NOT_EXECUTED: official GET already CONNECT403; no retry",
  "iframe_navigation": "NOT_EXECUTED: official GET already CONNECT403; no retry",
  "external_subrequests_forwarded": 0
}
```

## 4. A1a／A1b判定矩陣

`ENVIRONMENT BLOCKED`描述本輪工具無法完成測試；`UNKNOWN`描述原站能力未證實，兩者並不矛盾。`TECHNICALLY BLOCKED`需來源或瀏覽器政策證據，且只限制於已測origin／URL／方法，不等於永久禁止。

| 用法 | Cloud執行狀態 | 一般Windows Chrome／Edge的原站結論 | 尚缺證據 |
| --- | --- | --- | --- |
| 官網原生匿名標題／內文搜尋 | ENVIRONMENT BLOCKED | **UNKNOWN** | 真實UI request、四組結果、完整Q/A/URL／分頁 |
| A1a：Pages JS讀官網首頁 | ENVIRONMENT BLOCKED | **UNKNOWN** | 真實Pages-origin匿名GET、可讀body與Network政策；首頁通過仍不證搜尋 |
| A1a：Pages JS讀帶keyword的搜尋結果 | ENVIRONMENT BLOCKED | **UNKNOWN** | 已證實無token GET URL、CORS可讀且可解析完整官方資料、合法使用條件 |
| A1b：Pages iframe顯示官網 | ENVIRONMENT BLOCKED（未導航F） | **UNKNOWN** | 實際可見及各origin的XFO／frame-ancestors／父頁frame-src政策 |
| A1b：frame內匿名手動搜尋／看全文 | ENVIRONMENT BLOCKED（未執行） | **UNKNOWN** | 真實操作、分頁／答案、top導頁、第三方Cookie與mobile觀察 |
| A1b：自動帶入keyword | UNKNOWN（未發現request） | **UNKNOWN** | 真實無session依賴deep link或官方支援協定，再做frame驗證 |
| 父頁JS任意讀寫跨origin frame DOM | 本輪沒測真實frame | **不作官網站能力PASS／FAIL判定**；一般same-origin policy限制此用法 | 不能把可見frame當可讀／可自動填框；不依此設計繞過方式 |

沒有任何原站A1用法在本輪被判`SUPPORTED/PASS`或`TECHNICALLY BLOCKED`。一般CORS／SOP標準只能解釋觀察，不可替代實際官網headers與browser evidence。

## 5. Gate 4：人工補驗交付與測試碼核對

[Windows補驗文件](1999_A1_WINDOWS_BROWSER_MANUAL_VERIFICATION_2026-10-18.md)按最少操作分三段：

1. 官網原生搜尋：F12 Network Preserve log，先確認GET form／submit行為，記信用卡／房屋稅標題與內文、來源Q/A/URL；只分享去敏摘要，不要HAR／Cookie／Token。
2. 真正Pages top Console：固定目的地匿名首頁GET，`credentials:'omit'`、無自訂headers、`redirect:'error'`、15秒上限、不retry、不印body；未有實證搜尋URL就止於首頁，不能聲稱A1a成功。
3. 同一Pages top Console：可移除的固定首頁iframe，分別記可見／手動查詢／mobile／政策與keyword；另提供單檔local HTML初篩，但file/null origin不能代替Pages證據。

必要判讀規則：

- fetch失敗的`TypeError`不一定是CORS，也可能是TLS、redirect、網路、父頁CSP connect-src；看Network／Console對應診斷。JavaScript拿不到status不等於origin沒回覆。
- JS `headers.get('Access-Control-Allow-Origin')`等可能因未Expose而是null，須到Network核對，不能寫成原站沒header。
- iframe的load事件可能在載入失敗時出現。沒XFO／CSP也不等於可見；可見也不等於可操作、可讀DOM或可帶keyword。
- 父頁`frame-src`（及child-src/default-src fallback）與子頁`frame-ancestors`／XFO要分開；Report-Only與enforced要分開。公開來源若拒絕特定用法，記精確限制，不改安全headers。
- Cookie現行設定／browser模式須記錄且不放寬。另一個普通tab共享session，不能用來證明deep link獨立；需無既有session的Guest視窗作對照，仍不得登入或注入Cookie。

官方技術依據（是標準／文件，**不是官網實測**）：[MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)、[Expose-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Access-Control-Expose-Headers)、[iframe及load／SOP](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe)、[same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy)、[W3C CSP3](https://www.w3.org/TR/CSP/)。

### 離線核對（已執行）

從Markdown抽出三個javascript code blocks到`work/a1-browser-verification/`，各執行`node --check`：**3/3 PASS**。再用`python3 work/a1-browser-verification/snippet_smoke.py`於Chromium中以全攔截、合成的Pages／官網文件做**9組PASS**：

| 組 | 檢查 |
| --- | --- |
| 1 | 首頁碼僅一次固定匿名GET，沒有OPTIONS／Cookie／Authorization |
| 2 | 只輸出body長度；合成response即使有ACAO，未Expose時JS讀到null，原文不外洩 |
| 3 | redirect目標不被請求，沒有假PASS |
| 4 | fetch失敗不retry、不自動判CORS原因 |
| 5 | iframe固定首頁、一次導航；重複執行停止；load只記事件 |
| 6 | 移除按鈕清除臨時DOM |
| 7 | 在官網context執行Pages碼會停止，不送請求 |
| 8 | form metadata只記名稱／method，不取hidden或query值，不submit／fetch |
| 9 | form碼拒絕Pages context |

初次離線harness以Console handle收集時未取得輸出，修正為合成頁內擷取console後重跑通過；未改探針碼或重試官網。合成測試只用route.fulfill／abort，**forwarded network requests0／Production CX calls0**。沒有將合成Pages origin或合成iframe當真實網站證據；Windows Chrome／Edge人工實測 **NOT EXECUTED**。

既有前端測試／fixtures／程式未改；本輪沒有重跑前輪的37 Node／30 browser回歸，也不把前輪成績報成本輪live驗證。新測試專注人工測試碼的安全性與可執行性。

## 6. 待補證據後的最小變動評估（不是實作授權）

目前沒有已證可行方案，因此不估承諾工期或選定功能；只列通過條件後的相對變動，維持零後端／零題庫同步／不改CX。

| 條件式方案 | 若獲證可行，最小前端變動 | 隔離與風險／仍需審閱 |
| --- | --- | --- |
| A1a匿名GET＋完整可解析結果 | 在真正CX成功零結果分支補一次bounded fetch與保守解析，沿用safe text／官方URL呈現；改動量中等 | 無結構化zero flag的限制沿用前輪契約研究；不得由timeout／service error／空parsed結果觸發。需query generation／取消與舊結果排除，補查失敗保留原fallback，GA不重計。HTML schema／分頁與全文請求量須有真證據；不能把任意remote HTML插入DOM |
| A1b可見、可操作且有deep link | 零結果時載入來源明確的iframe及獨立loading／失敗出口；量小至中等 | 公開frame仍受XFO/CSP／第三方Cookie／手機布局／top導頁影響。父頁不能依賴讀DOM判結果或成功；deep link不得含session/token。需要時保留既有官網正常連結作手動出口，不能因想嵌入而放寬來源安全政策 |
| A1b只可手動輸入 | 臨時功能若日後獲准，仍需嵌入區／狀態與可及性；量小至中等 | 不能滿足自動帶keyword；重複輸入、兩層scroll、手機版可能比直接官網分頁更差。先以真人操作比較，不預選iframe |
| A1a/A1b有精確技術拒絕 | 記錄當前URL／origin／方式不受支援，不實作該路徑 | 不加proxy、CSV或靜態副本繞過本輪範圍；回到審閱決策 |

AI已先查才補查仍支付第一次CX費用；本輪沒有規劃前端短詞分類、免費優先或變更accepted-query GA4定義。

## 7. 證據保存、diff與交接

只提交：

```text
NEXT_TASK.md
docs/1999_A1_OFFICIAL_SEARCH_BROWSER_VERIFICATION_2026-10-18.md
docs/1999_A1_WINDOWS_BROWSER_MANUAL_VERIFICATION_2026-10-18.md
```

本輪`production frontend／UI／CX／Data Store／GCP／官網／Pages deployment／GA4 mutation = 0`，`detectIntent = 0`。沒有擴充套件、遠端桌面、身份資料或環境政策更動。`PROJECT_STATE.md`保留，沒有新的正式產品決策。前輪branch與其內容保留原樣。

檢查命令：

```bash
git diff --check
git diff --name-only ba649d13ff0723f9d3e606d4c44e374f7b211af1
git diff --exit-code ba649d13ff0723f9d3e606d4c44e374f7b211af1 -- \
  AGENTS.md README.md PROJECT_STATE.md index.html demo.html assets demo tests tools packages .github
```

另逐一比對其餘所有baseline tracked files，並確認研究Markdown不在static packager allowlist、研究branch不符合Pages workflow的main push條件；不建包、不dispatch、不merge。

暫存證據hash（原檔未提交／未上傳，摘要與工具碼已入研究文件）：

| 檔案 | SHA-256 |
| --- | --- |
| http-results.json | `3e669a08732df30860b4d1608ca0619d1a5d105bd60f6e5bd8c4cd4e66373da2` |
| browser-results.json | `70d113f8ede20982ad38e87128794181c11944d66ebde90587e9f2641fcc9fff` |
| snippet-smoke-results.json（合成驗證） | `38b29689ec062f253315c87912d71e5bfbf0bbdc15a4a2e0b60582feedb29e5e` |
| official-entry.headers | `d94be72a97cad1164160a81ddd1aecf54ae394913bb5da3faae74f81cd9f7420` |
| pages-document.headers | `38d25503c39b9c1bb5180240c8545cc82d19e1d8da271ba2775793e5ecc589e2` |
| hosting.zip（基準，未更動） | `8a2937cd4c43b2c8e99a17b0d13a381edec4cc467ca2976bc1a7b00da7baf1b4` |

研究commit SHA及remote回讀記在本輪`NEXT_TASK.md`交付小節。`work/`未提交，不宣稱整個工作目錄無暫存；正式tracked內容只有上述文件變更。

下一個決策輸入是人工補驗M0–M9。最少先有真實官網request及Pages fetch／iframe的Network／Console去敏摘要，才能區分來源限制與使用者端環境；若只測首頁仍不能選A1a搜尋，若iframe只顯示仍不能宣稱keyword帶入。**目前不要求放寬Cloud政策，也不自行取得其他執行環境。**

**STOP：等待使用者與Web ChatGPT審閱及人工補驗，未自行實作、部署或合併。**
