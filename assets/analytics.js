/** One question-start per tab session. Never accepts question/answer metadata. */
export function createAnalytics(measurementId, runtime = globalThis, enabled = true) {
  const disabled = {questionAccepted() {}};
  if (!enabled || typeof measurementId !== 'string' || !/^G-[A-Z0-9]{10}$/.test(measurementId)) return disabled;
  const key = `tpctax1999:question-start:${measurementId}`;
  let recorded = false;
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
    const script = runtime.document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    runtime.document.head.append(script);
  } catch { return disabled; }
  return {
    questionAccepted() {
      if (recorded) return;
      try { recorded = runtime.sessionStorage.getItem(key) === '1'; } catch { /* In-memory guard when storage is unavailable. */ }
      if (recorded) return;
      recorded = true;
      try { runtime.sessionStorage.setItem(key, '1'); } catch { /* Followups/reset still share the in-memory guard. */ }
      try { runtime.gtag('event', 'ai_question_start'); } catch { /* Analytics can never block a query. */ }
    },
  };
}
