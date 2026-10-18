# 1999 keyword fallback：唯讀測試證據（2026-10-18）

搭配[研究報告](1999_KEYWORD_FALLBACK_FEASIBILITY_REPORT_2026-10-18.md)閱讀。所有user-facing時間採Asia/Taipei；raw HTTP Date／ISO `+00:00`為來源原始UTC。Web基準`5f180504c085754256842fa3a2214ab1f0e671bb`；本輪無CX detectIntent、無部署、無程式碼／fixture變更。

## 1. 環境與來源識別

- `cloud_environment.environment_status`：`observations_current=true`、network policy `restricted/state=unknown`，secret0／outbound identity0。未將state unknown稱為enforced。
- executor policy v1：`vpn_configured=false`，TCP domains/IP ranges空；custom hosts只有`dialogflow.cloud.google.com`、`services.arpa.tpctax.dof.gov.taipei`、`taipei-tax-lab.github.io`、`www.gstatic.com`。官方主站與資料平台不在其中。
- 初次預設sandbox的git fetch無法連proxy；帶執行工具的network permission後，`git fetch origin`成功，同一proxy下的官方主站仍CONNECT403。local HTTP server／Chromium也需socket permission；不是origin授權或TLS bypass。
- 工具版本：Node v24.19.0、Python3.12.14、Chromium151.0.7922.173；Playwright Python可用。
- 後端main唯讀ref：`63fa97d61b426b09d16302f7ad8d522b9bebb25f`。GitHub `fetch_file`固定ref讀取architecture（blob `9a999ad4d5c719edd4d7cad00d8b22094fec42c4`）、baseline（blob `ccfc90643870119a28da48ed2bac7b1a3b3e395b`）與canonical index（blob `09f12896754135e4d9eb306b99f43be2c187410d`）。這是Git證據，不是fresh GCP readback。
- 一次性probe、下載索引、console輸出放`work/keyword-fallback/`；未提交、未打包。下列去敏摘要與重現程式保留在Git，無私人Cookie、Authorization或token值。

## 2. HTTP實測（H0–H4）

官網入口：

```text
https://tpctax.gov.taipei/News.aspx?n=BB8B93F0A49EAB80&sms=87415A8B9CE81B16
```

實際先執行一般GET（H0，約17:11），再用一次性Python wrapper逐一呼叫下列curl等價參數（H1–H4，約17:13）。wrapper使用`--write-out '%{json}'`記錄http code、CONNECT code與redirect count。沒有用`-k`／`--insecure`。

```bash
mkdir -p work/keyword-fallback
curl --silent --show-error --location --max-time 25 \
  --dump-header work/keyword-fallback/official-entry.headers \
  --output work/keyword-fallback/official-entry.body \
  'https://tpctax.gov.taipei/News.aspx?n=BB8B93F0A49EAB80&sms=87415A8B9CE81B16'

curl --silent --show-error --location --max-redirs 3 --max-time 20 \
  --request GET --header 'Origin: https://taipei-tax-lab.github.io' \
  --dump-header work/keyword-fallback/entry-origin-get.headers \
  --output work/keyword-fallback/entry-origin-get.body \
  --write-out '%{json}' \
  'https://tpctax.gov.taipei/News.aspx?n=BB8B93F0A49EAB80&sms=87415A8B9CE81B16'

curl --silent --show-error --location --max-redirs 3 --max-time 20 \
  --request OPTIONS --header 'Origin: https://taipei-tax-lab.github.io' \
  --header 'Access-Control-Request-Method: GET' \
  --dump-header work/keyword-fallback/entry-preflight.headers \
  --output work/keyword-fallback/entry-preflight.body \
  --write-out '%{json}' \
  'https://tpctax.gov.taipei/News.aspx?n=BB8B93F0A49EAB80&sms=87415A8B9CE81B16'

curl --silent --show-error --location --max-redirs 3 --max-time 20 \
  --request GET --dump-header work/keyword-fallback/pages-get.headers \
  --output work/keyword-fallback/pages-get.body --write-out '%{json}' \
  'https://taipei-tax-lab.github.io/tpctax-1999-ai-web/'

curl --silent --show-error --location --max-redirs 3 --max-time 20 \
  --request GET --dump-header work/keyword-fallback/dataset-metadata-get.headers \
  --output work/keyword-fallback/dataset-metadata-get.body --write-out '%{json}' \
  'https://data.taipei/dataset/detail?id=2ab479d3-a115-431f-92de-a1a5c5dea5a0'
```

