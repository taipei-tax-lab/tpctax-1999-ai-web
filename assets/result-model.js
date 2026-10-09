/** Text-first normalization. No Playbook/URL/title heuristic identifies a FAQ. */
export function safeUrl(value) {
  if (typeof value !== 'string' || !/^https?:\/\//i.test(value)) return null;
  try {
    const u = new URL(value);
    return ['http:', 'https:'].includes(u.protocol) && !u.username && !u.password ? u.href : null;
  } catch { return null; }
}

function markdownLink(text, start) {
  const labelEnd = text.indexOf('](', start + 1);
  if (labelEnd < 0 || /[\n\r\[\]]/.test(text.slice(start + 1, labelEnd))) return null;
  let depth = 1, end = labelEnd + 2;
  for (; end < text.length && !/[\n\r]/.test(text[end]); end++) {
    if (text[end] === '(') depth++;
    if (text[end] === ')' && --depth === 0) break;
  }
  const closed = depth === 0;
  return {label: text.slice(start + 1, labelEnd),
    url: closed ? safeUrl(text.slice(labelEnd + 2, end)) : null,
    end: closed ? end + 1 : end};
}

function bareUrl(text) {
  let value = text.match(/^https?:\/\/[^\s<>"']+/i)?.[0];
  if (!value) return null;
  value = value.replace(/[.,;!?，。；！？、）]+$/, '');
  // Keep balanced URL parentheses; only sentence-closing parentheses are removed.
  while (value.endsWith(')') && (value.match(/\)/g)?.length || 0) > (value.match(/\(/g)?.length || 0)) {
    value = value.slice(0, -1);
  }
  const url = safeUrl(value);
  return url ? {text: value, url} : null;
}

/** Only strong, labeled HTTP(S) links and bare URLs. No response HTML parser. */
export function answerParts(text, {bold = true, links = true, bare = true} = {}) {
  const parts = [];
  const literal = value => {
    if (parts.at(-1)?.type === 'text') parts.at(-1).text += value;
    else parts.push({type: 'text', text: value});
  };
  for (let i = 0; i < text.length;) {
    const image = text.startsWith('![', i);
    const link = links && (image || text[i] === '[') ? markdownLink(text, i + (image ? 1 : 0)) : null;
    if (link) {
      if (link.url && link.label && !image) {
        parts.push({type: 'link', url: link.url,
          children: answerParts(link.label, {links: false, bare: false})});
      } else literal(text.slice(i, link.end));
      i = link.end;continue;
    }
    if (bold && text.startsWith('**', i)) {
      const end = text.indexOf('**', i + 2);
      if (end > i + 2) {
        parts.push({type: 'strong', children: answerParts(text.slice(i + 2, end), {bold: false, links, bare})});
        i = end + 2;continue;
      }
    }
    const url = bare ? bareUrl(text.slice(i)) : null;
    if (url) {
      parts.push({type: 'link', url: url.url, children: [{type: 'text', text: url.text}]});
      i += url.text.length;continue;
    }
    literal(text[i]);i++;
  }
  return parts;
}

export function textUrls(text) {
  const urls = [];
  const collect = parts => {
    for (const part of parts) {
      if (part.type === 'link') urls.push(part.url);
      else if (part.children) collect(part.children);
    }
  };
  collect(answerParts(text));return urls;
}

export function normalizeResult(detail = {}, officialOrigins = []) {
  const raw = detail.raw || (detail.queryResult ? detail : {});
  const rawMessages = Array.isArray(raw?.queryResult?.responseMessages) ? raw.queryResult.responseMessages : [];
  const parsed = Array.isArray(detail.data?.messages) ? detail.data.messages : [];
  const text = parsed.filter(m => m?.type === 'text' && typeof m.text === 'string').map(m => m.text);
  const rawText = rawMessages.flatMap(m => Array.isArray(m?.text?.text) ? m.text.text.filter(x => typeof x === 'string') : []);
  // The backend's complete text messages are authoritative; parsed text is a fallback.
  let answer = (rawText.some(x => x.trim()) ? rawText : text).join('\n\n');
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
  // Inline links already provide navigation; keep only genuinely additional citations.
  const inline = new Set(textUrls(answer));
  const additional = sources.filter(source => !inline.has(source.url));
  // Missing required answer is an empty-result state, never a synthesized answer.
  return {answer, ...(additional.length ? {sources: additional} : {}), ...(faqMetadata ? {faqMetadata} : {})};
}

export function appendAnswer(container, answer) {
  const inline = new Set();
  const append = (target, parts) => {
    for (const part of parts) {
      if (part.type === 'text') {target.append(document.createTextNode(part.text));continue;}
      const node = document.createElement(part.type === 'strong' ? 'strong' : 'a');
      if (part.type === 'link') {node.href = part.url;inline.add(part.url);}
      append(node, part.children);target.append(node);
    }
  };
  append(container, answerParts(answer));return inline;
}

export function renderResult(result, root) {
  const answer = root.querySelector('[data-answer]');answer.replaceChildren();const inline = appendAnswer(answer, result.answer);
  const sources = root.querySelector('[data-sources]');sources.replaceChildren();
  const faq = root.querySelector('[data-faq]');faq.replaceChildren();faq.hidden = !result.faqMetadata;
  if (result.faqMetadata) {
    const heading = document.createElement('h3');heading.textContent = '官方1999常見問答';
    const title = document.createElement('p');title.textContent = result.faqMetadata.title;
    const link = document.createElement('a');link.href = result.faqMetadata.url;link.textContent = '查看官方完整內容 →';
    faq.append(heading, title, link);
  }
  const ordinary = (result.sources || []).filter(s => safeUrl(s.url) && !inline.has(safeUrl(s.url)) && s.url !== result.faqMetadata?.url);
  root.querySelector('[data-source-section]').hidden = !ordinary.length;
  for (const s of ordinary) {
    const item = document.createElement('li');const link = document.createElement('a');link.href = s.url;
    link.textContent = s.title || new URL(s.url).hostname;item.append(link);sources.append(item);
  }
}
