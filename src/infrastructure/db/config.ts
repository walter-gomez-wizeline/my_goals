export function parseDatabaseUrl(value: string | undefined): URL {
  if (!value) throw new Error('A database connection URL is required.');
  let url: URL;
  try { url = new URL(value); } catch { throw new Error('Invalid database connection URL.'); }
  if (!['postgres:', 'postgresql:'].includes(url.protocol) || !url.hostname || !url.pathname.slice(1)) {
    throw new Error('A PostgreSQL URL with a database name is required.');
  }
  return url;
}

// These development commands intentionally refuse cloud URLs.
export function requireLocalDatabase(value: string | undefined, purpose: 'development' | 'test'): string {
  const url = parseDatabaseUrl(value);
  const name = decodeURIComponent(url.pathname.slice(1));
  const allowed = purpose === 'test' ? 'my_goals_test' : 'my_goals_dev';
  if (!['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) || name !== allowed || url.search) {
    throw new Error(`This command requires a loopback ${allowed} database without URL query options.`);
  }
  return value!;
}

export function readPoolMax(value: string | undefined): number {
  const result = value === undefined ? 3 : Number(value);
  if (!Number.isSafeInteger(result) || result < 1 || result > 10) {
    throw new Error('DATABASE_POOL_MAX must be an integer from 1 to 10.');
  }
  return result;
}