H0/H1/H2/H4均為curl exit56：

```text
curl: (56) CONNECT tunnel failed, response 403
http_code=0  http_connect=403  num_redirects=0
origin_body_bytes=0 / body not received

HTTP/1.1 403 Forbidden
content-length: 16
content-type: text/plain
server: envoy
connection: close
```

H0 header原始Date `Sun, 18 Oct 2026 09:11:24 GMT`；H1/H2/H4 `Sun, 18 Oct 2026 09:13:13 GMT`。16 bytes是proxy錯誤回覆宣告，不是官網搜尋body。origin的ACAO／ACAM／ACAH／ACAC／Vary／Content-Type／Retry-After都**未取得**，不寫成「不存在」。H2只是入口OPTIONS探測，沒有已知search/export endpoint，因此API preflight尚未執行。

H3：

```text
curl_exit=0  http_code=200  http_connect=200  num_redirects=0
final_url=https://taipei-tax-lab.github.io/tpctax-1999-ai-web/
body_bytes=2908
body_sha256=f591b07942756d2ec3d4f77f4ad8a49a414409b1027687d516c19a741e937a13

HTTP/2 200
content-type: text/html; charset=utf-8
last-modified: Fri, 09 Oct 2026 03:24:33 GMT
access-control-allow-origin: *
strict-transport-security: max-age=31556952
cache-control: max-age=600
vary: Accept-Encoding
date: Sun, 18 Oct 2026 09:13:14 GMT
```

H3 document bytes也與Repo `index.html`一致（最終scope check核對）；沒有讀取或送出頁面表單。**Pages ACAO只屬Pages本身。**

## 3. 真實瀏覽器探測（B1/B2）

執行：`python3 work/keyword-fallback/network_probe.py --browser-only`，使用同一受管proxy、`ignore_https_errors=False`，未加憑證忽略旗標。只放行指定document／預定匿名fetch，其他subresource不執行，防止載入Messenger／GA。

成功寫下的結果採樣時間`2026-10-18T09:13:58.193640+00:00`，即17:13:58 Asia/Taipei：

```json
{
  "tls_verification": true,
  "cx_calls": 0,
  "browser": [
    {
      "id": "pages-document",
      "document_status": null,
      "error": "net::ERR_CERT_AUTHORITY_INVALID",
      "actual_origin": null,
      "page_url_after_failure": "about:blank",
      "fetch": "NOT_EXECUTED: origin document navigation failed"
    },
    {
      "id": "official-document",
      "document_status": null,
      "error": "net::ERR_TUNNEL_CONNECTION_FAILED",
      "actual_origin": null,
      "page_url_after_failure": "about:blank",
      "fetch": "NOT_EXECUTED: origin document navigation failed"
    }
  ]
}
```

原始browser-only JSON的`http:[]`表示該次沒有重跑HTTP組，不表示前述H0–H4未執行。首次instrumentation在導航失敗後evaluate origin遇execution context destroyed；修正catch僅記`page.url`與origin未知後重跑browser，沒有重送被拒的HTTP組。

最小可重現browser-only程式（研究用，非frontend功能）：

```python
import os
from playwright.sync_api import sync_playwright

pages = 'https://taipei-tax-lab.github.io/tpctax-1999-ai-web/'
entry = 'https://tpctax.gov.taipei/News.aspx?n=BB8B93F0A49EAB80&sms=87415A8B9CE81B16'
with sync_playwright() as p:
    proxy = os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy')
    options = dict(executable_path='/usr/bin/chromium', headless=True,
                   args=['--no-sandbox', '--disable-crash-reporter'])
    if proxy:
        options['proxy'] = {'server': proxy}
    browser = p.chromium.launch(**options)
    context = browser.new_context(ignore_https_errors=False, service_workers='block')
    for target in (pages, entry):
        page = context.new_page()
        def route(r):
            document = r.request.resource_type == 'document' and r.request.url == target
            fetch = r.request.resource_type == 'fetch' and r.request.url == entry
            r.continue_() if document or fetch else r.abort()
        page.route('**/*', route)
        try:
            response = page.goto(target, wait_until='domcontentloaded', timeout=20000)
            origin = page.evaluate('location.origin')
            print(target, response.status if response else None, origin)
            if target == pages and origin == 'https://taipei-tax-lab.github.io':
                print(page.evaluate('''async url => {
                    try {
                        const r = await fetch(url, {mode:'cors', credentials:'omit', redirect:'follow'});
                        const text = await r.text();
                        return {status:r.status, type:r.type, finalUrl:r.url, chars:text.length};
                    } catch(e) {return {error:e.name+': '+e.message};}
                }''', entry))
        except Exception as e:
            print(target, str(e).split('Call log:')[0], page.url, 'FETCH NOT EXECUTED')
        page.close()
    browser.close()
```

