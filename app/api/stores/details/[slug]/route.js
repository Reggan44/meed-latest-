import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params: { slug } }) {
  try {
    const store = await db.store.findUnique({
      where: {
        slug,
      },
    });
    return NextResponse.json(store);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to Fetch Store",
        error,
      },
      { status: 500 }
    );
  }
}