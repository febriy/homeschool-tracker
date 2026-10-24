/* Shared record sync. Preferences remain local; pending edits survive a reload. */
class SharedTracker {
  constructor({ snapshot, apply, status }) {
    this.snapshot = snapshot;
    this.apply = apply;
    this.status = status;
    this.records = {};
    this.ready = false;
    this.busy = false;
    try { this.pending = JSON.parse(localStorage.getItem('mll-pending-v1')) || {}; } catch { this.pending = {}; }
    this.cache = (() => { try { return JSON.parse(localStorage.getItem('mll-shared-cache')) || null; } catch { return null; } })();
    if (this.cache) this.apply({ ...this.cache, ...this.pending });
    this.observed = this.snapshot();
    this.status('loading');
    this.refresh();
    this.interval = setInterval(() => { if (!document.hidden) this.refresh(); }, 30000);
    window.addEventListener('online', () => this.refresh());
    window.addEventListener('focus', () => this.refresh());
    document.addEventListener('visibilitychange', () => { if (!document.hidden) this.refresh(); });
    window.addEventListener('beforeunload', e => { if (Object.keys(this.pending).length) { e.preventDefault(); e.returnValue = ''; } });
  }
  remember() { localStorage.setItem('mll-pending-v1', JSON.stringify(this.pending)); }
  changed() {
    const next = this.snapshot();
    for (const key of new Set([...Object.keys(this.observed), ...Object.keys(next)])) {
      if (JSON.stringify(next[key]) !== JSON.stringify(this.observed[key])) this.pending[key] = next[key] === undefined ? null : next[key];
    }
    this.observed = next;
    this.remember();
    if (!Object.keys(this.pending).length) return;
    this.status(navigator.onLine ? 'saving' : 'offline');
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flush(), 650);
  }
  async request(body) {
    const response = await fetch('/api/progress', {
      method: body ? 'POST' : 'GET', cache: 'no-store',
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(20000)
    });
    if (!response.ok) throw new Error('Shared saving unavailable');
    return response.json();
  }
  accept(records) {
    this.records = records;
    localStorage.setItem('mll-shared-cache', JSON.stringify(records));
    // Never replace text under the cursor. Reconcile after the user leaves the field.
    if (!document.activeElement?.matches('textarea,input[type="text"]')) {
      this.apply({ ...records, ...this.pending });
      this.observed = this.snapshot();
    }
  }
  async refresh() {
    if (this.busy) return;
    this.busy = true;
    try {
      let result = await this.request();
      if (!result.initialized) result = await this.request({ mode: 'initialize', changes: Object.entries(this.snapshot()).map(([key,value]) => ({ key,value })) });
      this.ready = true;
      this.accept(result.records);
      this.status(Object.keys(this.pending).length ? 'saving' : 'saved');
    } catch { this.status(navigator.onLine ? 'error' : 'offline'); }
    finally { this.busy = false; }
    if (this.ready && Object.keys(this.pending).length) this.flush();
  }
  async flush() {
    if (!this.ready) return this.refresh();
    if (this.busy || !Object.keys(this.pending).length) return;
    this.busy = true;
    const batch = { ...this.pending };
    this.status('saving');
    try {
      const result = await this.request({ mode: 'update', changes: Object.entries(batch).map(([key,value]) => ({ key,value })) });
      for (const [key,value] of Object.entries(batch)) if (JSON.stringify(this.pending[key]) === JSON.stringify(value)) delete this.pending[key];
      this.remember();
      this.accept(result.records);
      this.status(Object.keys(this.pending).length ? 'saving' : 'saved');
    } catch { this.status(navigator.onLine ? 'error' : 'offline'); }
    finally { this.busy = false; }
    if (Object.keys(this.pending).length) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.flush(), 5000);
    }
  }
}
window.SharedTracker = SharedTracker;
