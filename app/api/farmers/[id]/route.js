import db from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAdmin, requireOwnerOrAdmin, getSessionUser, isAdmin, unauthorized, forbidden, safeUser } from "@/lib/authz";


export async function GET(request, { params: { id } }) {
  try {
    const farmer = await db.user.findUnique({
      where: {
        id,
      },
      include: {
        farmerProfile: true,
      },
    });
    return NextResponse.json(safeUser(farmer));
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to Fetch Farmer",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params: { id } }) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;
    const existingUser = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!existingUser) {
      return NextResponse.json(
        {
          data: null,
          message: "User Not Found",
        },
        { status: 404 }
      );
    }
    const deletedUser = await db.user.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(safeUser(deletedUser));
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to Delete User",
      },
      { status: 500 }
    );
  }
}
export async function PUT(request, { params: { id } }) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;
    const { status, emailVerified } = await request.json();
    const existingUser = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!existingUser) {
      return NextResponse.json(
        {
          data: null,
          message: `Not Found`,
        },
        { status: 404 }
      );
    }
    const updatedUser = await db.user.update({
      where: { id },
      data: { status, emailVerified },
    });
    return NextResponse.json(safeUser(updatedUser));
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
