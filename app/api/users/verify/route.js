import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const { token, id } = await request.json();
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!user || !token || user.verificationToken !== token) {
      return NextResponse.json(
        {
          data: null,
          message: "Invalid verification link",
        },
        { status: 404 }
      );
    }
    const updatedUser = await db.user.update({
      where: {
        id,
      },
      data: {
        emailVerified: true,
        verificationToken: null,
      },
    });
    return NextResponse.json({ message: "Email verified" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to Update User",
      },
      { status: 500 }
    );
  }
}
