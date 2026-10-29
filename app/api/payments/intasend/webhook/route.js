import { NextResponse } from "next/server";
import db from "@/lib/db";
import { syncOrderPayment } from "@/lib/payments";

// Called by IntaSend. The payload is only used to find the order; the real
// payment state is fetched from IntaSend before anything is marked paid.
export async function POST(request) {
  try {
    const body = await request.json();
    const expected = process.env.INTASEND_WEBHOOK_CHALLENGE;
    if (!expected || body.challenge !== expected) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const order = body.api_ref
      ? await db.order.findUnique({ where: { id: String(body.api_ref) } })
      : null;
    if (order && order.paymentRef && order.paymentRef === body.invoice_id) {
      await syncOrderPayment(order.id);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
