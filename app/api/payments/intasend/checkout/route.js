import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser, isAdmin } from "@/lib/authz";
import { createCheckout } from "@/lib/intasend";
import { orderTotal } from "@/lib/payments";

export async function POST(request) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { orderId } = await request.json();
    const order = await db.order.findUnique({
      where: { id: String(orderId) },
      include: { orderItems: true },
    });
    if (!order || (order.userId !== user.id && !isAdmin(user))) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    if (order.paymentStatus === "PAID") {
      return NextResponse.json({ message: "Order already paid" }, { status: 409 });
    }

    const origin = new URL(request.url).origin;
    const { url, invoiceId } = await createCheckout({
      order,
      amount: orderTotal(order),
      redirectUrl: `${origin}/order-confirmation/${order.id}`,
      host: origin,
    });
    await db.order.update({
      where: { id: order.id },
      data: { paymentRef: invoiceId, paymentStatus: "PENDING" },
    });
    return NextResponse.json({ url });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Could not start payment. Please try again." },
      { status: 500 }
    );
  }
}
