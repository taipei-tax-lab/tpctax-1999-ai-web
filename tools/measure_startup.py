"""Offline cold-start comparison; SDK/gtag fixtures never call Production or GA."""
import argparse
import json
from pathlib import Path
import statistics
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

SDK = '''customElements.define('df-messenger-chat',class extends HTMLElement {});
customElements.define('df-messenger',class extends HTMLElement {
 connectedCallback(){setTimeout(()=>this.dispatchEvent(new CustomEvent('df-messenger-loaded',{bubbles:true,composed:true})),200);}
 startNewSession(){} setQueryParameters(){} sendQuery(){}
});'''
INIT = '''window.bench={ready:null,lcp:null};
new PerformanceObserver(list=>{for(const e of list.getEntries())window.bench.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
new MutationObserver(()=>{const b=document.querySelector('#submit');if(b&&!b.disabled&&window.bench.ready===null)window.bench.ready=performance.now();}).observe(document,{subtree:true,attributes:true,attributeFilter:['disabled']});'''


def measure(browser, url):
    context = browser.new_context(viewport={'width': 1280, 'height': 900})
    page = context.new_page()
    page.add_init_script(INIT)
    requests, errors, ga = [], [], []
    page.on('request', lambda r: requests.append(r.url))
    page.on('pageerror', lambda e: errors.append(str(e)))

    def route(r):
        if r.request.url.startswith(url.rsplit('/', 1)[0]+'/'):
            r.continue_()
        elif r.request.url.startswith('https://www.gstatic.com/dialogflow-console/'):
            r.fulfill(status=200, content_type='text/javascript', body=SDK)
        elif r.request.url.startswith('https://www.googletagmanager.com/gtag/js?'):
            ga.append(page.evaluate('({time:performance.now(),buttonReady:!document.querySelector("#submit").disabled})'))
            r.fulfill(status=200, content_type='text/javascript', body='/* offline loader fixture */')
        else:
            r.abort()
            errors.append('Unexpected external request: '+r.request.url)

    context.route('**/*', route)
    session = context.new_cdp_session(page)
    session.send('Network.enable')
    session.send('Network.setCacheDisabled', {'cacheDisabled': True})
    session.send('Network.emulateNetworkConditions', {'offline': False, 'latency': 80,
                 'downloadThroughput': 200000, 'uploadThroughput': 93750,
                 'connectionType': 'cellular4g'})
    page.goto(url, wait_until='load')
    page.wait_for_function('window.bench.ready!==null')
    page.wait_for_function('document.querySelectorAll("script[src*=googletagmanager]").length===1')
    page.wait_for_timeout(100)
    row = page.evaluate('''()=>({ready:window.bench.ready,lcp:window.bench.lcp,
      fcp:performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
      dcl:performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd,
      resources:performance.getEntriesByType('resource').map(e=>({name:e.name.split('/').at(-1),
      initiator:e.initiatorType,start:e.startTime,end:e.responseEnd,bytes:e.decodedBodySize}))})''')
    row.update({'ga': ga, 'errors': errors, 'requests': requests})
    context.close()
    assert not errors, errors
    return row


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-url', required=True, help='Local HTTP directory containing version snapshots')
    parser.add_argument('--variants', nargs='+', required=True)
    parser.add_argument('--runs', type=int, default=7)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    assert urlsplit(args.base_url).hostname in {'127.0.0.1', 'localhost'}, 'Local fixtures only'
    rows = {name: [] for name in args.variants}
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
        for run in range(args.runs):
            # Rotate order and run serially; do not compare overlapping browser runs.
            order = args.variants[run % len(args.variants):]+args.variants[:run % len(args.variants)]
            for name in order:
                rows[name].append(measure(browser, args.base_url.rstrip('/')+'/'+name+'/index.html'))
            print(json.dumps({'completed_round': run+1}), flush=True)
        browser.close()
    summaries = {}
    for name, samples in rows.items():
        summaries[name] = {
            'medians_ms': {k: round(statistics.median(r[k] for r in samples if r[k] is not None), 1)
                           for k in ['ready', 'lcp', 'fcp', 'dcl']},
            'range_ms': {k: [round(min(r[k] for r in samples), 1), round(max(r[k] for r in samples), 1)]
                         for k in ['ready', 'fcp', 'dcl']},
            'ga_before_ready_runs': sum(any(not g['buttonReady'] for g in r['ga']) for r in samples),
            'local_js_requests_per_run': [sum('/assets/' in x and x.endswith('.js') for x in r['requests']) for r in samples],
        }
    report = {'conditions': {'cold_context': True, 'cache_disabled': True, 'latency_ms': 80,
               'download_bytes_s': 200000, 'viewport': [1280, 900], 'sdk_fixture_ready_delay_ms': 200,
               'external_scripts': 'locally fulfilled fixtures', 'real_production_queries': 0,
               'real_ga_requests': 0, 'runs_per_variant': args.runs}, 'summary': summaries, 'samples': rows}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, indent=2))
    print(json.dumps(summaries, indent=2))


if __name__ == '__main__':
    main()
