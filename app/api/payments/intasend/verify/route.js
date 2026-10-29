import { NextResponse } from "next/server";
import { getSessionUser, isAdmin } from "@/lib/authz";
import { syncOrderPayment } from "@/lib/payments";
import db from "@/lib/db";

// Lets the confirmation page refresh payment state without waiting for the webhook.
export async function POST(request) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { orderId } = await request.json();
    const existing = await db.order.findUnique({ where: { id: String(orderId) } });
    if (!existing || (existing.userId !== user.id && !isAdmin(user))) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    const order = await syncOrderPayment(existing.id);
    return NextResponse.json({ paymentStatus: order.paymentStatus });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Could not verify payment" }, { status: 500 });
  }
}
