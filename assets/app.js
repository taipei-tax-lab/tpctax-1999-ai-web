import {config} from './config.js';
import {normalizeResult, renderResult} from './result-model.js';
import {MessengerTransport, loadMessenger} from './messenger-transport.js';
import {createAnalytics} from './analytics.js';

const analytics = createAnalytics(config.ga4MeasurementId, window, document.body.dataset.demo !== 'true');

const form = document.querySelector('#search-form'), input = document.querySelector('#query');
const submit = document.querySelector('#submit'), reset = document.querySelector('#reset');
const status = document.querySelector('#status'), result = document.querySelector('#result');
let transport, ready = false, busy = false, composing = false, hasAnswer = false;
const states = {
  loading: ['正在查詢解答', '正在整理本次回答，請稍候。'],
  empty: ['尚未取得解答', '您可以補充問題的條件，再手動送出查詢。'],
  error: ['暫時無法取得解答', '請稍後再手動查詢；若查詢尚未結束，按鈕將暫時停用。'],
  session: ['本次查詢已結束', '查詢脈絡已重設，請重新送出問題。'],
  unavailable: ['服務準備中', '查詢服務尚未開放。您可以先查看本府1999常見問答。'],
};
function showState(name) {
  result.hidden = true;status.hidden = name === 'idle';status.dataset.state = name;
  if (status.hidden) return;
  const [title, description] = states[name];
  document.querySelector('#status-title').textContent = title;
  document.querySelector('#status-description').textContent = description;
  status.setAttribute('role', ['error','session'].includes(name) ? 'alert' : 'status');
}
function controls() {
  reset.parentElement.hidden = !hasAnswer;
  submit.disabled = !ready || busy || !!transport?.locked;
  reset.disabled = !ready || busy || !!transport?.locked;
  form.setAttribute('aria-busy', String(busy));
}
input.addEventListener('input', () => {document.querySelector('#counter').textContent = `${input.value.length} / ${config.maxQueryLength}`;});
input.addEventListener('compositionstart', () => {composing = true;});
input.addEventListener('compositionend', () => {composing = false;});
input.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing && !composing && event.keyCode !== 229) {
    event.preventDefault();if (!submit.disabled) form.requestSubmit();
  }
});
document.querySelectorAll('[data-example]').forEach(button => button.addEventListener('click', () => {
  input.value = button.dataset.example;input.dispatchEvent(new Event('input'));input.focus();
}));
document.querySelector('[data-back]').href = config.officialFaqUrl;
form.addEventListener('submit', async event => {
  event.preventDefault();const query = input.value.trim();
  if (!query || query.length > config.maxQueryLength || submit.disabled) return;
  busy = true;controls();showState('loading');
  try {
    const detail = await transport.send(query);
    const model = normalizeResult(detail, config.officialFaqOrigins);
    if (!model.answer.trim()) {showState('empty');return;}
    renderResult(model, result);document.querySelector('#result-query').textContent = query;
    hasAnswer = true;status.hidden = true;result.hidden = false;document.querySelector('#result-title').focus({preventScroll:true});
  } catch (error) {showState(error.message === 'session' ? 'session' : error.message === 'empty' ? 'empty' : 'error');}
  finally {busy = false;controls();}
});
reset.addEventListener('click', () => {
  try {transport.reset();hasAnswer = false;input.value = '';input.dispatchEvent(new Event('input'));showState('idle');input.focus();}
  catch {showState('error');}
  controls();
});
async function initialize() {
  try {
    let messenger;
    if (document.body.dataset.demo === 'true') {
      const {createDemo} = await import('../demo/mock-messenger.js');messenger = createDemo(config);
    } else {
      if (!config.liveEnabled) {showState('unavailable');return;}
      messenger = await loadMessenger(config);
    }
    transport = new MessengerTransport(messenger, config);transport.onSettled = controls;
    const trackedRequests = new WeakSet();
    // Transport's earlier listener marks accepted user requests and cancels unsolicited ones.
    window.addEventListener('df-request-sent', event => {
      const path = event.composedPath?.() || [];
      if ((event.target === window || path.includes(messenger)) && !event.defaultPrevented
        && event.detail?.data?.requestBody?.queryInput?.text && transport.pending?.sent) {
        // Duplicate notifications for the same pending query must not count twice.
        if (trackedRequests.has(transport.pending)) return;
        trackedRequests.add(transport.pending);
        analytics.queryAccepted();
      }
    });
    ready = true;showState('idle');controls();
  } catch {showState('unavailable');controls();}
  finally {analytics.loadAfterCore();}
}
initialize();
