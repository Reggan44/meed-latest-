import db from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAdmin, requireOwnerOrAdmin, getSessionUser, isAdmin, unauthorized, forbidden, safeUser } from "@/lib/authz";


export async function GET(request) {
  try {
    const customers = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        role: "USER",
      },
      include: {
        profile: true,
      },
    });
    return NextResponse.json(customers.map(safeUser));
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to Fetch Users",
        error,
      },
      { status: 500 }
    );
  }
}
