/** Text-first normalization. No Playbook/URL/title heuristic identifies a FAQ. */
export function safeUrl(value) {
  if (typeof value !== 'string' || !/^https?:\/\//i.test(value)) return null;
  try {
    const u = new URL(value);
    return ['http:', 'https:'].includes(u.protocol) && !u.username && !u.password ? u.href : null;
  } catch { return null; }
}

export function textUrls(text) {
  return (text.match(/https?:\/\/[^\s<>"']+/g) || [])
    .map(x => x.replace(/[.,;!?，。；！？、）)]*$/, '')).filter(x => safeUrl(x));
}

export function normalizeResult(detail = {}, officialOrigins = []) {
  const raw = detail.raw || (detail.queryResult ? detail : {});
  const rawMessages = Array.isArray(raw?.queryResult?.responseMessages) ? raw.queryResult.responseMessages : [];
  const parsed = Array.isArray(detail.data?.messages) ? detail.data.messages : [];
  const text = parsed.filter(m => m?.type === 'text' && typeof m.text === 'string').map(m => m.text);
  const rawText = rawMessages.flatMap(m => Array.isArray(m?.text?.text) ? m.text.text.filter(x => typeof x === 'string') : []);
  // Prefer Messenger's parsed primary answer; use raw ResponseMessage text when absent.
  let answer = (text.some(x => x.trim()) ? text : rawText).join('\n\n');
  const sources = [];
  const addSource = (url, title) => {
    url = safeUrl(url);
    if (!url || sources.some(x => x.url === url)) return;
    sources.push({url, ...(typeof title === 'string' && title.trim() ? {title} : {})});
  };
  // Only explicit source/citation messages; navigation buttons aren't citations.
  for (const m of parsed) {
    if (m?.type === 'citation') addSource(m.anchor?.href || m.actionLink || m.url, m.title);
    for (const s of Array.isArray(m?.citations) ? m.citations : []) addSource(s?.url || s?.actionLink, s?.title);
  }
  let faqMetadata;
  for (const m of rawMessages) {
    const extension = m?.payload?.universalAnswer;
    // Optional versioned payload contract. Its availability in Production is NOT assumed.
    if (extension?.schemaVersion !== 1) continue;
    if (!answer.trim() && typeof extension.answer === 'string') answer = extension.answer;
    for (const source of Array.isArray(extension.sources) ? extension.sources : []) addSource(source?.url, source?.title);
    const faq = extension.faqMetadata;
    const url = safeUrl(faq?.url);
    if (!faqMetadata && faq?.kind === 'official1999Faq' && typeof faq.title === 'string' && faq.title.trim()
      && url && officialOrigins.includes(new URL(url).origin)) {
      faqMetadata = {kind: faq.kind, title: faq.title, url};
      addSource(url, faq.title);
    }
  }
  for (const url of textUrls(answer)) addSource(url);
  // Missing required answer is an empty-result state, never a synthesized answer.
  return {answer, ...(sources.length ? {sources} : {}), ...(faqMetadata ? {faqMetadata} : {})};
}

export function appendAnswer(container, answer) {
  // DOM text nodes preserve wording and never interpret response HTML/Markdown as code.
  let offset = 0;
  for (const match of answer.matchAll(/https?:\/\/[^\s<>"']+/g)) {
    const original = match[0];
    const url = textUrls(original)[0];
    if (!url) continue;
    const urlText = original.replace(/[.,;!?，。；！？、）)]*$/, '');
    container.append(document.createTextNode(answer.slice(offset, match.index)));
    const link = document.createElement('a');link.href = safeUrl(url);link.textContent = urlText;
    container.append(link);offset = match.index + urlText.length;
  }
  container.append(document.createTextNode(answer.slice(offset)));
}

export function renderResult(result, root) {
  const answer = root.querySelector('[data-answer]');answer.replaceChildren();appendAnswer(answer, result.answer);
  const sources = root.querySelector('[data-sources]');sources.replaceChildren();
  const faq = root.querySelector('[data-faq]');faq.replaceChildren();faq.hidden = !result.faqMetadata;
  if (result.faqMetadata) {
    const heading = document.createElement('h3');heading.textContent = '官方1999常見問答';
    const title = document.createElement('p');title.textContent = result.faqMetadata.title;
    const link = document.createElement('a');link.href = result.faqMetadata.url;link.textContent = '查看官方完整內容 →';
    faq.append(heading, title, link);
  }
  const ordinary = (result.sources || []).filter(s => s.url !== result.faqMetadata?.url);
  root.querySelector('[data-source-section]').hidden = !ordinary.length;
  for (const s of ordinary) {
    const item = document.createElement('li');const link = document.createElement('a');link.href = s.url;
    link.textContent = s.title || new URL(s.url).hostname;item.append(link);sources.append(item);
  }
}
