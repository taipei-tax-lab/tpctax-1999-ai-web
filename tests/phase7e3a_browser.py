"""Offline Chromium checks against a local static server; external requests blocked."""
import json
import argparse
from pathlib import Path
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--output-dir', type=Path, default=Path('/workspace/work/phase7e3a'))
parser.add_argument('--base-url', default='http://127.0.0.1:8765/')
args = parser.parse_args()
OUT = args.output_dir
OUT.mkdir(parents=True, exist_ok=True)
BASE = args.base_url
checks = []
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True,
                               args=['--no-sandbox', '--disable-crash-reporter'])
    context = browser.new_context(viewport={'width': 1440, 'height': 1100}, reduced_motion='reduce')
    external = []
    def route(request):
        if request.request.url.startswith(BASE): request.continue_()
        else: external.append(request.request.url); request.abort()
    context.route('**/*', route)
    # Offline only: inspect the real analytics queue without sending GA4 hits.
    analytics_requests = []
    def analytics_stub(r):
        analytics_requests.append(r.request.url)
        r.fulfill(status=200,content_type='text/javascript',body='/* offline gtag loader fixture */')
    context.route('https://www.googletagmanager.com/gtag/js?*', analytics_stub)
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    # Retain disabled-mode coverage even when the release candidate is live.
    config_source = Path(__file__).resolve().parents[1].joinpath('assets/config.js').read_text()
    def disabled_config(r):
        r.fulfill(status=200, content_type='text/javascript',
                  body=config_source.replace('liveEnabled: true', 'liveEnabled: false'))
    context.route('**/assets/config.js', disabled_config)
    page.goto(BASE + 'index.html')
    page.get_by_role('heading', name='服務準備中').wait_for()
    assert page.locator('#submit').is_disabled()
    assert page.locator('#status').is_visible()
    assert page.locator('#reset').is_hidden()
    assert page.locator('df-messenger').count() == 0
    assert not external
    checks.append('isolated disabled-config fixture; no SDK or external traffic')
    context.unroute('**/assets/config.js', disabled_config)
    page.goto(BASE + 'demo.html')
    page.locator('#submit:not([disabled])').wait_for()
    assert page.locator('#status').is_hidden()
    assert page.locator('#reset').is_hidden()
    assert page.locator('.brand').get_attribute('href') == 'https://tpctax.gov.taipei/'
    assert page.locator('.brand').get_attribute('target') is None
    assert page.locator('.brand img').get_attribute('src') == './assets/trs-header.png'
    assert page.locator('.brand .agency-name').inner_text() == '臺北市稅捐稽徵處'
    assert page.evaluate('typeof window.dataLayer === "undefined"')
    assert page.locator('.intro').count() == 0
    assert page.locator('.session-bar p').count() == 0
    assert page.locator('#query').get_attribute('placeholder') == '例如：房屋稅自住住家用稅率如何申請？'
    assert page.locator('.suggestions > span').inner_text() == '您可詢問'
    def assert_example_order():
        label, textarea, examples, submit = [page.locator(s).bounding_box() for s in ['label[for="query"]', '#query', '.suggestions', '#submit']]
        assert label['y'] + label['height'] <= textarea['y']
        assert textarea['y'] + textarea['height'] <= examples['y']
        assert examples['y'] + examples['height'] <= submit['y']
        assert page.evaluate("['#query','.suggestions','#submit'].every((s,i,a) => i===0 || !!(document.querySelector(a[i-1]).compareDocumentPosition(document.querySelector(s)) & Node.DOCUMENT_POSITION_FOLLOWING))")
    assert_example_order()
    for question in ['房屋稅自住住家用稅率怎麼申請？', '地價稅自用住宅用地優惠稅率怎麼申請？']:
        example = page.get_by_role('button', name=f'「{question}」', exact=True)
        example.hover()
        assert example.evaluate('(e) => getComputedStyle(e).color') == 'rgb(212, 34, 45)'
        example.click()
        assert page.locator('#query').input_value() == question
        assert page.locator('#query').evaluate('(e) => e === document.activeElement')
        assert page.locator('#counter').inner_text() == f'{len(question)} / 1000'
    assert page.evaluate('demoHarness.requests.length') == 0
    checks.append('ready has no idle/reset panel; quoted examples between textarea and submit fill and focus input without submitting')
    def query(fixture, text):
        page.locator('#fixture').select_option(fixture)
        page.locator('#query').fill(text)
        page.locator('#submit').click()
        page.wait_for_timeout(450)
    for fixture, title in [('empty', '尚未取得解答'), ('error', '暫時無法取得解答')]:
        query(fixture, '尚未成功回答')
        assert page.get_by_role('heading', name=title).is_visible()
        assert page.locator('#reset').is_hidden()
        assert page.locator('#submit').is_enabled()
    checks.append('empty/error before first successful answer preserve status handling and do not reveal reset')
    page.reload()
    page.locator('#submit:not([disabled])').wait_for()
    page.locator('#query').fill('第一題')
    page.locator('#query').press('Enter')
    page.get_by_role('heading', name='正在查詢解答').wait_for()
    assert page.locator('#submit').is_disabled()
    assert page.locator('#reset').is_hidden()
    assert page.locator('#search-form').get_attribute('aria-busy') == 'true'
    page.locator('#result:not([hidden])').wait_for()
    assert page.locator('[data-answer]').inner_text() == '銀錢收據之印花稅稅率為每件按金額千分之四計算。'
    assert page.locator('[data-faq]').is_hidden()
    assert page.locator('[data-source-section]').is_hidden()
    assert page.get_by_role('button', name='清除前次問答，重新提問', exact=True).is_visible()
    assert page.locator('#status').is_hidden()
    checks.append('loading → answer-only result, no guessed FAQ')
    query('faq', '第二題')
    assert page.locator('[data-faq]').is_visible()
    assert page.locator('[data-faq] h3').inner_text() == '官方1999常見問答'
    page.screenshot(path=str(OUT/'desktop-faq.png'), full_page=True)
    query('generic', '接著詢問租賃住宅')
    assert page.locator('[data-faq]').is_hidden()
    assert page.locator('[data-sources] li').count() == 2
    requests = page.evaluate('demoHarness.requests')
    assert requests[0]['queryParams']['currentPlaybook'].endswith('f0512949-95f2-40c6-95d0-0c139b84b542')
    assert all('currentPlaybook' not in item['queryParams'] for item in requests[1:])
    assert len({item['session'] for item in requests}) == 1
    checks.append('FAQ enhancement replaced by generic multi-source answer; followup same session without override')
    page.screenshot(path=str(OUT/'desktop-generic.png'), full_page=True)
    old_session = page.evaluate('demoHarness.session')
    page.locator('#reset').click()
    assert page.evaluate('demoHarness.session') == old_session + 1
    assert page.locator('#query').input_value() == ''
    assert page.locator('#counter').inner_text() == '0 / 1000'
    assert page.locator('#query').evaluate('(e) => e === document.activeElement')
    assert page.locator('#result').is_hidden() and page.locator('#status').is_hidden()
    assert page.locator('#reset').is_hidden()
    query('text', 'reset後')
    assert page.evaluate('demoHarness.requests.at(-1).session') != old_session
    assert 'currentPlaybook' in page.evaluate('demoHarness.requests.at(-1).queryParams')
    page.locator('#expire').click()
    query('text', 'expiry後')
    assert 'currentPlaybook' in page.evaluate('demoHarness.requests.at(-1).queryParams')
    checks.append('exact reset action starts a new session, clears/focuses input, hides reset and rearms first-query override; expiry rearms')
    query('unsafe', '安全呈現')
    assert '<img src=x onerror=alert(1)>' in page.locator('[data-answer]').inner_text()
    assert page.locator('[data-answer] img').count() == 0
    assert page.locator('[data-faq]').is_hidden()
    assert page.locator('a[href^="javascript:"]').count() == 0
    checks.append('unsafe response rendered as text; invalid source/FAQ URL rejected')
    # Reconstruct the owner's presentation defect with explicitly synthetic text.
    # Invoke the real normalizer/renderer; no SDK response or tax claim is fabricated.
    url = 'https://tpctax.gov.taipei/News.aspx?n=BB8B93F0A49EAB80&sms=87415A8B9CE81B16'
    label = '地價稅按自用住宅用地優惠稅率課稅有哪些條件？如何申請？'
    text = f'**一、適用條件：**\n合成格式測試，非稅務回答。\n來源與詳細資訊請參考：[{label}]({url})'
    def render_fixture(answer, citations=None, metadata=None, normalize=True):
        return page.evaluate('''async ({answer,citations,metadata,normalize}) => {
          const {normalizeResult,renderResult} = await import('./assets/result-model.js');
          const detail={data:{messages:[{type:'text',text:answer},{citations}]}};
          if(metadata) detail.raw={queryResult:{responseMessages:[{payload:{universalAnswer:{schemaVersion:1,faqMetadata:metadata}}}]}};
          const model=normalize ? normalizeResult(detail,['https://tpctax.gov.taipei']) : {answer,sources:citations};
          const root=document.querySelector('#result');renderResult(model,root);root.hidden=false;
          return model;
        }''', {'answer':answer,'citations':citations or [],'metadata':metadata,'normalize':normalize})
    model = render_fixture(text,[{'url':url,'title':'duplicate'}])
    assert 'sources' not in model
    assert page.locator('[data-answer] strong').inner_text() == '一、適用條件：'
    assert page.locator('[data-answer]').text_content() == f'一、適用條件：\n合成格式測試，非稅務回答。\n來源與詳細資訊請參考：{label}'
    assert page.locator('[data-answer] a').inner_text() == label
    assert page.locator('[data-answer] a').get_attribute('href') == url
    assert url not in page.locator('[data-answer]').inner_text()
    assert '**' not in page.locator('[data-answer]').inner_text()
    assert page.locator('[data-source-section]').is_hidden()
    page.screenshot(path=str(OUT/'renderer-parity-desktop.png'),full_page=True)
    for width in [390,320]:
        page.set_viewport_size({'width':width,'height':844})
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        assert page.locator('[data-answer] a').is_visible()
        page.screenshot(path=str(OUT/f'renderer-parity-{width}.png'),full_page=True)
    page.set_viewport_size({'width':1440,'height':1100})
    checks.append('synthetic screenshot scenario: semantic bold/labeled link, exact line breaks, no exposed URL or duplicate source; desktop/390/320px PASS')
    additional = 'https://www.etax.nat.gov.tw/'
    render_fixture(text,[{'url':url},{'url':additional,'title':'額外來源'}])
    assert page.locator('[data-sources] li').count() == 1
    assert page.locator('[data-sources] a').inner_text() == '額外來源'
    render_fixture(text,[{'url':url}],normalize=False)
    assert page.locator('[data-source-section]').is_hidden()
    checks.append('duplicate source suppressed in normalizer and direct renderer; genuinely additional structured citation retained')
    render_fixture('裸網址 HTTPS://example.com/a_(b)。\n**[來源](https://example.com/other)**')
    assert page.locator('[data-answer] a').count() == 2
    assert page.locator('[data-answer] a').first.get_attribute('href') == 'https://example.com/a_(b)'
    assert page.locator('[data-answer]').text_content() == '裸網址 HTTPS://example.com/a_(b)。\n來源'
    assert page.locator('[data-answer] strong a').inner_text() == '來源'
    assert page.locator('[data-source-section]').is_hidden()
    checks.append('safe bare URL punctuation/parentheses and bold enclosing a labeled link render correctly without duplicate sources')
    malicious = '\n'.join(f'[不安全]({destination})' for destination in [
        'javascript:alert(1)','data:text/html,<script>alert(1)</script>',
        'https://user:pass@example.com/','https://','https://[bad'])
    malicious += '\n[未關閉](https://example.com/unclosed\n![不支援圖片](https://example.com/image.png)'
    malicious += '\n<script>window.__rendererExecuted=true</script><img src=x onerror="window.__rendererExecuted=true">'
    render_fixture(malicious)
    assert page.locator('[data-answer]').text_content() == malicious
    assert page.locator('[data-answer] a, [data-answer] script, [data-answer] img').count() == 0
    assert page.evaluate('window.__rendererExecuted === undefined')
    assert page.locator('[data-source-section]').is_hidden()
    checks.append('unsafe/malformed/incomplete Markdown and unsupported images stay literal; raw script/HTML inert, no executable elements or navigation')
    render_fixture(f'[<img onerror=alert(1)>]({url}) **<script>inert</script>**')
    assert page.locator('[data-answer] img, [data-answer] script').count() == 0
    assert page.locator('[data-answer] a').inner_text() == '<img onerror=alert(1)>'
    assert page.locator('[data-answer] strong').inner_text() == '<script>inert</script>'
    render_fixture(text,metadata={'kind':'official1999Faq','title':'合成 FAQ metadata','url':url})
    assert page.locator('[data-faq]').is_visible()
    assert page.locator('[data-faq] p').inner_text() == '合成 FAQ metadata'
    assert page.locator('[data-source-section]').is_hidden()
    render_fixture('下一個一般回答')
    assert page.locator('[data-faq]').is_hidden()
    assert page.locator('[data-answer] strong, [data-answer] a').count() == 0
    checks.append('HTML in labels/bold remains inert; explicit FAQ metadata preserved; next generic response clears earlier formatting/metadata')
    query('empty', '空回應')
    assert page.get_by_role('heading', name='尚未取得解答').is_visible()
    query('error', '錯誤回應')
    assert page.get_by_role('heading', name='暫時無法取得解答').is_visible()
    assert page.locator('#submit').is_enabled()
    checks.append('empty and service-error states; manual resubmission available')
    page.set_viewport_size({'width': 390, 'height': 844})
    assert_example_order()
    query('generic', '手機查詢')
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    assert page.locator('[data-answer]').is_visible()
    assert page.locator('[data-back]').get_attribute('href').startswith('https://tpctax.gov.taipei/News.aspx')
    page.screenshot(path=str(OUT/'mobile-generic.png'), full_page=True)
    checks.append('390px mobile no horizontal overflow; canonical return link')
    page.set_viewport_size({'width': 320, 'height': 700})
    assert_example_order()
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    before = page.evaluate('demoHarness.requests.length')
    page.locator('#query').dispatch_event('compositionstart')
    page.locator('#query').press('Enter')
    page.locator('#query').dispatch_event('compositionend')
    assert page.evaluate('demoHarness.requests.length') == before
    checks.append('320px layout and IME Enter guard')
    # Exercise live bootstrap with a local synthetic SDK; never load Google's SDK.
    context.route('**/assets/config.js', lambda r: r.fulfill(status=200, content_type='text/javascript',
        body=Path(__file__).resolve().parents[1].joinpath('assets/config.js').read_text().replace('liveEnabled: false','liveEnabled: true')))
    stub = '''window.stubRequests=[];window.stubSessions=[];
    customElements.define('df-messenger-chat',class extends HTMLElement {});
    customElements.define('df-messenger',class extends HTMLElement {
      connectedCallback(){setTimeout(()=>this.dispatchEvent(new CustomEvent('df-messenger-loaded',{bubbles:true,composed:true})),0);}
      startNewSession(options){this.session=(this.session||0)+1;window.stubSessions.push({session:this.session,options});}
      setQueryParameters(p){this.params={...p};}
      async sendQuery(query){const body={queryInput:{text:{text:query}},queryParams:{...this.params}};
        this.dispatchEvent(new CustomEvent('df-request-sent',{detail:{data:{requestBody:body}},cancelable:true,bubbles:true,composed:true}));
        window.stubRequests.push({session:this.session,...structuredClone(body)});
        this.dispatchEvent(new CustomEvent('df-response-received',{detail:{data:{messages:[{type:'text',text:'local SDK stub answer'}]}},cancelable:true,bubbles:true,composed:true}));}
    });'''
    context.route('https://www.gstatic.com/**', lambda r: r.fulfill(status=200,content_type='text/javascript',body=stub))
    page.goto(BASE+'index.html')
    page.locator('#submit:not([disabled])').wait_for()
    assert page.locator('df-messenger').is_hidden()
    assert page.locator('df-messenger').get_attribute('environment') is None
    assert page.locator('.demo-tools').count() == 0
    assert page.locator('#status').is_hidden() and page.locator('#reset').is_hidden()
    assert page.locator('.brand').get_attribute('href') == 'https://tpctax.gov.taipei/'
    assert page.locator('.brand').get_attribute('target') is None
    def business_events():
        return page.evaluate('Array.from(window.dataLayer || [], x => Array.from(x)).filter(x => x[0] === "event")')
    assert business_events() == []
    page.locator('[data-example]').first.click()
    assert business_events() == []
    page.locator('#query').fill('')
    page.locator('#search-form').evaluate('(form) => form.dispatchEvent(new Event("submit", {cancelable:true}))')
    assert business_events() == []
    page.locator('#query').evaluate('(input) => input.value="x".repeat(1001)')
    page.locator('#search-form').evaluate('(form) => form.dispatchEvent(new Event("submit", {cancelable:true}))')
    assert business_events() == []
    # An unsolicited SDK request must be cancelled by the transport, not counted.
    page.evaluate('document.querySelector("df-messenger").dispatchEvent(new CustomEvent("df-request-sent", {detail:{data:{requestBody:{queryInput:{text:{text:"unsolicited"}}}}},cancelable:true,bubbles:true,composed:true}))')
    assert business_events() == []
    page.evaluate('() => {window.originalSend=document.querySelector("df-messenger").sendQuery;document.querySelector("df-messenger").sendQuery=()=>{throw Error("not accepted")};}')
    page.locator('#query').fill('SDK rejected before sending');page.locator('#submit').click()
    page.get_by_role('heading',name='暫時無法取得解答').wait_for()
    assert business_events() == []
    page.evaluate('() => {document.querySelector("df-messenger").sendQuery=window.originalSend;}')
    for text in ['first SDK query', 'followup SDK query']:
        page.locator('#query').fill(text);page.locator('#submit').click()
        page.locator('#result:not([hidden])').wait_for()
        assert page.locator('[data-answer]').inner_text() == 'local SDK stub answer'
    requests = page.evaluate('stubRequests')
    assert business_events() == [['event','ai_question_start']]
    assert 'currentPlaybook' in requests[0]['queryParams'] and 'currentPlaybook' not in requests[1]['queryParams']
    checks.append('live bootstrap/sendQuery/event wiring verified with intercepted local SDK stub; no Google request')
    page.get_by_role('button', name='清除前次問答，重新提問', exact=True).click()
    assert page.evaluate('stubSessions') == [
        {'session': 1, 'options': {'retainHistory': False}},
        {'session': 2, 'options': {'retainHistory': False}},
    ]
    assert page.locator('#query').input_value() == ''
    assert page.locator('#query').evaluate('(e) => e === document.activeElement')
    assert page.locator('#status').is_hidden() and page.locator('#reset').is_hidden()
    assert business_events() == [['event','ai_question_start']]
    page.locator('#query').fill('after real SDK reset');page.locator('#submit').click()
    page.locator('#result:not([hidden])').wait_for()
    request = page.evaluate('stubRequests.at(-1)')
    assert request['session'] == 2 and request['queryParams']['currentPlaybook'].endswith('f0512949-95f2-40c6-95d0-0c139b84b542')
    assert business_events() == [['event','ai_question_start']]
    checks.append('citizen reset invokes SDK startNewSession(retainHistory:false) and rearms the next first-turn Playbook')
    page.reload();page.locator('#submit:not([disabled])').wait_for()
    page.locator('#query').fill('after page refresh');page.locator('#submit').click()
    page.locator('#result:not([hidden])').wait_for()
    assert business_events() == []
    # A fresh tab context can count once, even when the GA4 script is blocked.
    context.route('https://www.googletagmanager.com/gtag/js?*', lambda r:r.abort())
    page.evaluate('sessionStorage.clear()')
    page.reload();page.locator('#submit:not([disabled])').wait_for()
    page.locator('#query').fill('GA4 failure cannot block this private test question');page.locator('#submit').click()
    page.locator('#result:not([hidden])').wait_for()
    assert page.locator('[data-answer]').inner_text() == 'local SDK stub answer'
    assert business_events() == [['event','ai_question_start']]
    page.evaluate('sessionStorage.clear()')
    page.reload();page.locator('#submit:not([disabled])').wait_for()
    page.evaluate('() => {window.gtag=()=>{throw Error("blocked analytics send")};}')
    page.locator('#query').fill('followup despite GA4 failure');page.locator('#submit').click()
    page.locator('#result:not([hidden])').wait_for()
    assert page.locator('[data-answer]').inner_text() == 'local SDK stub answer'
    assert business_events() == []
    checks.append('GA4 once per tab across accepted first/followup/reset/reload; no event on boot/example/empty/unsolicited; blocked loader does not block answers; event contains no content')
    checks.append('index/demo brand is accessible same-tab official agency homepage; demo analytics stays disabled')
    # Loader failure generates a browser resource error, not an application pageerror.
    assert not external and not errors, (external, errors)
    browser.close()
OUT.joinpath('browser_validation.json').write_text(json.dumps({'status':'PASS','checks':checks,'external_requests':external,'intercepted_analytics_loader_requests':analytics_requests,'page_errors':errors,'production_requests':0},ensure_ascii=False,indent=2))
print(json.dumps({'status':'PASS','checks':len(checks),'external_requests':0,'production_requests':0}))
