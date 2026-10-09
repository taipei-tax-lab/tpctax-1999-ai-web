import test from 'node:test';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {normalizeResult, safeUrl, textUrls} from '../assets/result-model.js';
import {config} from '../assets/config.js';
import {faqTextMessages} from '../demo/mock-messenger.js';
import {MessengerTransport} from '../assets/messenger-transport.js';
const official = 'https://tpctax.gov.taipei';
const raw = messages => ({raw:{queryResult:{responseMessages:messages}}});
test('answer-only raw response needs no FAQ or sources', () => {
  assert.deepEqual(normalizeResult(raw([{text:{text:['純文字','第二段']}}])),{answer:'純文字\n\n第二段'});
});
test('complete raw Messenger text wins; parsed-only text remains supported without inferred FAQ', () => {
  const result = normalizeResult({data:{messages:[{type:'text',text:`回答 ${official}/News.aspx`}]},...raw([{text:{text:['raw']}}])},[official]);
  assert.equal(result.answer,'raw');
  assert.equal(normalizeResult({data:{messages:[{type:'text',text:`回答 ${official}/News.aspx`}]}}).answer,`回答 ${official}/News.aspx`);assert.equal(result.sources,undefined);assert.equal(result.faqMetadata,undefined);
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
  const transport=new MessengerTransport(sdk,{faqCurrentPage:config.faqCurrentPage,requestTimeoutMs:timeout},root);
  const answer=()=>{emit('df-response-received',raw([{text:{text:['answer']}}]));settle();};
  return {root,sdk,transport,requests,emit,answer,settle:()=>settle(),fail:()=>fail(Error('service')),get session(){return session;},get defaults(){return params;}};
}
const tick=()=>new Promise(resolve=>setTimeout(resolve,0));
test('first/second/third independent queries use exact FAQ currentPage; SDK defaults never disarm', async()=>{
  const h=harness();
  const expected={timeZone:'Asia/Taipei',currentPage:config.faqCurrentPage};
  assert.deepEqual(h.defaults,expected);
  for (const query of ['first','second','third']) {
    const promise=h.transport.send(query);
    assert.deepEqual(h.requests.at(-1).queryParams,expected);
    assert.deepEqual(h.defaults,expected);
    h.answer();await promise;await tick();
  }
  assert.equal(h.session,0);
  h.emit('df-session-expired',{});
  const promise=h.transport.send('after technical recovery');
  assert.deepEqual(h.requests.at(-1).queryParams,expected);
  h.answer();await promise;await tick();assert.equal(h.session,1);h.transport.dispose();
});
test('timeout locks until SDK settles, late response ignored; no retry', async()=>{
  const h=harness(10);const promise=h.transport.send('slow');await assert.rejects(promise,/timeout/);assert.equal(h.transport.locked,true);
  await assert.rejects(h.transport.send('next'),/busy/);h.answer();await tick();assert.equal(h.transport.locked,false);assert.equal(h.requests.length,1);h.transport.dispose();
});
test('unsolicited requests blocked; expiry in-flight rejects then internally recovers', async()=>{
  const h=harness();assert.equal(h.emit('df-request-sent',{data:{requestBody:{queryInput:{text:{text:'unsolicited'}}}}}),false);
  const promise=h.transport.send('query');h.emit('df-session-ended',{});await assert.rejects(promise,/session/);h.settle();await tick();assert.deepEqual(h.defaults,{timeZone:'Asia/Taipei',currentPage:config.faqCurrentPage});assert.equal(h.session,1);h.transport.dispose();
});
test('SDK service error is surfaced once and no auto-retry', async()=>{
  const h=harness();const promise=h.transport.send('query');h.emit('df-messenger-error',{});h.fail();await assert.rejects(promise,/service/);await tick();assert.equal(h.requests.length,1);h.transport.dispose();
});
test('fixed config uses production START_PAGE with unchanged binding and GA4',()=>{
  assert.equal(config.faqCurrentPage,'projects/serviceagent-1150909/locations/asia-northeast1/agents/799426c1-ba69-49dc-85e4-5065985706e2/flows/676409b6-b02f-4a24-9d3a-81e14cb77d4f/pages/START_PAGE');
  assert.equal('initialPlaybook' in config,false);
  assert.deepEqual([config.projectId,config.agentId,config.location,config.expectedEnvironment,config.languageCode,config.ga4MeasurementId],
    ['serviceagent-1150909','799426c1-ba69-49dc-85e4-5065985706e2','asia-northeast1','a0c712e8-ab0c-4520-b100-d2abcfc85868','zh-tw','G-S891SFSMBH']);
});
test('request interceptor replaces stale page/playbook while preserving other parameters',async()=>{
  const h=harness();const promise=h.transport.send('query');
  const body={queryInput:{text:{text:'query'}},queryParams:{currentPage:'stale',currentPlaybook:'old',timeZone:'bad',parameters:{fixture:true}}};
  h.emit('df-request-sent',{data:{requestBody:body}});
  assert.deepEqual(body.queryParams,{currentPage:config.faqCurrentPage,timeZone:'Asia/Taipei',parameters:{fixture:true}});
  h.answer();await promise;await tick();h.transport.dispose();
});
for(let count=0;count<=5;count++) test(`${count} FAQ text results preserve every message/array item in order; cards are optional`,()=>{
  const messages=faqTextMessages(count,config);
  const expected=messages.flatMap(m=>m.text?.text||[]).join('\n\n');
  const result=normalizeResult({...raw(messages),data:{messages:[{type:'text',text:'only one parsed fragment'}]}},[official]);
  assert.equal(result.answer,expected);
  assert.equal(result.faqMetadata,undefined);
  assert.equal(textUrls(result.answer).length,count+1);
  assert.ok(result.answer.includes('出租房屋租稅優惠專責諮詢'));
  if(count)assert.ok(result.answer.includes(`${count}. 合成 FAQ 問題 ${count}`));
  else assert.ok(result.answer.startsWith('找不到可用的 FAQ 搜尋結果'));
});

for (const count of [1,2,5]) test(`${count} FAQ info cards become complete items before text fallback`,()=>{
  const result=normalizeResult(raw(faqTextMessages(count,config)),[official]);
  assert.equal(result.itemSource,'richContent');assert.equal(result.items.length,count);
  for(let i=0;i<count;i++)assert.deepEqual(result.items[i],{title:`合成 FAQ 問題 ${i+1}`,answer:`完整合成答案 ${i+1}（非稅務建議）。\n1. 原有編號與換行\n2. 第二個條件`,url:config.officialFaqUrl});
  assert.ok(result.leadingText.startsWith('以下是本府'));
  assert.ok(result.trailingText.includes('出租房屋租稅優惠專責諮詢'));
});
test('frozen Production text/info payload fields are exact for every returned FAQ',()=>{
  const fixture=JSON.parse(readFileSync(new URL('./fixtures/faq-production-messages.json',import.meta.url)));
  const cards=fixture.responseMessages.flatMap(m=>m.payload?.richContent?.flat()||[]);
  const result=normalizeResult(raw(fixture.responseMessages),[official]);
  assert.equal(result.itemSource,'richContent');assert.equal(result.items.length,5);
  assert.deepEqual(result.items,cards.map(c=>({title:c.title,answer:c.subtitle,url:c.actionLink})));
});
test('SDK parsed customCard.richElements works when raw is unavailable; card-only remains usable',()=>{
  const messages=faqTextMessages(2,config);
  const parsed=messages.flatMap(m=>m.text ? m.text.text.map(text=>({type:'text',text})) : [{type:'customCard',richElements:m.payload.richContent.flat()}]);
  const result=normalizeResult({data:{messages:parsed}},[official]);
  assert.equal(result.itemSource,'richContent');assert.equal(result.items.length,2);
  const card=parsed.find(m=>m.type==='customCard');
  const only=normalizeResult({data:{messages:[card]}},[official]);
  assert.equal(only.answer,'');assert.equal(only.items.length,1);
});
test('text-only per-message fallback preserves internal newlines and numbering without guessing splits',()=>{
  const messages=faqTextMessages(5,config).filter(m=>m.text);
  const result=normalizeResult(raw(messages),[official]);
  assert.equal(result.itemSource,'text');assert.equal(result.items.length,5);
  assert.ok(result.items.every(item=>item.answer.includes('\n1. 原有編號與換行\n2. 第二個條件')));
  const combined=messages.flatMap(m=>m.text.text).join('\n\n');
  const unknown=normalizeResult(raw([{text:{text:[combined]}}]),[official]);
  assert.equal(unknown.items,undefined);assert.equal(unknown.answer,combined);
});
test('partial/truncated cards cannot hide complete text; fallback uses all original blocks',()=>{
  const messages=faqTextMessages(2,config);
  messages[2].payload.richContent[0][0].subtitle='truncated';
  const result=normalizeResult(raw(messages),[official]);
  assert.equal(result.itemSource,'text');assert.equal(result.items.length,2);
  assert.ok(result.items[0].answer.includes('2. 第二個條件'));
});
test('unsafe/unapproved/incomplete metadata is not accepted as an official FAQ item',()=>{
  for(const url of ['javascript:alert(1)','data:text/html,x','https://user:pass@tpctax.gov.taipei/','https://example.com/']) {
    const card={type:'info',title:'title',subtitle:'complete answer',actionLink:url};
    assert.equal(normalizeResult(raw([{payload:{richContent:[[card]]}}]),[official]).items,undefined);
  }
  for(const card of [null,{}, {type:'info',title:'title',actionLink:official}, {type:'info',title:'title',subtitle:42,actionLink:official}])
    assert.equal(normalizeResult(raw([{payload:{richContent:[[card]]}}]),[official]).items,undefined);
});
test('unknown text envelope, missing block and zero fallback keep faithful text-first behavior',()=>{
  for(const mutate of [m=>{m[0].text.text[0]='unknown header';},m=>{m[1].text.text[0]='1. missing URL\ncomplete answer';}]) {
    const messages=faqTextMessages(2,config);mutate(messages);
    const result=normalizeResult(raw(messages),[official]);
    assert.equal(result.items,undefined);assert.equal(result.answer,messages.flatMap(m=>m.text?.text||[]).join('\n\n'));
  }
  assert.equal(normalizeResult(raw(faqTextMessages(0,config)),[official]).items,undefined);
  const messages=faqTextMessages(1,config).filter(m=>m.payload);
  messages.push({payload:{universalAnswer:{schemaVersion:1,answer:'完整 extension 文字不能被無關 card 蓋掉'}}});
  const extension=normalizeResult(raw(messages),[official]);
  assert.equal(extension.items,undefined);assert.equal(extension.answer,'完整 extension 文字不能被無關 card 蓋掉');
});
