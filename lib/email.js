import { Resend } from "resend";

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
};

const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "https://meedcollections.store";
const getSender = () => process.env.EMAIL_FROM || "Meed Collections <orders@meedcollections.store>";

/**
 * Sends an order confirmation email to the customer upon verified payment.
 */
export async function sendOrderPaidCustomerEmail(order) {
  try {
    const resend = getResendClient();
    if (!resend || !order.email) return;

    const itemsSummary = (order.orderItems || [])
      .map((item) => `<li>${item.title || "Product"} × ${item.quantity} - KSh ${Number(item.price).toLocaleString("en-KE")}</li>`)
      .join("");

    const orderUrl = `${getBaseUrl()}/order-confirmation/${order.id}`;

    await resend.emails.send({
      from: getSender(),
      to: order.email,
      subject: `Order Confirmed #${order.orderNumber} - Meed Collections`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; background: #ffffff; border: 1px solid #e2e8f0; rounded: 8px;">
          <h2 style="color: #0f172a; margin-bottom: 8px;">Thank you for your order!</h2>
          <p style="font-size: 15px; color: #475569;">
            Your payment for order <strong>#${order.orderNumber}</strong> has been received and confirmed.
          </p>
          <div style="background: #f8fafc; padding: 16px; border-radius: 6px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #0f172a;">Order Details</h4>
            <ul style="padding-left: 20px; margin: 0; color: #334155; line-height: 1.6;">
              ${itemsSummary}
            </ul>
            <p style="margin-top: 12px; font-weight: bold; color: #0f172a;">
              Shipping Cost: KSh ${Number(order.shippingCost || 0).toLocaleString("en-KE")}
            </p>
          </div>
          <p style="font-size: 14px; color: #475569;">
            <strong>Shipping to:</strong> ${order.firstName} ${order.lastName}, ${order.streetAddress || ""}, ${order.city || ""}, ${order.country || "Kenya"}
          </p>
          <div style="margin-top: 24px;">
            <a href="${orderUrl}" style="background: #0f172a; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-block;">
              View Your Order
            </a>
          </div>
          <p style="margin-top: 32px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px;">
            Meed Collections • Nairobi, Kenya • Need help? Reply to this email.
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("sendOrderPaidCustomerEmail failed:", err?.message);
  }
}

/**
 * Sends a notification email to store admin when a new paid order arrives.
 */
export async function sendOrderPaidAdminAlert(order) {
  try {
    const resend = getResendClient();
    const adminEmail = process.env.ADMIN_ALERT_EMAIL;
    if (!resend || !adminEmail) return;

    await resend.emails.send({
      from: getSender(),
      to: adminEmail,
      subject: `[New Paid Order] #${order.orderNumber} - KSh ${order.totalAmount || ""}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h3>New Order Paid #${order.orderNumber}</h3>
          <p>Customer: ${order.firstName} ${order.lastName} (${order.email}, ${order.phone})</p>
          <p><a href="${getBaseUrl()}/dashboard/orders/${order.id}">Open in Dashboard</a></p>
        </div>
      `,
    });
  } catch (err) {
    console.error("sendOrderPaidAdminAlert failed:", err?.message);
  }
}

