import { headers } from "next/headers";

export async function getData(endpoint) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    // console.log(`${baseUrl}/api/${endpoint}`);
    // Forward the visitor's cookies so protected API routes see the signed-in user.
    let cookie = "";
    try {
      cookie = headers().get("cookie") ?? "";
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
