// Isolated synthetic transport. Never loads Messenger SDK or contacts CX.
export function createDemo(config) {
  const tools = document.createElement('aside');tools.className = 'demo-tools';
  tools.innerHTML = '<strong>隔離 DEMO · 非正式服務</strong><label for="fixture">模擬回應</label><select id="fixture"><option value="text">純文字回答</option><option value="generic">一般 Playbook＋多來源</option><option value="faq">明確 FAQ metadata（合成）</option><option value="empty">空回應</option><option value="error">服務錯誤</option><option value="unsafe">不可信內容</option></select><button id="expire" type="button">模擬 session expiry</button><p>所有回答為本機 fixtures；不會向 Production 送出查詢。FAQ metadata 為未假定正式端支援的合成契約。</p><pre id="request-log" aria-label="模擬 request 紀錄"></pre>';
  document.querySelector('main').before(tools);
  const requests = [];let parameters = {}, session = 1, lastResponse;
  const emit = (name, detail) => window.dispatchEvent(new CustomEvent(name,{detail,cancelable:true}));
  const messenger = {
    setQueryParameters(value) {parameters = {...value};},
    startNewSession() {session++;},
    async sendQuery(query) {
      const body = {queryInput:{text:{text:query}},queryParams:{...parameters}};
      if (!emit('df-request-sent',{data:{requestBody:body}})) return;
      requests.push({session,query,queryParams:structuredClone(body.queryParams)});
      document.querySelector('#request-log').textContent = JSON.stringify(requests,null,2);
      const fixture = document.querySelector('#fixture').value;
      await new Promise(resolve => setTimeout(resolve,350));
      if (fixture === 'error') {emit('df-messenger-error',{error:'synthetic'});throw new Error('synthetic');}
      let messages = [];
      if (fixture === 'text') messages = [{text:{text:['銀錢收據之印花稅稅率為每件按金額千分之四計算。']}}];
      if (fixture === 'generic') messages = [{text:{text:['租賃住宅的稅務適用條件，需依住宅用途及契約情形判斷。\n請先確認您的申請條件，再參考主管機關說明。\n（此段為一般 Playbook 合成測試資料，非稅務建議。）']}},{payload:{universalAnswer:{schemaVersion:1,sources:[{title:'臺北市稅捐稽徵處',url:'https://tpctax.gov.taipei/'},{title:'財政部稅務入口網',url:'https://www.etax.nat.gov.tw/'}]}}}];
      if (fixture === 'faq') messages = [{text:{text:['這是具有明確 FAQ metadata 的合成回答；用於驗證來源卡，不代表 Production 提供此欄位。']}},{payload:{universalAnswer:{schemaVersion:1,faqMetadata:{kind:'official1999Faq',title:'合成 FAQ：來源卡呈現示範',url:config.officialFaqUrl}}}}];
      if (fixture === 'unsafe') messages = [{text:{text:['<img src=x onerror=alert(1)>\n此內容應顯示為文字。']}},{payload:{universalAnswer:{schemaVersion:1,sources:[{url:'javascript:alert(1)',title:'不可執行'}],faqMetadata:{kind:'official1999Faq',title:'不可採用',url:'https://example.invalid/'}}}}];
      lastResponse = {raw:{queryResult:{responseMessages:messages}}};
      emit('df-response-received',lastResponse);
    },
  };
  document.querySelector('#expire').addEventListener('click', () => emit('df-session-expired',{}));
  window.demoHarness = {requests, get session(){return session;}, get lastResponse(){return lastResponse;}};
  return messenger;
}
