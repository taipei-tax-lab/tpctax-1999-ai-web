/** One event per accepted query. Never accepts question/answer metadata. */
export function createAnalytics(measurementId, runtime = globalThis, enabled = true) {
  const disabled = {queryAccepted() {}, loadAfterCore() {}};
  if (!enabled || typeof measurementId !== 'string' || !/^G-[A-Z0-9]{10}$/.test(measurementId)) return disabled;
  try {
    runtime.dataLayer ||= [];
    runtime.gtag ||= function () { runtime.dataLayer.push(arguments); };
    runtime.gtag('js', new Date());
    runtime.gtag('config', measurementId, {
      send_page_view: true,
      page_location: runtime.location.origin + runtime.location.pathname,
      page_referrer: '',
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
  } catch { return disabled; }
  let scheduled = false;
  return {
    queryAccepted() {
      try { runtime.gtag('event', 'ai_query_submit'); } catch { /* Analytics can never block a query. */ }
    },
    loadAfterCore() {
      if (scheduled) return;
      scheduled = true;
      const load = () => {
        try {
          const script = runtime.document.createElement('script');
          script.async = true;
          script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
          runtime.document.head.append(script);
        } catch { /* A blocked loader leaves the query path and queue intact. */ }
      };
      try {
        if (typeof runtime.requestIdleCallback === 'function') runtime.requestIdleCallback(load, {timeout: 1500});
        else runtime.setTimeout(load, 0);
      } catch {
        try { runtime.setTimeout(load, 0); } catch { /* Scheduling failure is analytics-only. */ }
      }
    },
  };
}
