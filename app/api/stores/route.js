import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { title, slug, logoUrl, description, isActive, categoryIds } =
      await request.json();

    const existingStore = await db.store.findUnique({
      where: {
        slug,
      },
    });

    if (existingStore) {
      return NextResponse.json(
        {
          data: null,
          message: `Store ( ${title} ) already exists in the Database`,
        },
        { status: 409 }
      );
    }

    const newStore = await db.store.create({
      data: { title, slug, logoUrl, description, isActive, categoryIds },
    });

    console.log(newStore);
    return NextResponse.json(newStore);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to create Store",
        error,
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const stores = await db.store.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(stores);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to Fetch Stores",
        error,
      },
      { status: 500 }
    );
  }
}