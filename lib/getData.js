import { headers } from "next/headers";

export async function getData(endpoint) {
  try {
    // Prefer the origin of the current request so the app works on any domain
    // (apex, www, preview deployments); fall back to the configured base URL.
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    let cookie = "";
    try {
      const h = headers();
      const host = h.get("x-forwarded-host") ?? h.get("host");
      if (host) {
        const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
        baseUrl = `${proto}://${host}`;
      }
      cookie = h.get("cookie") ?? "";
    } catch {}
    const init = { cache: "no-store", headers: cookie ? { cookie } : {} };
    const url = `${baseUrl}/api/${endpoint}`;
    let response;
    try {
      response = await fetch(url, init);
    } catch {
      response = await fetch(url, init);
    }
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}
