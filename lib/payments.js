import db from "@/lib/db";
import { getInvoiceStatus } from "@/lib/intasend";

export function orderTotal(order) {
  const items = order.orderItems.reduce((a, i) => a + i.price * i.quantity, 0);
  return items + (order.shippingCost ?? 0);
}

// Re-checks the order's invoice with IntaSend and updates paymentStatus. Idempotent.
export async function syncOrderPayment(orderId) {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { orderItems: true },
  });
  if (!order || !order.paymentRef) return order;
  if (order.paymentStatus === "PAID") return order;

  const { state, amount, currency } = await getInvoiceStatus(order.paymentRef);
  if (state === "COMPLETE") {
    const expected = orderTotal(order);
    if (currency !== "KES" || !(amount >= expected - 0.5)) {
      console.error("IntaSend amount mismatch", { orderId, amount, expected, currency });
      return order;
    }
    return db.order.update({
      where: { id: orderId },
      data: { paymentStatus: "PAID", paidAt: new Date() },
    });
  }
  if (state === "FAILED") {
    return db.order.update({
      where: { id: orderId },
      data: { paymentStatus: "FAILED" },
    });
  }
  return order;
}