未建立真實Pages origin，因此**不存在一個可報PASS/FAIL的browser CORS fetch結果**。沒有把localhost/file/null origin、合成fulfill或`no-cors` opaque response當作替代證據。

## 4. 離線契約回歸

實際命令（Repo根目錄；server獨立session，測試完成後停止）：

```bash
npm test > work/keyword-fallback/node-tests.txt
python3 -m http.server 8765 --bind 127.0.0.1
python3 tests/phase7e3a_browser.py \
  --base-url http://127.0.0.1:8765/ \
  --output-dir work/keyword-fallback/offline-browser \
  > work/keyword-fallback/offline-browser.txt
```

Node兩批輸出：

```text
tests 30 / pass 30 / fail 0 / skipped 0
tests 7  / pass 7  / fail 0 / skipped 0
```

Browser JSON摘要：

```json
{
  "status": "PASS",
  "checks_count": 30,
  "external_requests": [],
  "page_errors": [],
  "production_requests": 0
}
```

兩個analytics loader URL被本機stub攔截回覆，沒有轉送GA；SDK測試使用本機合成SDK。包含：

- fixed-zero完整文字替換前次FAQ cards；empty／service error是不同state。
- 第一／二／三題request及SDK defaults都固定FAQ currentPage／Asia/Taipei、無currentPlaybook。
- timeout後locked直到settle，忽略晚到答案、不retry；expiry內部恢復、下一題成功。
- accepted-send清空、原query heading、新草稿保留，GA每accepted題一次且無business parameters。
- raw／parsed／card-only、完整多題／未知text fallback、安全URL與HTML inert、1280/390/320 layouts。
- 既有Production正向fixture的離線replay；不是新Production查詢。

### 4.1 一次性normalization觀察

直接import未修改的`normalizeResult`、`faqTextMessages`、`config`執行7個輸入。沒有新增或變更正式no-result判斷器。下表的`exact`僅表示是否與封存fixture完整文字相等，**不是已上線的辨識規則**。

| Case | hasAnswer | items | 依現行app條件的UI | exact |
| --- | --- | ---: | --- | --- |
| frozen-zero | true | 0 | result | true |
| positive-two | true | 2 | result | false |
| empty-response | false | 0 | empty | false |
| malformed-response（text不是array） | false | 0 | empty | false |
| ordinary-contains-找不到 | true | 0 | result | false |
| parsed-only-zero | true | 0 | result | true |
| changed-zero-wording | true | 0 | result | false |

後兩個zero文字case與empty case的`modelKeys`都只有`answer`，沒有`noResult`／`resultCount`。parsed-only-zero與raw frozen-zero normalize後相等，不能靠model知道原始訊息是否完整。timeout／service／expiry的差異由上面的既有transport測試與browser重播驗證。

重現核心（`node --input-type=module`）：

```javascript
import {normalizeResult} from './assets/result-model.js';
import {config} from './assets/config.js';
import {faqTextMessages} from './demo/mock-messenger.js';
const raw = responseMessages => ({raw:{queryResult:{responseMessages}}});
const frozen = normalizeResult(raw(faqTextMessages(0,config)),config.officialFaqOrigins).answer;
const cases = [
  ['frozen-zero',raw(faqTextMessages(0,config))],
  ['positive-two',raw(faqTextMessages(2,config))],
  ['empty-response',raw([])],
  ['malformed-response',raw([{text:{text:42}}])],
  ['ordinary-contains-找不到',raw([{text:{text:['找不到稅單時，請向稅捐機關申請補發。（合成測試）']}}])],
  ['parsed-only-zero',{data:{messages:[{type:'text',text:frozen}]}}],
  ['changed-zero-wording',raw([{text:{text:['本次沒有搜尋結果。（合成未知格式）']}}])]
];
for (const [id, input] of cases) {
  const m = normalizeResult(input,config.officialFaqOrigins);
  console.log(id,Object.keys(m),!!m.answer.trim(),m.items?.length||0,
    m.answer.trim()||m.items?.length?'result':'empty',m.answer===frozen);
}
```

