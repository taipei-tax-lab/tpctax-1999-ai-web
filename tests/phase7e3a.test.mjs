import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeResult, safeUrl, textUrls} from '../assets/result-model.js';
import {MessengerTransport} from '../assets/messenger-transport.js';
const official = 'https://tpctax.gov.taipei';
const raw = messages => ({raw:{queryResult:{responseMessages:messages}}});
test('answer-only raw response needs no FAQ or sources', () => {
  assert.deepEqual(normalizeResult(raw([{text:{text:['純文字','第二段']}}])),{answer:'純文字\n\n第二段'});
});
test('parsed Messenger text wins and does not infer FAQ from official URL', () => {
  const result = normalizeResult({data:{messages:[{type:'text',text:`回答 ${official}/News.aspx`}]},...raw([{text:{text:['raw']}}])},[official]);
  assert.equal(result.answer,`回答 ${official}/News.aspx`);assert.equal(result.sources,undefined);assert.equal(result.faqMetadata,undefined);
});
test('versioned explicit metadata alone enables FAQ; wrong origin/kind rejected', () => {
  const payload = {universalAnswer:{schemaVersion:1,answer:'回答',faqMetadata:{kind:'official1999Faq',title:'來源標題',url:official+'/News.aspx'}}};
  assert.equal(normalizeResult(raw([{payload}]),[official]).faqMetadata.title,'來源標題');
  payload.universalAnswer.faqMetadata.url = 'https://example.invalid/';assert.equal(normalizeResult(raw([{payload}]),[official]).faqMetadata,undefined);
  payload.universalAnswer.faqMetadata.url = official;payload.universalAnswer.faqMetadata.kind='guess';assert.equal(normalizeResult(raw([{payload}]),[official]).faqMetadata,undefined);
});
test('unsafe URLs rejected, citations deduplicated, multiple sources retained', () => {
  for(const url of ['javascript:alert(1)','data:text/html,x','//example.com','https://user:pass@example.com']) assert.equal(safeUrl(url),null);
  const result=normalizeResult({data:{messages:[{type:'text',text:'回答'},{type:'citation',url:official,title:'來源'},{citations:[null,{url:official},{url:'https://www.etax.nat.gov.tw/'}]}]}});
  assert.equal(result.sources.length,2);
});
test('empty/malformed responses never invent answer', () => {
  for (const detail of [{}, {raw:null}, raw([]), {raw:{queryResult:{responseMessages:'bad'}}}]) assert.deepEqual(normalizeResult(detail),{answer:''});
});
test('inline Markdown and bare links suppress only duplicate structured sources', () => {
  const answer = `**一、適用條件：**\n原文\n來源：[官方標題](${official}/News.aspx)\n另見 https://www.etax.nat.gov.tw/`;
  const result = normalizeResult({data:{messages:[{type:'text',text:answer},
    {type:'citation',url:official+'/News.aspx',title:'同一來源'},
    {citations:[{url:'https://www.etax.nat.gov.tw/'},{url:official+'/extra',title:'額外資料'}]}]}});
  assert.equal(result.answer, answer);
  assert.deepEqual(result.sources,[{url:official+'/extra',title:'額外資料'}]);
});
test('inline URL canonicalization deduplicates versioned sources without losing FAQ metadata', () => {
  const url = official+'/News.aspx';
  const result = normalizeResult(raw([{text:{text:['[標題](https://TPCTAX.gov.taipei:443/News.aspx)']}},
    {payload:{universalAnswer:{schemaVersion:1,sources:[{url},{url:official+'/other'}],
      faqMetadata:{kind:'official1999Faq',title:'明確標題',url}}}}]),[official]);
  assert.deepEqual(result.sources,[{url:official+'/other'}]);
  assert.equal(result.faqMetadata.url,url);
});
test('unsafe or incomplete Markdown destinations stay inert and are not source candidates', () => {
  for (const destination of ['javascript:alert(1)','data:text/html,x','https://user:pass@example.com/','https://','https://[bad']) {
    assert.deepEqual(textUrls(`[label](${destination})`),[]);
  }
  assert.deepEqual(textUrls('[label](https://example.com/unclosed'),[]);
  assert.deepEqual(textUrls('![image](https://example.com/image.png)'),[]);
});
test('safe labeled and bare links preserve balanced URL parentheses and sentence punctuation', () => {
  assert.deepEqual(textUrls('**[標題](https://example.com/a_(b))**\nHTTPS://example.com/c_(d)。'),
    ['https://example.com/a_(b)','https://example.com/c_(d)']);
});
function harness(timeout=100) {
  const root=new EventTarget();const requests=[];let params={}, session=0, settle, fail;
  const emit=(n,d)=>root.dispatchEvent(new CustomEvent(n,{detail:d,cancelable:true}));
  const sdk={setQueryParameters(p){params={...p};},startNewSession(){session++;},clearStorage(){},sendQuery(text){
    const body={queryInput:{text:{text}},queryParams:{...params}};emit('df-request-sent',{data:{requestBody:body}});requests.push(body);
    return new Promise((resolve,reject)=>{settle=resolve;fail=reject;});
  }};
  const transport=new MessengerTransport(sdk,{initialPlaybook:'faq-playbook',requestTimeoutMs:timeout},root);
  const answer=()=>{emit('df-response-received',raw([{text:{text:['answer']}}]));settle();};
  return {root,sdk,transport,requests,emit,answer,settle:()=>settle(),fail:()=>fail(Error('service')),get session(){return session;}};
}
const tick=()=>new Promise(resolve=>setTimeout(resolve,0));
test('first request override, same-session followup no override; reset/expiry rearm', async()=>{
  const h=harness();let promise=h.transport.send('first');assert.equal(h.requests[0].queryParams.currentPlaybook,'faq-playbook');h.answer();await promise;await tick();
  promise=h.transport.send('second');assert.equal(h.requests[1].queryParams.currentPlaybook,undefined);h.answer();await promise;await tick();assert.equal(h.session,0);
  h.transport.reset();promise=h.transport.send('reset');assert.equal(h.requests[2].queryParams.currentPlaybook,'faq-playbook');h.answer();await promise;await tick();
  h.emit('df-session-expired',{});promise=h.transport.send('expired');assert.equal(h.requests[3].queryParams.currentPlaybook,'faq-playbook');h.answer();await promise;await tick();assert.equal(h.session,2);h.transport.dispose();
});
test('timeout locks until SDK settles, late response ignored; no retry', async()=>{
  const h=harness(10);const promise=h.transport.send('slow');await assert.rejects(promise,/timeout/);assert.equal(h.transport.locked,true);
  await assert.rejects(h.transport.send('next'),/busy/);h.answer();await tick();assert.equal(h.transport.locked,false);assert.equal(h.requests.length,1);h.transport.dispose();
});
test('unsolicited requests blocked; expiry in-flight rejects then re-arms', async()=>{
  const h=harness();assert.equal(h.emit('df-request-sent',{data:{requestBody:{queryInput:{text:{text:'unsolicited'}}}}}),false);
  const promise=h.transport.send('query');h.emit('df-session-ended',{});await assert.rejects(promise,/session/);h.settle();await tick();assert.equal(h.transport.armed,true);assert.equal(h.session,1);h.transport.dispose();
});
test('SDK service error is surfaced once and no auto-retry', async()=>{
  const h=harness();const promise=h.transport.send('query');h.emit('df-messenger-error',{});h.fail();await assert.rejects(promise,/service/);await tick();assert.equal(h.requests.length,1);h.transport.dispose();
});
test('explicit clear creates fresh session and re-arms override', async()=>{
  const h=harness();h.transport.clear();const promise=h.transport.send('cleared');assert.equal(h.requests[0].queryParams.currentPlaybook,'faq-playbook');h.answer();await promise;await tick();assert.equal(h.session,1);h.transport.dispose();
});
