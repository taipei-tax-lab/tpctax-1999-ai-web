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
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(BASE + 'index.html')
    page.get_by_role('heading', name='服務準備中').wait_for()
    assert page.locator('#submit').is_disabled()
    assert page.locator('df-messenger').count() == 0
    assert not external
    checks.append('hosting default disabled; no SDK or external traffic')
    page.goto(BASE + 'demo.html')
    page.get_by_role('heading', name='您的問題，從這裡開始').wait_for()
    page.locator('#query').fill('第一題')
    page.locator('#query').press('Enter')
    page.get_by_role('heading', name='正在查詢解答').wait_for()
    page.locator('#result:not([hidden])').wait_for()
    assert page.locator('[data-answer]').inner_text() == '銀錢收據之印花稅稅率為每件按金額千分之四計算。'
    assert page.locator('[data-faq]').is_hidden()
    assert page.locator('[data-source-section]').is_hidden()
    checks.append('loading → answer-only result, no guessed FAQ')
    def query(fixture, text):
        page.locator('#fixture').select_option(fixture)
        page.locator('#query').fill(text)
        page.locator('#submit').click()
        page.wait_for_timeout(450)
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
    page.locator('#reset').click()
    query('text', 'reset後')
    assert 'currentPlaybook' in page.evaluate('demoHarness.requests.at(-1).queryParams')
    page.locator('#expire').click()
    query('text', 'expiry後')
    assert 'currentPlaybook' in page.evaluate('demoHarness.requests.at(-1).queryParams')
    checks.append('explicit reset and expiry rearm first-query override')
    query('unsafe', '安全呈現')
    assert '<img src=x onerror=alert(1)>' in page.locator('[data-answer]').inner_text()
    assert page.locator('[data-answer] img').count() == 0
    assert page.locator('[data-faq]').is_hidden()
    assert page.locator('a[href^="javascript:"]').count() == 0
    checks.append('unsafe response rendered as text; invalid source/FAQ URL rejected')
    query('empty', '空回應')
    assert page.get_by_role('heading', name='尚未取得解答').is_visible()
    query('error', '錯誤回應')
    assert page.get_by_role('heading', name='暫時無法取得解答').is_visible()
    assert page.locator('#submit').is_enabled()
    checks.append('empty and service-error states; manual resubmission available')
    page.set_viewport_size({'width': 390, 'height': 844})
    query('generic', '手機查詢')
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    assert page.locator('[data-answer]').is_visible()
    assert page.locator('[data-back]').get_attribute('href').startswith('https://tpctax.gov.taipei/News.aspx')
    page.screenshot(path=str(OUT/'mobile-generic.png'), full_page=True)
    checks.append('390px mobile no horizontal overflow; canonical return link')
    page.set_viewport_size({'width': 320, 'height': 700})
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
    stub = '''window.stubRequests=[];
    customElements.define('df-messenger-chat',class extends HTMLElement {});
    customElements.define('df-messenger',class extends HTMLElement {
      connectedCallback(){setTimeout(()=>this.dispatchEvent(new CustomEvent('df-messenger-loaded',{bubbles:true,composed:true})),0);}
      startNewSession(){this.session=(this.session||0)+1;}
      setQueryParameters(p){this.params={...p};}
      async sendQuery(query){const body={queryInput:{text:{text:query}},queryParams:{...this.params}};
        this.dispatchEvent(new CustomEvent('df-request-sent',{detail:{data:{requestBody:body}},cancelable:true,bubbles:true,composed:true}));
        window.stubRequests.push(structuredClone(body));
        this.dispatchEvent(new CustomEvent('df-response-received',{detail:{data:{messages:[{type:'text',text:'local SDK stub answer'}]}},cancelable:true,bubbles:true,composed:true}));}
    });'''
    context.route('https://www.gstatic.com/**', lambda r: r.fulfill(status=200,content_type='text/javascript',body=stub))
    page.goto(BASE+'index.html')
    page.locator('#submit:not([disabled])').wait_for()
    assert page.locator('df-messenger').is_hidden()
    assert page.locator('df-messenger').get_attribute('environment') is None
    assert page.locator('.demo-tools').count() == 0
    for text in ['first SDK query', 'followup SDK query']:
        page.locator('#query').fill(text);page.locator('#submit').click()
        page.locator('#result:not([hidden])').wait_for()
        assert page.locator('[data-answer]').inner_text() == 'local SDK stub answer'
    requests = page.evaluate('stubRequests')
    assert 'currentPlaybook' in requests[0]['queryParams'] and 'currentPlaybook' not in requests[1]['queryParams']
    checks.append('live bootstrap/sendQuery/event wiring verified with intercepted local SDK stub; no Google request')
    assert not external and not errors, (external, errors)
    browser.close()
OUT.joinpath('browser_validation.json').write_text(json.dumps({'status':'PASS','checks':checks,'external_requests':external,'page_errors':errors,'production_requests':0},ensure_ascii=False,indent=2))
print(json.dumps({'status':'PASS','checks':len(checks),'external_requests':0,'production_requests':0}))
