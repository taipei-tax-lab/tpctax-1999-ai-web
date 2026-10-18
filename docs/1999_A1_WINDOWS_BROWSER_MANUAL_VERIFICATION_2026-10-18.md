# 1999 A1：Windows Chrome／Edge 最小人工補驗（2026-10-18）

狀態：**程序與測試碼已備妥／尚無真人原站回填／不代表PASS**。
配合[本輪報告](1999_A1_OFFICIAL_SEARCH_BROWSER_VERIFICATION_2026-10-18.md)及[A1計畫](1999_A1_OFFICIAL_SEARCH_BROWSER_VERIFICATION_PLAN_2026-10-18.md)。不需遠端桌面、登入、安裝套件或擴充功能。以下操作不更改Repo／正式伺服器；DevTools新增的DOM重新整理即消失。

只用固定公開測試詞「信用卡」「房屋稅」，不輸入民眾問題或個資。不在AI表單送出任何問題。不要複製Cookie、Token、Authorization、完整HAR或「Copy as fetch/cURL」；不關閉瀏覽器安全／TLS／第三方Cookie限制，不安裝CORS擴充。若遇憑證警告、登入或身份資料要求，停止並記錄，勿略過。

## 1. 先取得官網搜尋的真實方法（約3分鐘）

1. 在Windows Chrome或Edge正常HTTPS分頁打開[官網1999 FAQ](https://tpctax.gov.taipei/News.aspx?n=BB8B93F0A49EAB80&sms=87415A8B9CE81B16)。記下瀏覽器版本、日期／時區、一般／Guest／InPrivate模式及目前第三方Cookie設定，不改設定。不要登入官網。
2. 按F12，Network勾選 **Preserve log**；只手動查看，不匯出HAR。記下document redirect各跳的status與`Location`，以及最終URL。先確認是真的官網FAQ，不是網路錯誤頁。
3. 在Elements查看單元查詢的form、input、submit；或選擇執行下面的唯讀metadata片段。它不發請求、不取hidden field的值。**DOM的method/action只是線索；JS可能攔截submit，實際以Network為準。**
4. 確認為匿名GET搜尋後，標題填「信用卡」、內容留空，點官網原生查詢鈕一次。Network找本次document／fetch／XHR，記method、URL路徑、欄位名稱及公開測試詞、status、Content-Type、redirect。再做內容「信用卡」、標題留空；必要時重複「房屋稅」兩種欄位，共最多四組，不遍歷所有頁。
5. 若預檢發現POST、需動態hidden token、登入或不明自動提交，先記錄method／欄位名稱並停止該子項；不盲送／重播POST、不索取token。本輪碼只支援GET。若原生UI意外產生POST，記其方法即可，不複製body或重送。
6. 記下顯示的總筆數（沒有總數就寫未提供）、分頁、1個實際官方原題與對應URL，核對答案是否完整。若列表只有題目，要另開該題官方頁看全文；這不表示列表response已包含答案。

**FORM_METADATA snippet**：在官網top分頁Console（不是Pages／其他frame）選擇執行。

```javascript
(() => {
  if (location.origin !== 'https://tpctax.gov.taipei' || window.top !== window.self) {
    console.error('STOP: 請在官網top分頁執行。'); return;
  }
  const describeUrl = value => {
    try {
      const u = new URL(value, location.href);
      return {origin: u.origin, path: u.pathname, queryKeys: [...u.searchParams.keys()]};
    } catch { return {invalid: true}; }
  };
  console.log({type: 'FORM_METADATA_ONLY', forms: [...document.forms].map(form => ({
    method: form.method, action: describeUrl(form.action), target: form.target,
    fields: [...form.elements].map(el => ({name: el.name || '', type: el.type || el.tagName})),
    submitOverrides: [...form.querySelectorAll('button,input')]
      .filter(el => el.type === 'submit' || el.type === 'image')
      .map(el => ({name: el.name || '',
        method: el.getAttribute('formmethod'),
        action: el.hasAttribute('formaction') ? describeUrl(el.formAction) : null}))
  }))});
})();
```

分享URL時只保留官網公開的單元識別與測試詞；動態token／session值遮罩。若無法判斷欄位是否敏感，只回傳origin、path與query key名稱，勿貼原值。`__VIEWSTATE`、`__EVENTVALIDATION`等值不用提供。不要把RSS／CSV／JSON開放資料結果當作本輪官網搜尋結果。

## 2. A1a：從真正Pages origin做一次匿名GET（約2分鐘）

1. 開啟[1999 AI Pages](https://taipei-tax-lab.github.io/tpctax-1999-ai-web/)，不送出AI查詢。F12 Console的執行context選 **top**；`location.origin`應是`https://taipei-tax-lab.github.io`。不要在官網自己的Console、localhost或file頁測跨域。
2. Network維持Preserve log。先閱讀下碼；選擇執行只會做**一次固定官網首頁GET**，無credentials、無自訂headers、無POST／OPTIONS、無自動retry，不印出body。瀏覽器自行處理Origin，勿嘗試偽造Origin。
3. 記Console結果與該請求的Network資訊。此碼使用`redirect:'error'`防止自動跟到其他目的地；若遇redirect，記為尚未完成，依步驟1的原生document鏈辨識，**不可把redirect拒絕誤判為CORS**。

**HOME_FETCH snippet**（固定目的地、首頁可讀性，不是搜尋API）：

```javascript
(async () => {
  if (location.origin !== 'https://taipei-tax-lab.github.io' || window.top !== window.self) {
    console.error('STOP: 請在1999 AI Pages的top context執行。'); return;
  }
  const target = 'https://tpctax.gov.taipei/News.aspx?n=BB8B93F0A49EAB80&sms=87415A8B9CE81B16';
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(target, {
      method: 'GET', mode: 'cors', credentials: 'omit', redirect: 'error',
      signal: controller.signal
    });
    const text = await response.text();
    console.log({type: 'FIXED_HOME_GET_ONLY', status: response.status,
      ok: response.ok, responseType: response.type, redirected: response.redirected,
      contentType: response.headers.get('Content-Type'), bodyChars: text.length,
      exposedACAO: response.headers.get('Access-Control-Allow-Origin'),
      exposedACAC: response.headers.get('Access-Control-Allow-Credentials'),
      exposedVary: response.headers.get('Vary'),
      note: '非搜尋結果；null可能是未暴露header，請對照Network。'});
  } catch (error) {
    console.log({type: 'FETCH_NOT_READABLE', errorName: error.name,
      note: '請對照Network/Console區分CORS、CSP connect-src、TLS、網路、redirect與timeout。'});
  } finally { clearTimeout(timer); }
})();
```

`Access-Control-Allow-Origin`／`Allow-Credentials`／`Vary`通常不是JS可直接讀的safelisted response headers；Console欄位`null`不能證明來源沒設定。必須在Network看**真正官網回應**的ACAO、ACAC、Vary、Content-Type與可能的`Access-Control-Expose-Headers`。fetch失敗時JavaScript通常拿不到status／headers，Network仍可能看得到HTTP200與CORS診斷。

這是simple GET，沒有故意加會觸發preflight的headers；若Network出現OPTIONS，就據實記錄，不額外手動發OPTIONS。不要改成`no-cors`；opaque body不可解析，不算PASS。

**尚未知道搜尋URL時到此為止。** 即使首頁200／body可讀，也不能說A1a搜尋可用。請先回填步驟1的真實GET搜尋request；經審閱後才能把固定URL換成該已驗證、無token、同一官網的完整搜尋URL做一次對照。此工具包不捏造參數、不提供任意URL輸入器、不自動重播搜尋。

若未來已有實證URL，也必須確認它回傳本次測試詞的真實題目／完整答案／URL，而非登入頁、錯誤頁或整站首頁；若答案需要逐題GET，另記所需請求量及每條跨域可讀性，不以一個HTML200代替完整檢索PASS。

## 3. A1b：暫時iframe，分開驗證顯示／操作／預填（約3分鐘）

主要證據要來自Pages origin。在同一Pages top Console，閱讀後選擇執行下碼；只新增一個指向固定FAQ首頁的臨時iframe，沒有keyword、sandbox例外、父頁讀取frame DOM、postMessage或自動送表單。一次只建立一個，點「移除」或重新整理可清除。這不是產品功能安裝。

**TEMP_IFRAME snippet**：

```javascript
(() => {
  if (location.origin !== 'https://taipei-tax-lab.github.io' || window.top !== window.self) {
    console.error('STOP: 請在1999 AI Pages的top context執行。'); return;
  }
  if (document.getElementById('a1-manual-frame-probe')) {
    console.error('STOP: 探針已存在，不重複導航。'); return;
  }
  const panel = document.createElement('section'); panel.id = 'a1-manual-frame-probe';
  const label = document.createElement('p');
  label.textContent = '臨時研究iframe：需人工確認可見／可操作；load事件不代表成功。';
  const remove = document.createElement('button'); remove.type = 'button';
  remove.textContent = '移除臨時研究iframe'; remove.addEventListener('click', () => panel.remove());
  const frame = document.createElement('iframe'); frame.title = '官網FAQ人工嵌入驗證';
  frame.style.width = '100%'; frame.style.height = '640px';
  frame.addEventListener('load', () => console.log({type: 'IFRAME_LOAD_EVENT_ONLY',
    note: '不得由此判PASS；請看畫面、Network與瀏覽器政策診斷。'}));
  frame.src = 'https://tpctax.gov.taipei/News.aspx?n=BB8B93F0A49EAB80&sms=87415A8B9CE81B16';
  panel.append(label, remove, frame); document.body.append(panel);
})();
```

依序記錄：

1. **顯示**：iframe中是否真有官網內容，或顯示拒絕／空白／錯誤；`load`即使失敗也可能發生，不以事件判PASS。
2. **政策**：Network找iframe document的redirect每跳／最終response，記真正origin的X-Frame-Options、CSP `frame-ancestors`。同時記Pages父頁的CSP `frame-src`及其fallback（`child-src`／`default-src`），以及Console明確政策錯誤。Report-Only告警與實際enforced拒絕分開。
3. **操作**：若可見且步驟1已確認匿名GET，在frame內手動輸入「信用卡」查詢一次，觀察結果、分頁、開題／完整答案是否可操作，是否將top頁導離Pages。不要再由父頁JS嘗試填框或讀frame內容。
4. **Cookie／手機**：保留現行第三方Cookie設定，記Issues／Network是否有blocked-cookie資訊（不記值），是否須登入。iframe navigation不是fetch的`credentials:'omit'`測試；可能使用瀏覽器管理的公開session cookies。不得複製或注入Cookie，也不放寬設定。用DevTools裝置工具列390px、320px各看一次表單／結果可否操作；這是桌面模擬，不冒充真手機驗收。
5. **預填**：本碼只開首頁，預填狀態必須是「未測」。只有在真實UI證實存在無token的GET搜尋URL後，才於新的Guest視窗（沒有既有官網session；一般新tab仍共用Cookie）手動開該**原封不動的URL**，核對測試詞／結果是否保留。通過後仍需在frame環境驗證相同URL。只在原tab有效可能是session狀態，不能當deep link。沒有GET URL就填UNKNOWN，不猜`q`等參數；未發現官方postMessage協定也不自行傳message。

跨origin iframe即使可見，父頁仍通常受same-origin policy限制；父頁不能取內容或預填，與「iframe被禁止顯示」是兩件事。沒有XFO／frame-ancestors也不能取代實際可見、可查詢的證據。CORS失敗也不能直接推導iframe失敗。

若Pages本身無法開啟，可把下列單獨檔存為`a1-frame-check.html`後雙擊；只作視覺初篩，**file/null origin不等於Pages，結果不得填Pages PASS**。不要架伺服器或上傳到正式hosting來繞過此差異。

```html
<!doctype html>
<html lang="zh-Hant">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>A1 iframe人工視覺初篩（file origin，非Pages證據）</title>
<p>本機初篩，不能證明Pages origin可嵌入。不要送出AI問題。</p>
<iframe title="官網FAQ視覺初篩" style="width:100%;height:640px"
  src="https://tpctax.gov.taipei/News.aspx?n=BB8B93F0A49EAB80&amp;sms=87415A8B9CE81B16"></iframe>
</html>
```

## 4. 最小回填表（沒有實測就保留空白／UNKNOWN）

不需整份HAR；分享以下去敏文字即可。截圖如有需遮罩個資、帳號與token。不必提供瀏覽器profile、遠端桌面或憑證資料。

| ID | 請回填 | 目前狀態 |
| --- | --- | --- |
| M0 | Windows／browser版本、Asia/Taipei時間、一般/Guest/InPrivate、第三方Cookie現行設定、top origin | **未執行** |
| M1 | 官網最終origin/path、document redirects/status；是否為真正FAQ頁 | **UNKNOWN** |
| M2 | 標題／內容form method/action、欄位名稱；實際GET request與公開測試詞（動態值遮罩） | **UNKNOWN** |
| M3 | 信用卡／房屋稅各標題／內容：total或未提供、分頁、1個原題/URL、列表是否含完整答案 | **UNKNOWN** |
| M4 | HOME_FETCH Console摘要、Network status/Origin/redirect、ACAO/ACAC/Vary/Content-Type、CORS或connect-src原文診斷 | **未執行**；即使通過僅證首頁 |
| M5 | 真實GET搜尋是否已取得／是否另驗JS讀取與完整Q/A/URL | **UNKNOWN**；本工具包未自動發搜尋 |
| M6 | Pages-origin iframe實際可見、內部手動GET搜尋、top導頁／mobile390/320；load事件不算成功 | **未執行** |
| M7 | iframe各response的XFO/frame-ancestors；父頁frame-src/child-src/default-src；enforced或Report-Only錯誤 | **UNKNOWN** |
| M8 | frame匿名可否用、blocked-cookie提示／須登入（不提供值、不改設定） | **UNKNOWN** |
| M9 | 真實URL是否在無既有session分頁與frame都保留詞／結果；官方postMessage文件若有提供來源 | **UNKNOWN** |

最少先回M0–M4與M6–M7，可區分環境、來源CORS和frame政策；要選A1a還缺M5完整搜尋資料，要宣稱自動keyword還缺M9。收到前不選A1a/A1b、不改正式網頁。

## 5. 如何判讀

- HTTP200且DevTools看得到body，但Pages JS被明確CORS政策拒絕：該匿名讀取用法可判`TECHNICALLY BLOCKED`；限制在當時URL／origin／方式，不能推整站永久不行。
- proxy CONNECT403／CA／DNS／本機timeout：`ENVIRONMENT BLOCKED`或不足判定；不是原站CORS結論。只有`TypeError`而無Network診斷也不足以判CORS。
- iframe真實可見且匿名GET查詢可操作：只對已測使用方式判`SUPPORTED/PASS`，預填另判；XFO/CSP實際拒絕需保存來源與browser診斷。只有header缺席或load事件：`UNKNOWN`。
- 首頁fetch可讀、local file iframe可見、同origin官網Console可讀、DevTools手動切進frame可以操作：都不能替代Pages父頁跨域讀取或自動填框的證據。

**這是待人工執行的補驗程序。沒有真人測試結果，任何項目都不能由此回填PASS。**
