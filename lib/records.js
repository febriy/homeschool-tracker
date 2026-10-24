const date = '\\d{4}-\\d{2}-\\d{2}';
const keyPattern = new RegExp(`^(task:[A-E]:[a-zA-Z0-9-]{1,80}|daily:${date}:[0-3]|kids:${date}|journal:${date}|loop-note:[A-E])$`);
const safeUrl = value => typeof value === 'string' && value.length <= 2000 && /^https?:\/\//i.test(value);
export function validateChanges(changes) {
  if (!Array.isArray(changes) || !changes.length || changes.length > 500) return false;
  const seen = new Set();
  return changes.every(record => {
    if (!record || !keyPattern.test(record.key) || seen.has(record.key)) return false;
    seen.add(record.key);
    const { key, value } = record;
    if (key.startsWith('task:')) {
      if (value === null) return true; // Tombstone prevents a removed study reappearing.
      if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
      if (Object.keys(value).some(k => !['id','title','detail','done','doneOn','url','links'].includes(k))) return false;
      if (value.id !== key.split(':')[2] || typeof value.title !== 'string' || !value.title.trim() || value.title.length > 150) return false;
      if (value.detail !== undefined && (typeof value.detail !== 'string' || value.detail.length > 2000)) return false;
      if (value.done !== undefined && typeof value.done !== 'boolean') return false;
      if (value.doneOn !== undefined && value.doneOn !== null && !/^\d{4}-\d{2}-\d{2}$/.test(value.doneOn)) return false;
      if (value.url !== undefined && !safeUrl(value.url)) return false;
      if (value.links !== undefined && (!Array.isArray(value.links) || value.links.length > 10 || !value.links.every(x => x && typeof x.label === 'string' && x.label.length <= 150 && safeUrl(x.url)))) return false;
      return true;
    }
    if (key.startsWith('daily:') || key.startsWith('kids:')) return typeof value === 'boolean';
    return typeof value === 'string' && value.length <= 20000;
  });
}
