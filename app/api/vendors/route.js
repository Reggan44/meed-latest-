import db from "@/lib/db";
import { NextResponse } from "next/server";
import { safeUser } from "@/lib/authz";



export async function GET(request) {
  try {
    const vendors = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        role: "VENDOR",
      },
      include: {
        sellerProfile: true,
      },
    });
    return NextResponse.json(vendors.map(safeUser));
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to Fetch VENDORS",
        error,
      },
      { status: 500 }
    );
  }
}