import test from 'node:test';
import assert from 'node:assert/strict';
import {createAnalytics} from '../assets/analytics.js';

const id = 'G-S891SFSMBH';
function browser() {
  const scripts = [], idle = [], timers = [];
  const runtime = {
    location: {origin: 'https://example.com', pathname: '/nested/1999/'},
    document: {createElement() {return {};}, head: {append(script) {scripts.push(script);}}},
    requestIdleCallback(callback, options) {idle.push({callback, options});},
    setTimeout(callback) {timers.push(callback);},
  };
  return {runtime, scripts, idle, timers,
    events: () => (runtime.dataLayer || []).map(item => Array.from(item)).filter(item => item[0] === 'event')};
}
test('missing/invalid ID and isolated demo load and send nothing', () => {
  for (const value of [undefined, '', 'GTM-S891SFSMBH', 'G-short', 'G-S891SFSMBH?x=1', ' G-S891SFSMBH']) {
    const b = browser(), analytics = createAnalytics(value, b.runtime);
    analytics.queryAccepted();analytics.loadAfterCore();
    assert.deepEqual(b.scripts, []);assert.deepEqual(b.events(), []);assert.deepEqual(b.idle, []);
  }
  const b = browser(), analytics = createAnalytics(id, b.runtime, false);
  analytics.queryAccepted();analytics.loadAfterCore();
  assert.deepEqual(b.scripts, []);assert.deepEqual(b.events(), []);
});
test('queue is available immediately; official async loader waits for core then bounded idle', () => {
  const b = browser(), analytics = createAnalytics(id, b.runtime);
  assert.deepEqual(b.scripts, []);assert.deepEqual(b.idle, []);assert.deepEqual(b.events(), []);
  const config = b.runtime.dataLayer.map(x => Array.from(x)).find(x => x[0] === 'config');
  assert.equal(config[1], id);assert.equal(config[2].send_page_view, true);
  assert.equal(config[2].page_location, 'https://example.com/nested/1999/');
  assert.equal(config[2].page_referrer, '');
  analytics.queryAccepted(); // First query before idle/loader is retained.
  analytics.loadAfterCore();analytics.loadAfterCore();
  assert.equal(b.idle.length, 1);assert.equal(b.idle[0].options.timeout, 1500);
  assert.deepEqual(b.scripts, []);b.idle[0].callback();
  assert.equal(b.scripts.length, 1);
  assert.equal(b.scripts[0].src, 'https://www.googletagmanager.com/gtag/js?id='+id);
  assert.equal(b.scripts[0].async, true);
  assert.deepEqual(b.events(), [['event', 'ai_query_submit']]);
});
test('each accepted query emits only the new event name, for first, second and third independent searches', () => {
  const b = browser(), analytics = createAnalytics(id, b.runtime);
  analytics.queryAccepted('private question');
  analytics.queryAccepted('private answer');
  analytics.queryAccepted('https://example.com/private-source');
  assert.deepEqual(b.events(), Array(3).fill(['event', 'ai_query_submit']));
});
test('no tab/storage deduplication remains, even if sessionStorage is inaccessible', () => {
  const b = browser();Object.defineProperty(b.runtime, 'sessionStorage', {get() {throw Error('must not access');}});
  const analytics = createAnalytics(id, b.runtime);
  analytics.queryAccepted();analytics.queryAccepted();
  assert.deepEqual(b.events(), Array(2).fill(['event', 'ai_query_submit']));
});
test('send or loader exceptions never throw, and a failed event does not suppress later queries', () => {
  const b = browser(), analytics = createAnalytics(id, b.runtime);
  const original = b.runtime.gtag;
  let attempts = 0;b.runtime.gtag = () => {attempts++;throw Error('blocked send');};
  assert.doesNotThrow(() => {analytics.queryAccepted();analytics.queryAccepted();});
  assert.equal(attempts, 2);b.runtime.gtag = original;
  analytics.queryAccepted();assert.deepEqual(b.events(), [['event', 'ai_query_submit']]);
  b.runtime.document.head.append = () => {throw Error('blocked script');};
  analytics.loadAfterCore();assert.doesNotThrow(() => b.idle[0].callback());
  assert.doesNotThrow(() => analytics.queryAccepted());assert.equal(b.events().length, 2);
});
test('timer fallback works without idle API or after idle scheduling failure', () => {
  for (const fails of [false, true]) {
    const b = browser();b.runtime.requestIdleCallback = fails ? () => {throw Error('scheduler');} : undefined;
    const analytics = createAnalytics(id, b.runtime);analytics.loadAfterCore();
    assert.equal(b.timers.length, 1);assert.deepEqual(b.scripts, []);b.timers[0]();
    assert.equal(b.scripts.length, 1);assert.doesNotThrow(() => analytics.queryAccepted());
  }
});
test('bootstrap or both scheduler failures stay analytics-only', () => {
  const b = browser();b.runtime.gtag = () => {throw Error('bootstrap');};
  const disabled = createAnalytics(id, b.runtime);
  assert.doesNotThrow(() => {disabled.queryAccepted();disabled.loadAfterCore();});
  assert.deepEqual(b.scripts, []);assert.deepEqual(b.events(), []);
  const other = browser(), analytics = createAnalytics(id, other.runtime);
  other.runtime.requestIdleCallback = other.runtime.setTimeout = () => {throw Error('scheduler');};
  assert.doesNotThrow(() => {analytics.loadAfterCore();analytics.queryAccepted();});
  assert.deepEqual(other.events(), [['event', 'ai_query_submit']]);
});
