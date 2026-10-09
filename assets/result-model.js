/** Complete text fallback with optional, validated FAQ presentation items. */
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

const FAQ_INTRO = '以下是本府 1999 常見問答中與您的問題較相關的內容：';
const FAQ_OUTRO = '若以上內容不是您要找的資訊，可以換個方式描述您的問題。';
const RENTAL_URL = 'https://tpctax.gov.taipei/cp.aspx?n=3A978B4E3ADD88F2';
const RENTAL_NOTE = `出租房屋租稅優惠專責諮詢，請前往出租專區：${RENTAL_URL}`;

function officialItem(title, answer, url, origins) {
  url = safeUrl(url);
  if (typeof title !== 'string' || !title.trim() || typeof answer !== 'string' || !answer.trim()
    || !url || !origins.includes(new URL(url).origin)) return null;
  return {title, answer, url};
}

function faqLayout(segments) {
  const text = segments.filter(x => x.trim());
  // Recognize only the frozen backend envelope and individual message boundaries.
  if (text[0]?.trim() !== FAQ_INTRO || text.at(-2)?.trim() !== FAQ_OUTRO
    || text.at(-1)?.trim() !== RENTAL_NOTE || text.length < 4 || text.length > 8) return null;
  return {blocks: text.slice(1, -2), leadingText: text[0], trailingText: text.slice(-2).join('\n\n')};
}

function presentationItems(segments, rawMessages, parsed, origins) {
  const rawCards = rawMessages.flatMap(m => Array.isArray(m?.payload?.richContent)
    ? m.payload.richContent.flatMap(group => Array.isArray(group) ? group : []) : []);
  const parsedCards = parsed.flatMap(m => m?.type === 'customCard' && Array.isArray(m.richElements) ? m.richElements : []);
  const cards = (rawCards.length ? rawCards : parsedCards).filter(c => c?.type === 'info');
  const layout = faqLayout(segments);
  if (cards.length && cards.length <= 5) {
    const items = cards.map(c => officialItem(c.title, c.subtitle, c.actionLink, origins));
    if (items.every(Boolean)) {
      if (!segments.some(x => x.trim())) return {items, itemSource: 'richContent'};
      // Exact full-field matching prevents truncated/partial cards from hiding text.
      if (layout && layout.blocks.length === items.length && layout.blocks.every((block, i) =>
        block === `${i + 1}. ${cards[i].title}\n${cards[i].subtitle}\n${cards[i].actionLink}`)) {
        return {items, itemSource: 'richContent', leadingText: layout.leadingText, trailingText: layout.trailingText};
      }
    }
  }
  if (!layout) return {};
  // Conservative text-only fallback: never split a combined answer at numbered lines.
  const items = layout.blocks.map((block, i) => {
    const lines = block.split('\n'), prefix = `${i + 1}. `;
    if (lines.length < 3 || !lines[0].startsWith(prefix)) return null;
    return officialItem(lines[0].slice(prefix.length), lines.slice(1, -1).join('\n'), lines.at(-1), origins);
  });
  return items.every(Boolean) ? {items, itemSource: 'text', leadingText: layout.leadingText, trailingText: layout.trailingText} : {};
}

export function normalizeResult(detail = {}, officialOrigins = []) {
  const raw = detail.raw || (detail.queryResult ? detail : {});
  const rawMessages = Array.isArray(raw?.queryResult?.responseMessages) ? raw.queryResult.responseMessages : [];
  const parsed = Array.isArray(detail.data?.messages) ? detail.data.messages : [];
  const text = parsed.filter(m => m?.type === 'text' && typeof m.text === 'string').map(m => m.text);
  const rawText = rawMessages.flatMap(m => Array.isArray(m?.text?.text) ? m.text.text.filter(x => typeof x === 'string') : []);
  // The backend's complete text messages are authoritative; parsed text is a fallback.
  const segments = rawText.some(x => x.trim()) ? rawText : text;
  let answer = segments.join('\n\n');
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
  // Extension text also must not be hidden by an unrelated card-only payload.
  const presentationText = !segments.some(x => x.trim()) && answer.trim() ? [answer] : segments;
  return {answer, ...presentationItems(presentationText, rawMessages, parsed, officialOrigins),
    ...(additional.length ? {sources: additional} : {}), ...(faqMetadata ? {faqMetadata} : {})};
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

function appendText(container, text) {
  if (!text.endsWith(RENTAL_NOTE)) return appendAnswer(container, text);
  const inline = appendAnswer(container, text.slice(0, -RENTAL_NOTE.length));
  container.append(document.createTextNode('出租房屋租稅優惠專責諮詢，請前往'));
  const link = document.createElement('a');link.href = RENTAL_URL;link.textContent = '出租專區';
  container.append(link);inline.add(RENTAL_URL);return inline;
}

export function renderResult(result, root) {
  const answer = root.querySelector('[data-answer]');answer.replaceChildren();
  const hasItems = Array.isArray(result.items) && result.items.length > 0;
  answer.classList.toggle('has-faq-items', hasItems);
  const inline = new Set();
  const textBlock = (className, text) => {
    if (!text) return;
    const block = document.createElement('div');block.className = className;
    for (const url of appendText(block, text)) inline.add(url);
    answer.append(block);
  };
  if (hasItems) {
    textBlock('faq-intro', result.leadingText);
    const list = document.createElement('ol');list.className = 'faq-results';
    for (const item of result.items) {
      const block = document.createElement('li');block.className = 'faq-result';
      const heading = document.createElement('h3'), url = safeUrl(item.url);
      const title = document.createElement(url ? 'a' : 'span');title.textContent = item.title;
      if (url) {title.href = url;inline.add(url);}
      heading.append(title);block.append(heading);
      const body = document.createElement('div');body.className = 'faq-result-answer';
      for (const link of appendAnswer(body, item.answer)) inline.add(link);
      block.append(body);list.append(block);
    }
    answer.append(list);textBlock('faq-footer', result.trailingText);
  } else for (const url of appendText(answer, result.answer)) inline.add(url);
  const sources = root.querySelector('[data-sources]');sources.replaceChildren();
  const faq = root.querySelector('[data-faq]');faq.replaceChildren();faq.hidden = hasItems || !result.faqMetadata;
  if (!hasItems && result.faqMetadata) {
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
