export const config = Object.freeze({
  // Package only. Enable only after separately approved hosting/domain review.
  liveEnabled: true,
  // Human-approved public GA4 Web Data Stream ID; blank/invalid disables analytics.
  ga4MeasurementId: 'G-S891SFSMBH',
  hostingUrl: 'https://REVENUE_SERVICE_HOST_PLACEHOLDER/1999-ai/',
  officialFaqUrl: 'https://tpctax.gov.taipei/News.aspx?n=BB8B93F0A49EAB80&sms=87415A8B9CE81B16',
  projectId: 'serviceagent-1150909',
  agentId: '799426c1-ba69-49dc-85e4-5065985706e2',
  location: 'asia-northeast1',
  languageCode: 'zh-tw',
  initialPlaybook: 'projects/serviceagent-1150909/locations/asia-northeast1/agents/799426c1-ba69-49dc-85e4-5065985706e2/playbooks/f0512949-95f2-40c6-95d0-0c139b84b542',
  // Messenger Environment binding is integration-side; not a guessed HTML attribute.
  expectedEnvironment: 'a0c712e8-ab0c-4520-b100-d2abcfc85868',
  messengerScript: 'https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js',
  sessionTtlSeconds: 1800,
  requestTimeoutMs: 60000,
  maxQueryLength: 1000,
  officialFaqOrigins: ['https://tpctax.gov.taipei'],
});
