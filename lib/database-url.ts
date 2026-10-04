// Keep the supplied host/port and explicit pool settings. Only supply bounded
// defaults for Supabase poolers, which have limited serverless connections.
export function databaseUrl(value?: string): string | undefined {
  if (!value) return value;
  try {
    const url = new URL(value);
    if (!url.hostname.endsWith(".pooler.supabase.com")) return value;
    if (!url.searchParams.has("connection_limit"))
      url.searchParams.set("connection_limit", "4");
    if (!url.searchParams.has("connect_timeout"))
      url.searchParams.set("connect_timeout", "8");
    if (!url.searchParams.has("pool_timeout"))
      url.searchParams.set("pool_timeout", "10");
    if (url.port === "6543" && !url.searchParams.has("pgbouncer"))
      url.searchParams.set("pgbouncer", "true");
    return url.toString();
  } catch {
    return value;
  }
}
