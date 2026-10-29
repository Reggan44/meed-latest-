// Thin IntaSend REST wrapper (https://developers.intasend.com). Server-side only.
const isTest = () => process.env.INTASEND_TEST_MODE !== "false";
const base = () =>
  isTest() ? "https://sandbox.intasend.com" : "https://payment.intasend.com";

function secretHeaders() {
  const key = process.env.INTASEND_SECRET_KEY;
  if (!key) throw new Error("INTASEND_SECRET_KEY is not set");
  return { "Content-Type": "application/json", Authorization: `Bearer ${key}` };
}

export async function createCheckout({ order, amount, redirectUrl, host }) {
  const res = await fetch(`${base()}/api/v1/checkout/`, {
    method: "POST",
    headers: secretHeaders(),
    body: JSON.stringify({
      public_key: process.env.INTASEND_PUBLISHABLE_KEY,
      amount,
      currency: "KES",
      email: order.email,
      first_name: order.firstName,
      last_name: order.lastName,
      phone_number: order.phone,
      host,
      api_ref: order.id,
      redirect_url: redirectUrl,
      comment: `Meed order ${order.orderNumber}`,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) {
    console.error("IntaSend checkout failed:", res.status, data);
    throw new Error("Could not start payment");
  }
  return { url: data.url, invoiceId: data.invoice?.invoice_id ?? data.id };
}

// Authoritative payment state straight from IntaSend; webhooks are never trusted on their own.
export async function getInvoiceStatus(invoiceId) {
  const res = await fetch(`${base()}/api/v1/payment/status/`, {
    method: "POST",
    headers: secretHeaders(),
    body: JSON.stringify({ invoice_id: invoiceId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error("Could not verify payment");
  return {
    state: data.invoice?.state,
    apiRef: data.invoice?.api_ref,
    amount: Number(data.invoice?.value ?? data.invoice?.net_amount),
    currency: data.invoice?.currency,
  };
}
