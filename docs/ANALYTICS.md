# Minimal per-query GA4 measurement

## Current contract — 2026-10-08

The owner-authorized GA4 Web Data Stream ID remains `G-S891SFSMBH` in
`assets/config.js`. Missing/invalid-looking IDs disable analytics; demo always
keeps analytics disabled. This uses official direct gtag, without GTM, inline
executable scripts, extra dependencies or changes to the GA4 property settings.

The only custom business event emitted by this frontend is now:

```js
gtag('event', 'ai_query_submit');
```

It has **no custom parameters**. The name replaces `ai_question_start`; the two
names are never emitted together. Historical GA reports retain the earlier name
and once-per-tab meaning; use the new event for current per-query reporting.

Every valid user query actually accepted for Messenger sending counts once:
first query +1, same-session follow-up +1, post-reset query +1. Reset itself,
example click alone, page opening, invalid/empty input, unsolicited/cancelled SDK
requests and a send exception before acceptance count zero. Acceptance does not
assert a successful answer or GA delivery. No question replay/retry is added.

`assets/app.js` uses the existing transport's non-cancelled `df-request-sent`
pending text-query boundary. A WeakSet of pending request objects prevents a
duplicate SDK notification from counting the **same query** twice; new requests
always get their own count. No analytics sessionStorage access or once-per-tab
in-memory guard remains. Old stored markers are ignored without touching them.
Renderer, CX transport/session implementation and backend resources are unchanged.

## Startup and failure isolation

The standard gtag queue, `js` and `config` calls are created immediately; automatic
`page_view` is enabled. Early query events are queued even before gtag.js loads.
After core UI/Messenger initialization settles (ready or unavailable), app calls
`loadAfterCore()`. The official async loader is scheduled with
`requestIdleCallback(..., {timeout: 1500})`, falling back to `setTimeout(..., 0)`
when the API is absent or throws. There is only one loader schedule per document.

Messenger starts immediately as before; no submit-time SDK load or new await
is introduced. A failing SDK still reaches analytics scheduling through finally.
A slow/unavailable SDK can defer GA4 until its existing initialization timeout;
GA4 delivery is not guaranteed if a visitor leaves early. Bootstrap, scheduling,
loader and send exceptions stay analytics-only. Blocked GA4 leaves queued calls
without blocking queries. A failed event is not retried, and later valid queries
still attempt their own event. See [PERFORMANCE.md](PERFORMANCE.md).

## Privacy and reporting

The marker accepts no business data and adds no event parameters: no question,
answer, source title/URL, inferred category, Playbook ID/name, entered identifier
or contact information. Ordinary GA4 context depends on the owner's property
settings. Configured page location is origin + pathname (query/hash excluded),
referrer is blank; Google signals/ad personalization signals remain disabled.

| Metric | Meaning |
| --- | --- |
| `page_view` | Page views, including refresh |
| `ai_query_submit` event count | **查詢次數**: total accepted valid query submissions, including follow-up and post-reset |
| GA4 users/sessions filtered to `ai_query_submit` | Separate optional analysis of users/sessions; not the raw query count |

Do not label this event count unique people or「發問人次」. No additional custom
business event is implemented. Delivery can undercount when analytics is blocked.

## Validation and resource evidence

- Node: 14 existing + 7 analytics tests PASS (21 total).
- Offline Chromium: 22 grouped checks PASS; verifies per-query counts 1/2/3, no extra count for reset,
  examples/invalid/cancelled/unsolicited input or duplicate SDK notification,
  exact no-parameter payload, early queue retention, eventual deferred loader,
  blocked GA loader/send, scoped local CSP and unavailable-SDK scheduling.
  Google scripts are local fixtures; no real GA/Production request is sent.
- Known required external bootstrap URL is unchanged:
  `https://www.googletagmanager.com/gtag/js?id=G-S891SFSMBH`.
  No new external origin or CSP requirement is added. `IT_HANDOFF.md` is left
  byte-identical under this task's resource/CSP-only update rule; its earlier
  once-per-tab release description is historical. Current analytics meaning is
  defined here and in NEXT_TASK/PROJECT_STATE.
- Current Cloud probe at 15:24:14 Asia/Taipei rejected official gtag CONNECT
  with HTTP 403 (curl 56) before origin; deployed Pages Chromium at 15:24:38
  rejected the document with proxy `ERR_CERT_AUTHORITY_INVALID` before
  page JS. Actual gtag subresource/collection hosts remain unobserved; no guessed
  wildcard/connect-src policy is proposed.

Current Pages run/SHA/ZIP parity and post-deployment live result are recorded in
[PAGES_DEPLOYMENT.md](PAGES_DEPLOYMENT.md) and [NEXT_TASK.md](../NEXT_TASK.md).
Deployed `49ade8ed9904b8f5f379fe5e1d61ff40ba4e6fca`, [run 37743130011](https://github.com/taipei-tax-lab/tpctax-1999-ai-web/actions/runs/37743130011),
15:23:50 Asia/Taipei: PASS; all 12 hosted files match production ZIP. The actual
browser run has zero origin responses/page JS, 0 Production queries and
0 observed analytics collection requests. All seven live items stay unchecked.
GA4 live verification remains PENDING where proxy trust/access prevents it.
A trusted browser should observe page measurement, then query events 1/2/3 for
first/follow-up/post-reset; reset alone adds none, custom payload has no question
text, and GA failure must leave AI queries usable. A queued fixture call does
not prove GA receipt.
