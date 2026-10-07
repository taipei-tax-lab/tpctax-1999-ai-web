/** Messenger is the sole live browser transport. No custom HTTP/API client. */
export class MessengerTransport {
  constructor(messenger, config, eventRoot = window) {
    this.messenger = messenger;this.config = config;this.eventRoot = eventRoot;
    this.armed = true;this.pending = null;this.locked = false;this.listeners = [];
    this.listen('df-request-sent', event => {
      const body = event.detail?.data?.requestBody;
      // Block unsolicited welcome/events; only user sendQuery requests consume override.
      if (!this.pending || !body?.queryInput?.text) { event.preventDefault();return; }
      body.queryParams ||= {};
      if (this.armed) body.queryParams.currentPlaybook = config.initialPlaybook;
      else delete body.queryParams.currentPlaybook;
      body.queryParams.timeZone = 'Asia/Taipei';
      this.pending.sent = true;
      this.armed = false;
      messenger.setQueryParameters({timeZone: 'Asia/Taipei'});
    });
    this.listen('df-response-received', event => {
      // SDK documents cancelability: suppress its transcript, render only our latest result.
      if (event.cancelable) event.preventDefault();
      if (!this.pending?.sent || this.pending.timedOut) return;
      this.finish(null, event.detail || {});
    });
    this.listen('df-messenger-error', () => this.finish(new Error('service')));
    for (const name of ['df-session-expired', 'df-session-ended']) {
      this.listen(name, () => {
        if (this.pending) this.finish(new Error('session'));
        if (!this.locked) this.reset();
        else this.rearmAfterSettled = true;
      });
    }
    this.arm();
  }
  listen(name, fn) {
    const handler = event => {
      const path = event.composedPath?.() || [];
      // One SDK instance on this isolated page; ignore events from other elements.
      if (event.target !== this.eventRoot && !path.includes(this.messenger)) return;
      fn(event);
    };
    this.eventRoot.addEventListener(name, handler);this.listeners.push([name, handler]);
  }
  arm() { this.armed = true;this.messenger.setQueryParameters({timeZone: 'Asia/Taipei', currentPlaybook: this.config.initialPlaybook}); }
  reset() {
    if (this.locked) throw new Error('busy');
    this.messenger.startNewSession({retainHistory: false});this.arm();
  }
  clear() {
    if (this.locked) throw new Error('busy');
    this.messenger.clearStorage();this.reset();
  }
  finish(error, detail) {
    if (!this.pending) return;
    const pending = this.pending;this.pending = null;clearTimeout(pending.timer);
    if (error) pending.reject(error);else pending.resolve(detail);
  }
  send(query) {
    if (this.locked || this.pending) return Promise.reject(new Error('busy'));
    this.locked = true;
    return new Promise((resolve, reject) => {
      const pending = {resolve, reject, sent: false, timedOut: false};this.pending = pending;
      pending.timer = setTimeout(() => {
        pending.timedOut = true;this.finish(new Error('timeout'));
        // Keep transport locked until SDK settles, preventing late-result/query mixing.
      }, this.config.requestTimeoutMs);
      let operation;
      try { operation = this.messenger.sendQuery(query); }
      catch { this.finish(new Error('service'));this.locked = false;return; }
      Promise.resolve(operation).then(() => {
        if (this.pending === pending) this.finish(new Error('empty'));
      }, () => {
        if (this.pending === pending) this.finish(new Error('service'));
      }).finally(() => {
        this.locked = false;
        if (this.rearmAfterSettled) { this.rearmAfterSettled = false;this.reset(); }
        this.onSettled?.();
      });
    });
  }
  dispose() { for (const [n, fn] of this.listeners) this.eventRoot.removeEventListener(n, fn); }
}

export function loadMessenger(config) {
  return new Promise((resolve, reject) => {
    const messenger = document.createElement('df-messenger');messenger.hidden = true;messenger.inert = true;
    for (const [name, value] of Object.entries({'project-id': config.projectId, 'agent-id': config.agentId,
      location: config.location, 'language-code': config.languageCode, 'storage-option': 'none',
      'session-ttl': String(config.sessionTtlSeconds), 'max-query-length': String(config.maxQueryLength)})) messenger.setAttribute(name, value);
    // Documented inline child initializes the SDK; hidden, no bubble, no public transcript.
    messenger.append(document.createElement('df-messenger-chat'));
    const timer = setTimeout(() => { cleanup();messenger.remove();reject(new Error('unavailable')); }, 20000);
    const loaded = () => {
      if (typeof messenger.sendQuery !== 'function' || typeof messenger.setQueryParameters !== 'function') return;
      cleanup();messenger.startNewSession({retainHistory: false});resolve(messenger);
    };
    const cleanup = () => { clearTimeout(timer);window.removeEventListener('df-messenger-loaded', loaded); };
    window.addEventListener('df-messenger-loaded', loaded);
    document.body.append(messenger);
    const script = document.createElement('script');script.src = config.messengerScript;
    script.onerror = () => { cleanup();messenger.remove();reject(new Error('unavailable')); };
    document.body.append(script);
  });
}