## 5. 封存標題索引對照

來源：[pinned CSV](https://github.com/taipei-tax-lab/dialogflow-cx-qa-framework/blob/63fa97d61b426b09d16302f7ad8d522b9bebb25f/data/1999faq/canonical_recency_index.csv)。以GitHub `fetch_file`完整取回，暫存時核對到多出一個換行，移除工具寫檔增加的末尾換行後，與原有[來源manifest](https://github.com/taipei-tax-lab/dialogflow-cx-qa-framework/blob/63fa97d61b426b09d16302f7ad8d522b9bebb25f/reports/1999faq_1999only_canonical_source_2026-10-08.json)的recency hash完全一致。

```text
bytes=177656
sha256=bf24c3708ac02b05bdcbcf6947de55429e46b30873793c620fa1878ccf9522d5
rows=623 / unique canonical_key URLs=623
fields=canonical_key,canonical_question,source_row,added_date,published_date,
       modified_date,derived_recency_date,recency_basis,offline_date,eligible,competing_group_id
answer_field=false
```

實際字面標題掃描結果（沒有官網請求／CX請求）：

```text
信用卡                               8
房屋稅                              51
有那些地方稅可以用信用卡繳納？          1
房屋稅差別稅率2.0修法重點為何?         1
房屋稅的課稅範圍為何？                0
不存在關鍵詞_20261018                 0
```

研究時計算title/url compact JSON 125139 bytes、gzip26267 bytes。這不是完整答案資產，沒有寫入正式檔案。Python單次title scan約0.03–0.05ms，非跨裝置效能測試，不用來保證手機表現。

```python
import csv, gzip, hashlib, json
from pathlib import Path
source = Path('work/keyword-fallback/canonical_recency_index.csv').read_bytes()
assert hashlib.sha256(source).hexdigest() == 'bf24c3708ac02b05bdcbcf6947de55429e46b30873793c620fa1878ccf9522d5'
rows = list(csv.DictReader(source.decode().splitlines()))
for term in ['信用卡','房屋稅','有那些地方稅可以用信用卡繳納？',
             '房屋稅差別稅率2.0修法重點為何?','房屋稅的課稅範圍為何？','不存在關鍵詞_20261018']:
    print(term, sum(term in r['canonical_question'] for r in rows))
data = json.dumps([{'title':r['canonical_question'],'url':r['canonical_key']} for r in rows],
                  ensure_ascii=False,separators=(',',':')).encode()
print(len(data),len(gzip.compress(data,mtime=0)))
```

未執行：官網標題／內文四組submit、完整問句官網對照、CSV實體下載／解析、來源API GET／browser fetch、官網全文本地比對。故上列0是**封存標題scan的真零筆**，不能推為官網或CX零筆。

## 6. 公開索引證據的來源與限制

使用公開搜尋工具查詢，沒有透過替代proxy／IP／其他host抓取被封鎖來源。只把搜尋服務提供的官方頁索引摘要當作線索，沒有把它當作HTTP封包或CORS證據。實際查詢包含：

```text
site:tpctax.gov.taipei "1999" "信用卡"
臺北市稅捐稽徵處 1999 常見問答 開放資料 JSON CSV
"臺北市稅捐稽徵處常見問答集" "主要欄位"
"臺北市稅捐稽徵處常見問答集" "更新頻率"
"2ab479d3-a115-431f-92de-a1a5c5dea5a0"
site:tpctax.gov.taipei 政府網站資料開放宣告 著作權
```

只採用以下官方來源支撐研究：

- [官方FAQ分類頁](https://tpctax.gov.taipei/news.aspx?_CSN=0C40F138799A2FD6&n=BB8B93F0A49EAB80&sms=87415A8B9CE81B16)：標題／內容欄位標籤、JSON／CSV標籤；索引當時顯示約3個月前crawl，method／href未知。
- [官方資料平台metadata](https://data.taipei/dataset/detail?id=2ab479d3-a115-431f-92de-a1a5c5dea5a0)：40.6KB、CSV、五個主要欄位、檔案／metadata更新日、不定期免費；約5日前crawl。不是當日實體CSV驗證。
- [官方網站資料開放宣告](https://tpctax.gov.taipei/cp.aspx?n=0BE82485ABAC7EA8)：第1版授權、出處與例外；約2週前crawl。沒有由此推論API或流量政策。

## 7. Hashes、scope及交付檢查

原始暫存證據沒有上傳Drive，沒有提交二進位或整份FAQ corpus；摘要／重現方式如上。下列hash是本輪產物識別，不代表原始檔將永遠留存在Cloud：

| 暫存檔 | SHA-256 |
| --- | --- |
| node-tests.txt | `615e135cd13767d00ad7834f659ceb2d9bbc77853b292c706d55191ec3a529f1` |
| offline-browser/browser_validation.json | `e701ac68bf5573d3128459c1e0a1cc936b68e0dfe220f4cc24e40cbc5cb79f06` |
| network-results.json（成功記錄的browser-only組） | `8299287d6ff5d92321a073f8e6350e0f8c0813c3d99c747b384650c9479335f2` |
| no-result-replay.json | `5ef8d753a45ae4599a85433dd6f13b81cd35481ce69dfbb55de78a6e19ff2de5` |
| title-index-replay.json | `3e2c18adb54aadf13fc5b812e245a3a68abec7c6378f356602af81615f250681` |
| official-entry.headers（H0） | `1bb47c09ba019664ec6fc3ac51daab1e0e2644bd12878d780db6be8070fa8858` |
| entry-origin-get／entry-preflight／dataset-metadata-get.headers（H1/H2/H4各自相同） | `b74ddf77a7a858e4baa28429068985a63ebf9d4776c9b8e643c929b7cb4db982` |
| pages-get.headers（H3） | `94d4a261c70f8b328dfc16798c6d474b8d961dbad67bccd2f950ae990695d76b` |

受保護檔案基準hash：

| 檔案 | SHA-256 |
| --- | --- |
| assets/app.js | `0e6c7f382a3552399209f23ed13f55369161591afec423012fef3a6ef37413d6` |
| assets/result-model.js | `9674d0b761d861d06460b76167d3a041187615142550aef89c14b2042c36d49d` |
| assets/messenger-transport.js | `c8b91ac9f5f5e6f1657055538feba505cd2fc9e009ac5b3fae268216d4334461` |
| assets/config.js | `a8565b72d45200a030270f0295a12fe610cc607350d1fa72339d823391169992` |
| packages/hosting.zip | `8a2937cd4c43b2c8e99a17b0d13a381edec4cc467ca2976bc1a7b00da7baf1b4` |

最終檢查命令：

```bash
git diff --check
git diff --name-only 5f180504c085754256842fa3a2214ab1f0e671bb
git diff --exit-code 5f180504c085754256842fa3a2214ab1f0e671bb -- \
  AGENTS.md README.md PROJECT_STATE.md index.html demo.html assets demo tests tools packages .github
```

預期且提交前核對的完整changed-file清單只有：

```text
NEXT_TASK.md
docs/1999_KEYWORD_FALLBACK_FEASIBILITY_REPORT_2026-10-18.md
docs/1999_KEYWORD_FALLBACK_TEST_EVIDENCE_2026-10-18.md
```

`.github/workflows/pages.yml`僅main指定runtime/package paths的push或手動dispatch會部署；此次只push研究分支三份Markdown，不觸發既有Pages workflow。scope check亦逐一對照其餘全部tracked檔案。這是研究文件交付，沒有新deployment／實作／PR merge。

提交前實際核對：其餘**43個基準檔案byte-identical**；Pages下載document與原始`index.html` 2,908 bytes完全一致；三份Markdown的credential marker scan與local links PASS，`git diff --cached --check` PASS。測試用local server已停止，`work/`為未提交暫存。

研究內容commit `66e4861cf2ec85ad0ee066f5963a2ac4c1fd8f4c`已push；GitHub GET回讀研究branch ref等於該SHA，main仍為`5f180504c085754256842fa3a2214ab1f0e671bb`。GET `actions/runs?head_sha=66e4861cf2ec85ad0ee066f5963a2ac4c1fd8f4c&per_page=10`回`{"total_count":0,"workflow_runs":[]}`。本段及NEXT_TASK勾選是後續交付回讀文件更新，不變更研究／正式程式內容。

**STOP，待人工及Web ChatGPT審閱。**
