import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    /*
    code,
      contactPerson,
      contactPersonPhone,
      email,
      name,
      notes,
      phone,
      physicalAddress,
      terms,
      isActive,
      profileImageUrl,
      products,
      landSize,
      mainCrop,
      userId */
    // Update the Verification in the user
    const vendorData = await request.json();
    //Check if the user Already exists in the db
    const existingUser = await db.user.findUnique({
      where: {
        id: vendorData.userId,
      },
    });
    if (!existingUser) {
      return NextResponse.json(
        {
          data: null,
          message: `No User Found`,
        },
        { status: 404 }
      );
    }
    //Update emailVerified
    const updatedUser = await db.user.update({
      where: {
        id: vendorData.userId,
      },
      data: {
        emailVerified: true,
      },
    });
    const newVendorProfile = await db.vendorProfile.create({
      data: {
        code: vendorData.code,
        contactPerson: vendorData.contactPerson,
        contactPersonPhone: vendorData.contactPersonPhone,
        profileImageUrl: vendorData.profileImageUrl,
        email: vendorData.email,
        name: vendorData.name,
        notes: vendorData.notes,
        phone: vendorData.phone,
        physicalAddress: vendorData.physicalAddress,
        terms: vendorData.terms,
        isActive: vendorData.isActive,
        products: vendorData.products,
        shopSize: parseFloat(vendorData.shopSize),
        mainCrop: vendorData.mainProduct,
        userId: vendorData.userId,
      },
    });
    console.log(newVendorProfile);
    return NextResponse.json(newVendorProfile);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to create Vendor",
        error,
      },
      { status: 500 }
    );
  }
}

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
        vendorProfile: true,
      },
    });
    return NextResponse.json(vendors);
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