import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params: { id } }) {
  try {
    const store = await db.store.findUnique({
      where: {
        id,
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

export async function DELETE(request, { params: { id } }) {
  try {
    const existingStore = await db.store.findUnique({
      where: {
        id,
      },
    });
    if (!existingStore) {
      return NextResponse.json(
        {
          data: null,
          message: "Store Not Found",
        },
        { status: 404 }
      );
    }
    const deletedStore = await db.store.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(deletedStore);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to Delete Store",
        error,
      },
      { status: 500 }
    );
  }
}