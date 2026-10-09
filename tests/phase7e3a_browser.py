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
    context = browser.new_context(viewport={'width': 1280, 'height': 1100}, reduced_motion='reduce')
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
    assert page.locator('#reset').count() == 0
    assert page.locator('df-messenger').count() == 0
    assert not external
    checks.append('isolated disabled-config fixture; no SDK or external traffic')
    context.unroute('**/assets/config.js', disabled_config)
    page.goto(BASE + 'demo.html')
    page.locator('#submit:not([disabled])').wait_for()
    assert page.locator('#status').is_hidden()
    assert page.locator('#reset').count() == 0
    assert page.locator('.brand').get_attribute('href') == 'https://tpctax.gov.taipei/'
    assert page.locator('.brand').get_attribute('target') is None
    assert page.locator('.brand img').get_attribute('src') == './assets/trs-header.png'
    assert page.locator('.brand .agency-name').inner_text() == '臺北市稅捐稽徵處'
    assert page.evaluate('typeof window.dataLayer === "undefined"')
    assert page.locator('.intro').count() == 0
    assert page.locator('.session-bar').count() == 0
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
        assert page.locator('#query').input_value() == ''
        assert page.locator('#counter').inner_text() == '0 / 1000'
    for fixture, title in [('empty', '尚未取得解答'), ('error', '暫時無法取得解答')]:
        query(fixture, '尚未成功回答')
        assert page.get_by_role('heading', name=title).is_visible()
        assert page.locator('#reset').count() == 0
        assert page.locator('#submit').is_enabled()
    checks.append('empty/error before first successful answer preserve status handling and do not reveal reset')
    page.reload()
    page.locator('#submit:not([disabled])').wait_for()
    page.locator('#query').fill('第一題')
    page.locator('#query').press('Enter')
    page.get_by_role('heading', name='正在查詢解答').wait_for()
    assert page.locator('#submit').is_disabled()
    assert page.locator('#reset').count() == 0
    assert page.locator('#search-form').get_attribute('aria-busy') == 'true'
    assert page.locator('#query').input_value() == ''
    assert page.locator('#counter').inner_text() == '0 / 1000'
    page.locator('#result:not([hidden])').wait_for()
    assert page.locator('#result-query').text_content() == '第一題'
    assert page.locator('[data-answer]').inner_text() == '銀錢收據之印花稅稅率為每件按金額千分之四計算。'
    assert page.locator('[data-faq]').is_hidden()
    assert page.locator('[data-source-section]').is_hidden()
    assert page.get_by_role('button', name='清除前次問答，重新提問', exact=True).count() == 0
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
    current_page = 'projects/serviceagent-1150909/locations/asia-northeast1/agents/799426c1-ba69-49dc-85e4-5065985706e2/flows/676409b6-b02f-4a24-9d3a-81e14cb77d4f/pages/START_PAGE'
    expected_params = {'currentPage': current_page, 'timeZone': 'Asia/Taipei'}
    assert all(item['queryParams'] == expected_params for item in requests)
    assert len({item['session'] for item in requests}) == 1
    assert page.locator('#result-query').text_content() == '接著詢問租賃住宅'
    assert page.locator('#result').count() == 1
    checks.append('first/second/third searches all use same FAQ currentPage; latest result replaces prior metadata with no reset/transcript')
    page.screenshot(path=str(OUT/'desktop-generic.png'), full_page=True)
    old_session = page.evaluate('demoHarness.session')
    page.locator('#expire').click()
    query('text', 'expiry後完整新問題')
    assert page.evaluate('demoHarness.session') == old_session + 1
    assert page.evaluate('demoHarness.requests.at(-1).queryParams') == expected_params
    assert page.locator('#reset, .session-bar').count() == 0
    checks.append('session expiry recovers internally with same FAQ defaults; no citizen reset control')
    for count in range(1, 6):
        query(f'faq{count}', f'完整新搜尋 {count}')
        expected = page.evaluate("async count => {const {faqTextMessages}=await import('./demo/mock-messenger.js');const {config}=await import('./assets/config.js');return faqTextMessages(count,config).flatMap(m=>m.text?.text||[]).join('\\n\\n')}", count)
        assert page.locator('[data-answer]').text_content() == expected
        assert page.locator('[data-answer] a').count() == count + 1
        assert page.locator('[data-answer] a').last.get_attribute('href') == 'https://tpctax.gov.taipei/cp.aspx?n=3A978B4E3ADD88F2'
        assert page.locator('[data-faq]').is_hidden()
        assert page.locator('#result-query').text_content() == f'完整新搜尋 {count}'
        for width in [1280,390,320]:
            page.set_viewport_size({'width':width,'height':844})
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
            assert page.locator('#reset, .session-bar').count() == 0
            assert page.locator('[data-answer]').evaluate('(e)=>getComputedStyle(e).whiteSpace') == 'pre-wrap'
            if count == 5: page.screenshot(path=str(OUT/f'faq-five-{width}.png'),full_page=True)
    query('fallback', '零結果完整問題')
    assert page.locator('[data-answer]').inner_text().startswith('找不到可用的 FAQ 搜尋結果，請換個方式描述問題。')
    assert '合成 FAQ 問題' not in page.locator('[data-answer]').inner_text()
    assert page.locator('[data-answer] a').count() == 1
    assert page.locator('[data-faq]').is_hidden()
    assert page.locator('#status').is_hidden()
    checks.append('1–5 complete multi-message/array-item FAQ texts, original numbering/newlines, clickable URLs and Rental link at 1280/390/320; zero fallback replaces stale results without cards')
    page.set_viewport_size({'width':1280,'height':1100})
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
    page.set_viewport_size({'width':1280,'height':1100})
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
    # Keep idle loading paused to prove early queries queue before gtag loads.
    page.add_init_script('window.requestIdleCallback=(callback)=>{window.pendingAnalytics=callback;return 1;}')
    stub = '''window.stubRequests=[];window.stubSessions=[];window.stubDuplicate=false;window.stubHold=false;
    customElements.define('df-messenger-chat',class extends HTMLElement {});
    customElements.define('df-messenger',class extends HTMLElement {
      connectedCallback(){setTimeout(()=>this.dispatchEvent(new CustomEvent('df-messenger-loaded',{bubbles:true,composed:true})),0);}
      startNewSession(options){this.session=(this.session||0)+1;window.stubSessions.push({session:this.session,options});}
      setQueryParameters(p){this.params={...p};}
      async sendQuery(query){
        if(window.stubHold)await new Promise((resolve,reject)=>{window.acceptStub=resolve;window.failStub=reject;});
        const body={queryInput:{text:{text:query}},queryParams:{...this.params}};
        if(!this.dispatchEvent(new CustomEvent('df-request-sent',{detail:{data:{requestBody:body}},cancelable:true,bubbles:true,composed:true})))return;
        window.stubRequests.push({session:this.session,sdkDefaults:structuredClone(this.params),...structuredClone(body)});
        window.lastStubBody=body;
        if(window.stubDuplicate)this.dispatchEvent(new CustomEvent('df-request-sent',{detail:{data:{requestBody:body}},cancelable:true,bubbles:true,composed:true}));
        if(window.stubHold)await new Promise(resolve=>window.answerStub=resolve);
        this.dispatchEvent(new CustomEvent('df-response-received',{detail:{data:{messages:[{type:'text',text:'local SDK stub answer'}]}},cancelable:true,bubbles:true,composed:true}));}
    });'''
    context.route('https://www.gstatic.com/**', lambda r: r.fulfill(status=200,content_type='text/javascript',body=stub))
    page.goto(BASE+'index.html')
    page.locator('#submit:not([disabled])').wait_for()
    assert page.locator('df-messenger').is_hidden()
    assert page.locator('df-messenger').get_attribute('environment') is None
    assert page.locator('.demo-tools').count() == 0
    assert page.locator('#status').is_hidden() and page.locator('#reset').count() == 0
    assert page.locator('.brand').get_attribute('href') == 'https://tpctax.gov.taipei/'
    assert page.locator('.brand').get_attribute('target') is None
    def business_events():
        return page.evaluate('Array.from(window.dataLayer || [], x => Array.from(x)).filter(x => x[0] === "event")')
    assert business_events() == []
    assert page.locator('script[src*="googletagmanager"]').count() == 0
    assert page.evaluate('typeof window.pendingAnalytics === "function"')
    page.locator('[data-example]').first.click()
    assert business_events() == []
    assert page.locator('#query').input_value() == page.locator('[data-example]').first.get_attribute('data-example')
    page.locator('#query').fill('')
    page.locator('#search-form').evaluate('(form) => form.dispatchEvent(new Event("submit", {cancelable:true}))')
    assert business_events() == []
    page.locator('#query').fill('  \n  ')
    page.locator('#search-form').evaluate('(form) => form.dispatchEvent(new Event("submit", {cancelable:true}))')
    assert page.locator('#query').input_value() == '  \n  '
    assert business_events() == []
    page.locator('#query').evaluate('(input) => {input.value="x".repeat(1001);input.dispatchEvent(new Event("input"));}')
    page.locator('#search-form').evaluate('(form) => form.dispatchEvent(new Event("submit", {cancelable:true}))')
    assert business_events() == []
    assert page.locator('#query').input_value() == 'x'*1001
    assert page.locator('#counter').inner_text() == '1001 / 1000'
    # An unsolicited SDK request must be cancelled by the transport, not counted.
    page.evaluate('document.querySelector("df-messenger").dispatchEvent(new CustomEvent("df-request-sent", {detail:{data:{requestBody:{queryInput:{text:{text:"unsolicited"}}}}},cancelable:true,bubbles:true,composed:true}))')
    assert business_events() == []
    assert page.locator('#query').input_value() == 'x'*1001
    page.evaluate('() => {window.originalSend=document.querySelector("df-messenger").sendQuery;document.querySelector("df-messenger").sendQuery=()=>{throw Error("not accepted")};}')
    page.locator('#query').fill('SDK rejected before sending');page.locator('#submit').click()
    page.get_by_role('heading',name='暫時無法取得解答').wait_for()
    assert business_events() == []
    assert page.locator('#query').input_value() == 'SDK rejected before sending'
    page.evaluate('() => {document.querySelector("df-messenger").sendQuery=window.originalSend;}')
    for count, text in enumerate(['first SDK query', 'followup SDK query'], 1):
        page.evaluate('stubDuplicate='+str(count == 2).lower())
        page.locator('#query').fill(text);page.locator('#submit').click()
        page.locator('#result:not([hidden])').wait_for()
        assert page.locator('[data-answer]').inner_text() == 'local SDK stub answer'
        assert page.locator('#query').input_value() == ''
        assert page.locator('#counter').inner_text() == '0 / 1000'
        assert page.locator('#result-query').text_content() == text
        assert business_events() == [['event','ai_query_submit']]*count
    requests = page.evaluate('stubRequests')
    assert business_events() == [['event','ai_query_submit']]*2
    assert all(item['queryParams'] == expected_params and item['sdkDefaults'] == expected_params for item in requests)
    assert all('currentPlaybook' not in item['queryParams'] for item in requests)
    assert page.locator('#reset, .session-bar').count() == 0
    assert page.evaluate('stubSessions') == [{'session':1,'options':{'retainHistory':False}}]
    page.locator('#query').fill('third independent SDK search');page.locator('#submit').click()
    page.locator('#result:not([hidden])').wait_for()
    request = page.evaluate('stubRequests.at(-1)')
    assert request['session'] == 1 and request['queryParams'] == expected_params and request['sdkDefaults'] == expected_params
    assert business_events() == [['event','ai_query_submit']]*3
    assert page.locator('#query').input_value() == ''
    assert page.locator('#counter').inner_text() == '0 / 1000'
    assert page.locator('#result-query').text_content() == 'third independent SDK search'
    current_page_evidence = [{'ordinal':i+1,'session':item['session'],'queryParams':item['queryParams'],'sdkDefaults':item['sdkDefaults']} for i,item in enumerate(page.evaluate('stubRequests'))]
    checks.append('SDK first/second/third currentPage bodies and pre-event defaults identical; no currentPlaybook or reset UI; GA counts 1/2/3 with no parameters')
    assert page.locator('script[src*="googletagmanager"]').count() == 0
    page.evaluate('window.pendingAnalytics()')
    page.locator('script[src*="googletagmanager"]').wait_for(state='attached')
    assert business_events() == [['event','ai_query_submit']]*3
    checks.append('Messenger ready and first/second/third events retained before deferred GA4 loader; eventual official loader')
    checks.append('accepted first/second/third send clears input/counter; result header retains sent text; accepted error/empty never restores input')
    page.reload();page.locator('#submit:not([disabled])').wait_for()
    page.evaluate('stubHold=true')
    text = '  延後接受的問題\n第二行  '
    page.locator('#query').fill(text);page.locator('#submit').click()
    page.get_by_role('heading',name='正在查詢解答').wait_for()
    assert page.locator('#query').input_value() == text
    assert page.locator('#counter').inner_text() == f'{len(text)} / 1000'
    assert business_events() == []
    page.evaluate('window.failStub(Error("rejected before acceptance"))')
    page.get_by_role('heading',name='暫時無法取得解答').wait_for()
    page.locator('#submit:not([disabled])').wait_for()
    assert page.locator('#query').input_value() == text
    assert business_events() == []
    page.locator('#submit').click()
    focus_before = page.evaluate('document.activeElement.id')
    assert page.locator('#query').input_value() == text
    page.evaluate('window.acceptStub()')
    page.wait_for_function('document.querySelector("#query").value === ""')
    assert page.locator('#counter').inner_text() == '0 / 1000'
    assert page.evaluate('document.activeElement.id') == focus_before
    assert page.locator('#result').is_hidden()
    assert business_events() == [['event','ai_query_submit']]
    page.locator('#query').fill('下一題草稿')
    page.evaluate('document.querySelector("df-messenger").dispatchEvent(new CustomEvent("df-request-sent",{detail:{data:{requestBody:window.lastStubBody}},cancelable:true,bubbles:true,composed:true}))')
    assert page.locator('#query').input_value() == '下一題草稿'
    assert business_events() == [['event','ai_query_submit']]
    page.evaluate('window.answerStub()')
    page.locator('#result:not([hidden])').wait_for()
    assert page.locator('#result-query').text_content() == text.strip()
    assert page.evaluate('stubRequests[0].queryInput.text.text') == text.strip()
    assert page.locator('#query').input_value() == '下一題草稿'
    assert page.locator('#counter').inner_text() == '5 / 1000'
    assert page.locator('#result-title').evaluate('(e)=>e===document.activeElement')
    assert business_events() == [['event','ai_query_submit']]
    checks.append('delayed submit/rejection retains input; acceptance clears before answer with no focus steal; duplicate notification and later answer preserve next draft and original result query')
    # Technical expiry remains internal; no user reset or extra analytics event.
    page.reload();page.locator('#submit:not([disabled])').wait_for()
    page.evaluate('stubHold=true')
    page.locator('#query').fill('session expires during accepted search');page.locator('#submit').click()
    page.evaluate('window.acceptStub()')
    page.wait_for_function('document.querySelector("#query").value === ""')
    page.evaluate('document.querySelector("df-messenger").dispatchEvent(new CustomEvent("df-session-expired",{bubbles:true,composed:true}))')
    page.get_by_role('heading',name='本次查詢已結束').wait_for()
    assert page.locator('#status').get_attribute('role') == 'alert'
    assert '脈絡' not in page.locator('#status-description').inner_text()
    assert page.locator('#submit').is_disabled()
    page.evaluate('window.answerStub()')
    page.locator('#submit:not([disabled])').wait_for()
    assert page.locator('#result').is_hidden()
    assert len(page.evaluate('stubSessions')) == 2
    assert business_events() == [['event','ai_query_submit']]
    page.evaluate('stubHold=false')
    page.locator('#query').fill('complete new search after technical recovery');page.locator('#submit').click()
    page.locator('#result:not([hidden])').wait_for()
    assert page.evaluate('stubRequests.at(-1).queryParams') == expected_params
    assert business_events() == [['event','ai_query_submit']]*2
    assert page.locator('#reset, .session-bar').count() == 0
    checks.append('accepted in-flight expiry alerts without conversation-reset language; internal session recovery ignores late answer, next independent currentPage query succeeds, GA adds no recovery event')
    def short_config(r):
        r.fulfill(status=200,content_type='text/javascript',body=config_source.replace('requestTimeoutMs: 60000','requestTimeoutMs: 300'))
    context.route('**/assets/config.js',short_config)
    page.reload();page.locator('#submit:not([disabled])').wait_for()
    page.evaluate('stubHold=true')
    page.locator('#query').fill('accepted timeout fixture');page.locator('#submit').click();page.evaluate('window.acceptStub()')
    page.get_by_role('heading',name='暫時無法取得解答').wait_for()
    assert page.locator('#submit').is_disabled()
    assert page.locator('#query').input_value() == ''
    assert business_events() == [['event','ai_query_submit']]
    page.evaluate('window.answerStub()')
    page.locator('#submit:not([disabled])').wait_for()
    assert page.locator('#result').is_hidden()
    assert len(page.evaluate('stubRequests')) == 1
    page.evaluate('stubHold=false')
    page.locator('#query').fill('new search after timeout settled');page.locator('#submit').click()
    page.locator('#result:not([hidden])').wait_for()
    assert page.evaluate('stubRequests.at(-1).queryParams') == expected_params
    assert business_events() == [['event','ai_query_submit']]*2
    context.unroute('**/assets/config.js',short_config)
    checks.append('timeout keeps SDK operation locked, ignores late answer and never retries; manual new currentPage search works after settle with exactly one GA event')
    # Queries continue when the GA4 script is blocked, with no storage gate.
    context.route('https://www.googletagmanager.com/gtag/js?*', lambda r:r.abort())
    page.evaluate('sessionStorage.clear()')
    page.reload();page.locator('#submit:not([disabled])').wait_for()
    page.evaluate('window.pendingAnalytics()')
    page.locator('#query').fill('GA4 failure cannot block this private test question');page.locator('#submit').click()
    page.locator('#result:not([hidden])').wait_for()
    assert page.locator('[data-answer]').inner_text() == 'local SDK stub answer'
    assert business_events() == [['event','ai_query_submit']]
    # A cancelled pending text request counts zero, even though the form was valid.
    page.evaluate('window.cancelTest=e=>e.preventDefault();window.addEventListener("df-request-sent",window.cancelTest,{capture:true})')
    page.locator('#query').fill('cancelled before SDK sending');page.locator('#submit').click()
    page.get_by_role('heading',name='尚未取得解答').wait_for()
    assert business_events() == [['event','ai_query_submit']]
    assert page.locator('#query').input_value() == 'cancelled before SDK sending'
    page.evaluate('window.removeEventListener("df-request-sent",window.cancelTest,{capture:true})')
    page.evaluate('sessionStorage.clear()')
    page.reload();page.locator('#submit:not([disabled])').wait_for()
    page.evaluate('() => {window.gtag=()=>{throw Error("blocked analytics send")};}')
    page.locator('#query').fill('followup despite GA4 failure');page.locator('#submit').click()
    page.locator('#result:not([hidden])').wait_for()
    assert page.locator('[data-answer]').inner_text() == 'local SDK stub answer'
    assert business_events() == []
    assert page.locator('#query').input_value() == ''
    checks.append('GA4 per accepted query including first/second/third/refresh; no duplicate SDK notification, boot/example/empty/unsolicited/cancelled events; blocked loader/send does not block answers; no content parameters')
    checks.append('index/demo brand is accessible same-tab official agency homepage; demo analytics stays disabled')
    # Validate local module/deferred-loader compatibility without broad CSP rules.
    page.add_init_script('window.cspViolations=[];document.addEventListener("securitypolicyviolation",e=>window.cspViolations.push(e.violatedDirective))')
    policy = "default-src 'none'; script-src 'self' https://www.gstatic.com https://www.googletagmanager.com; style-src 'self'; img-src 'self'; connect-src 'none'; base-uri 'none'; form-action 'none'"
    context.route(BASE+'index.html', lambda r:r.fulfill(status=200,content_type='text/html',
        headers={'Content-Security-Policy':policy},body=Path(__file__).resolve().parents[1].joinpath('index.html').read_text()))
    page.goto(BASE+'index.html');page.locator('#submit:not([disabled])').wait_for()
    page.evaluate('window.pendingAnalytics()')
    page.locator('#query').fill('scoped local CSP fixture');page.locator('#submit').click()
    page.locator('#result:not([hidden])').wait_for()
    assert page.evaluate('cspViolations') == []
    assert business_events() == [['event','ai_query_submit']]
    checks.append('scoped local CSP permits same-origin modules and exact stub script origins; no new blocking JS/CSP errors; real Google CORS remains unverified')
    context.route('https://www.gstatic.com/**', lambda r:r.abort())
    page.goto(BASE+'index.html')
    page.get_by_role('heading',name='服務準備中').wait_for()
    assert page.evaluate('typeof window.pendingAnalytics === "function"')
    page.evaluate('window.pendingAnalytics()')
    assert page.locator('script[src*="googletagmanager"]').count() == 1
    assert business_events() == []
    checks.append('GA4 load is scheduled after failed core initialization too; page measurement queued, zero query event')
    # Loader failure generates a browser resource error, not an application pageerror.
    assert not external and not errors, (external, errors)
    browser.close()
OUT.joinpath('browser_validation.json').write_text(json.dumps({'status':'PASS','checks':checks,'external_requests':external,'intercepted_analytics_loader_requests':analytics_requests,'page_errors':errors,'production_requests':0,'current_page_request_evidence':current_page_evidence},ensure_ascii=False,indent=2))
print(json.dumps({'status':'PASS','checks':len(checks),'external_requests':0,'production_requests':0}))
