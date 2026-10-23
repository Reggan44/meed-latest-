// In-memory sliding-window limiter. Fine for a single server process;
// use a shared store (e.g. Upstash Redis) if the app runs on several instances.
const buckets = new Map();

export function rateLimit(key, limit, windowMs) {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - hits[0])) / 1000) };
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
  }
  return { ok: true };
}

export function clientIp(request) {
  const h = request?.headers;
  const get = (n) => (typeof h?.get === "function" ? h.get(n) : h?.[n]);
  return (get("x-forwarded-for") || get("x-real-ip") || "unknown").split(",")[0].trim();
}
