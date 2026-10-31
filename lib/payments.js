import db from "@/lib/db";
import { getInvoiceStatus } from "@/lib/intasend";
import { sendOrderPaidCustomerEmail, sendOrderPaidAdminAlert } from "@/lib/email";

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

    const finalOrder = await db.$transaction(async (tx) => {
      // 1. Mark order paid
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { paymentStatus: "PAID", paidAt: new Date() },
      });

      // 2. Decrement stock for purchased items
      for (const item of order.orderItems) {
        if (item.productId) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              productStock: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      // 3. Record sales now that payment is confirmed
      await tx.sale.createMany({
        data: order.orderItems.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          vendorId: item.vendorId,
          productTitle: item.title ?? "",
          productImage: item.imageUrl ?? "",
          productPrice: item.price,
          productQty: item.quantity,
          total: item.price * item.quantity,
        })),
      });

      return updatedOrder;
    });

    // Send confirmation emails in background
    Promise.allSettled([
      sendOrderPaidCustomerEmail(order),
      sendOrderPaidAdminAlert(order),
    ]).catch(() => {});

    return finalOrder;
  }
  if (state === "FAILED") {
    return db.order.update({
      where: { id: orderId },
      data: { paymentStatus: "FAILED" },
    });
  }
  return order;
}
