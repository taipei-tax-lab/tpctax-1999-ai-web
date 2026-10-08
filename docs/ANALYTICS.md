# Minimal GA4 measurement

## Configuration and event contract

The owner supplied and authorized the public GA4 Web Data Stream Measurement ID
`G-S891SFSMBH` on 2026-10-08. `assets/config.js` exposes `ga4MeasurementId`;
an absent or invalid-looking value disables analytics. No GTM container is used.
The isolated `demo.html` always disables analytics, including with this ID set.

`assets/analytics.js` creates the standard gtag queue and loads the official
async script `https://www.googletagmanager.com/gtag/js?id=G-S891SFSMBH`.
All bootstrap logic is in local external modules; no inline executable script
or new runtime dependency is added. Default `page_view` is enabled.

The only custom business event emitted by this frontend is
`gtag('event', 'ai_question_start')`, with **no custom parameters**.
`assets/app.js` listens after the existing Messenger transport's request handler
and marks the first non-cancelled `df-request-sent` text request that the
transport has accepted for a pending user query. Opening the page, filling an
example, empty/invalid input, unsolicited SDK events and a send failure before
acceptance do not emit it. Acceptance counts a question start; it does not
assert that a successful answer or GA delivery followed.

The sessionStorage key `tpctax1999:question-start:G-S891SFSMBH` prevents duplicate
events for follow-ups, reset/post-reset questions and refreshes within the same
tab's storage session. Reset still performs the existing real Messenger reset
and never clears this analytics guard. If storage is denied, an in-memory guard
protects the current document; refresh persistence cannot be guaranteed in that
case. Clearing browser storage can begin another count. This is not a unique
person identifier or an exact GA4 session definition.

Bootstrap, storage and event-send exceptions are caught. A blocked loader leaves
queued calls without preventing Messenger queries. The marker is not retried
after a failed send; delivery can therefore be undercounted when analytics is
blocked. Renderer, transport/session implementation and CX backend are unchanged.

## Data minimization

The question marker accepts no question/answer/source metadata and adds no
event parameters. It sends no question, answer, source title/URL, inferred tax
category, Playbook ID/name, entered identifier or contact information. Ordinary
GA page/session context remains subject to the owner's GA4 property settings.
The configured page location is origin plus pathname, excluding query/hash;
page referrer is blank. Google signals and ad personalization signals are
disabled in the local configuration. No GA4 property setting is changed here.

## Reporting meaning

| Metric | Intended use |
| --- | --- |
| `page_view` | Page visits, including a view after refresh |
| `ai_question_start` event count | Simplest operational 「發問人次」: tab storage sessions that started at least one valid question |
| GA4 user/session metrics filtered to `ai_question_start` | Optional later analysis of users or GA4 sessions; not equivalent to the raw event count |

Follow-ups and post-reset questions in the same tab do not increase the custom
event count. It is neither total questions nor unique people. No additional
custom event is authorized or implemented.

## Validation and resource evidence — 2026-10-08 (Asia/Taipei)

- Node: 14 existing tests plus 5 focused analytics tests PASS (19 total).
- Offline Chromium: 19 grouped checks PASS, including accepted-query wiring,
  first/follow-up/reset/refresh guards, invalid/example/unsolicited exclusions,
  exact no-content payload, loader/send failures and both brand links.
  SDK and gtag scripts were locally intercepted; 0 real GA/Production requests.
  These checks establish code behavior, not GA4 receipt or live SDK behavior.
- The required bootstrap origin is `https://www.googletagmanager.com` based on
  the configured official URL and an actual HTTPS probe at 12:54:12 Asia/Taipei.
  The Cloud proxy rejected CONNECT with HTTP 403 (curl 56), before any origin
  response. No gtag code, subresource or collection request was retrieved.
  Analytics collection hosts are **unobserved**; no guessed wildcard CSP list
  is proposed. See [IT_HANDOFF.md](IT_HANDOFF.md).

Pages deployment and the post-deployment live verification result are recorded
in [PAGES_DEPLOYMENT.md](PAGES_DEPLOYMENT.md) and [NEXT_TASK.md](../NEXT_TASK.md).
GA4 live script/collection verification remains PENDING until an ordinary
trusted browser can observe the official loader and `page_view`, then one
`ai_question_start` with no question/answer/source payload. Follow-up and
reset/post-reset should add no second custom event. Loading the page alone
must not add it. A queued call or offline fixture is not evidence of GA receipt.
