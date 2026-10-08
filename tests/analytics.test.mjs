import test from 'node:test';
import assert from 'node:assert/strict';
import {createAnalytics} from '../assets/analytics.js';

const id = 'G-S891SFSMBH';
function browser(storage = new Map()) {
  const scripts = [];
  const runtime = {
    location: {origin: 'https://example.com', pathname: '/nested/1999/'},
    document: {createElement() {return {};}, head: {append(script) {scripts.push(script);}}},
    sessionStorage: {getItem(key) {return storage.get(key);}, setItem(key, value) {storage.set(key, value);}},
  };
  return {runtime, scripts, storage, events: () => (runtime.dataLayer || []).map(item => Array.from(item)).filter(item => item[0] === 'event')};
}
test('missing/invalid ID and isolated demo are disabled without loading or sending', () => {
  for (const value of [undefined, '', 'GTM-S891SFSMBH', 'G-short', 'G-S891SFSMBH?x=1', ' G-S891SFSMBH']) {
    const b = browser();createAnalytics(value, b.runtime).questionAccepted();
    assert.deepEqual(b.scripts, []);assert.deepEqual(b.events(), []);
  }
  const b = browser();createAnalytics(id, b.runtime, false).questionAccepted();
  assert.deepEqual(b.scripts, []);assert.deepEqual(b.events(), []);
});
test('valid ID loads official async gtag and sanitized ordinary page context; no question event on boot', () => {
  const b = browser();createAnalytics(id, b.runtime);
  assert.equal(b.scripts[0].src, 'https://www.googletagmanager.com/gtag/js?id='+id);
  assert.equal(b.scripts[0].async, true);assert.deepEqual(b.events(), []);
  const config = b.runtime.dataLayer.map(x => Array.from(x)).find(x => x[0] === 'config');
  assert.equal(config[1],id);assert.equal(config[2].send_page_view,true);
  assert.equal(config[2].page_location,'https://example.com/nested/1999/');
  assert.equal(config[2].page_referrer,'');
});
test('accepted first question emits only its event name; followups/reset/reload in same tab do not repeat', () => {
  const b = browser();const analytics = createAnalytics(id,b.runtime);
  analytics.questionAccepted();analytics.questionAccepted();analytics.questionAccepted();
  assert.deepEqual(b.events(),[['event','ai_question_start']]);
  const reload = browser(b.storage);createAnalytics(id,reload.runtime).questionAccepted();
  assert.deepEqual(reload.events(),[]);
  const fresh = browser();createAnalytics(id,fresh.runtime).questionAccepted();
  assert.deepEqual(fresh.events(),[['event','ai_question_start']]);
});
test('unavailable storage retains an in-memory guard; analytics send failures never throw or retry', () => {
  const b=browser();Object.defineProperty(b.runtime,'sessionStorage',{get(){throw Error('blocked');}});
  const analytics=createAnalytics(id,b.runtime);analytics.questionAccepted();analytics.questionAccepted();
  assert.deepEqual(b.events(),[['event','ai_question_start']]);
  let attempts=0;b.runtime.gtag=()=>{attempts++;throw Error('blocked send');};
  const other=browser();const throwing=createAnalytics(id,other.runtime);
  other.runtime.gtag=b.runtime.gtag;
  assert.doesNotThrow(()=>{throwing.questionAccepted();throwing.questionAccepted();});
  assert.equal(attempts,1);
});
test('bootstrap failure is isolated; loader never needs any question/answer/source payload', () => {
  const b=browser();b.runtime.document.head.append=()=>{throw Error('script blocked');};
  assert.doesNotThrow(()=>createAnalytics(id,b.runtime).questionAccepted());
  assert.deepEqual(b.events(),[]);
  const ok=browser();createAnalytics(id,ok.runtime).questionAccepted('question', 'answer', 'https://example.com/source');
  assert.deepEqual(ok.events(),[['event','ai_question_start']]);
});
