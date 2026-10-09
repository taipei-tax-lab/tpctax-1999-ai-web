// Synthetic formatting fixtures only; these are not official FAQ answers.
export function faqTextMessages(count, config) {
  const rental = '出租房屋租稅優惠專責諮詢，請前往出租專區：https://tpctax.gov.taipei/cp.aspx?n=3A978B4E3ADD88F2';
  if (!count) return [{text:{text:['找不到可用的 FAQ 搜尋結果，請換個方式描述問題。', rental]}}];
  const messages = [{text:{text:['以下是本府 1999 常見問答中與您的問題較相關的內容：']}}];
  for (let i = 1; i <= count; i++) {
    messages.push({text:{text:[`${i}. 合成 FAQ 問題 ${i}`, `完整合成答案 ${i}（非稅務建議）。\n1. 原有編號與換行\n2. 第二個條件`, config.officialFaqUrl]}});
    messages.push({payload:{richContent:[[{type:'info',title:'合成 optional card'}]]}});
  }
  messages.push({text:{text:['若以上內容不是您要找的資訊，可以換個方式描述您的問題。', rental]}});
  return messages;
}

// Isolated synthetic transport. Never loads Messenger SDK or contacts CX.
export function createDemo(config) {
  const tools = document.createElement('aside');tools.className = 'demo-tools';
  tools.innerHTML = '<strong>隔離 DEMO · 非正式服務</strong><label for="fixture">模擬回應</label><select id="fixture"><option value="text">純文字回答</option><option value="generic">一般文字＋多來源</option><option value="faq">明確 FAQ metadata（合成）</option><option value="faq1">1 筆完整 FAQ（合成）</option><option value="faq2">2 筆完整 FAQ（合成）</option><option value="faq3">3 筆完整 FAQ（合成）</option><option value="faq4">4 筆完整 FAQ（合成）</option><option value="faq5">5 筆完整 FAQ（合成）</option><option value="fallback">零結果 fallback（合成）</option><option value="empty">空回應</option><option value="error">服務錯誤</option><option value="unsafe">不可信內容</option></select><button id="expire" type="button">模擬 session expiry</button><p>所有回答為本機 fixtures；不會向 Production 送出查詢。FAQ metadata 為未假定正式端支援的合成契約。</p><pre id="request-log" aria-label="模擬 request 紀錄"></pre>';
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
      if (fixture === 'generic') messages = [{text:{text:['租賃住宅的稅務適用條件，需依住宅用途及契約情形判斷。\n請先確認您的申請條件，再參考主管機關說明。\n（此段為一般文字合成測試資料，非稅務建議。）']}},{payload:{universalAnswer:{schemaVersion:1,sources:[{title:'臺北市稅捐稽徵處',url:'https://tpctax.gov.taipei/'},{title:'財政部稅務入口網',url:'https://www.etax.nat.gov.tw/'}]}}}];
      if (fixture === 'faq') messages = [{text:{text:['這是具有明確 FAQ metadata 的合成回答；用於驗證來源卡，不代表 Production 提供此欄位。']}},{payload:{universalAnswer:{schemaVersion:1,faqMetadata:{kind:'official1999Faq',title:'合成 FAQ：來源卡呈現示範',url:config.officialFaqUrl}}}}];
      if (fixture === 'unsafe') messages = [{text:{text:['<img src=x onerror=alert(1)>\n此內容應顯示為文字。']}},{payload:{universalAnswer:{schemaVersion:1,sources:[{url:'javascript:alert(1)',title:'不可執行'}],faqMetadata:{kind:'official1999Faq',title:'不可採用',url:'https://example.invalid/'}}}}];
      if (/^faq[1-5]$/.test(fixture)) messages = faqTextMessages(Number(fixture.slice(3)), config);
      if (fixture === 'fallback') messages = faqTextMessages(0, config);
      lastResponse = {raw:{queryResult:{responseMessages:messages}}};
      emit('df-response-received',lastResponse);
    },
  };
  document.querySelector('#expire').addEventListener('click', () => emit('df-session-expired',{}));
  window.demoHarness = {requests, get session(){return session;}, get lastResponse(){return lastResponse;}};
  return messenger;
}
