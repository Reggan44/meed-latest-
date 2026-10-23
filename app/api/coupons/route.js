import db from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAdmin, requireOwnerOrAdmin, getSessionUser, isAdmin, unauthorized, forbidden, safeUser } from "@/lib/authz";


export async function POST(request) {
  try {
    const { title, couponCode, expiryDate, isActive, vendorId } =
      await request.json();
    const denied = await requireOwnerOrAdmin(vendorId);
    if (denied) return denied;
    const newCoupon = await db.coupon.create({
      data: {
        title,
        couponCode,
        expiryDate,
        isActive,
        vendorId,
      },
    });
    console.log(newCoupon);
    return NextResponse.json(newCoupon);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to create Coupon",
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const coupons = await db.coupon.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(coupons);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to Fetch Coupon",
      },
      { status: 500 }
    );
  }
}
