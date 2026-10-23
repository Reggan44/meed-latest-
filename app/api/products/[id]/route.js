import db from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Admins/moderators may touch any product; owners only their own.
async function authorize(existing) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user) return false;
  if (user.role === "ADMIN" || user.role === "MODERATOR") return true;
  return existing.userId === user.id;
}


export async function GET(request, { params: { id } }) {
  try {
    const product = await db.product.findUnique({
      where: {
        id,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to Fetch Product",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params: { id } }) {
  try {
    const existingProduct = await db.product.findUnique({
      where: {
        id,
      },
    });
    if (!existingProduct) {
      return NextResponse.json(
        {
          data: null,
          message: "Product Not Found",
        },
        { status: 404 }
      );
    }
    if (!(await authorize(existingProduct))) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const deletedProduct = await db.product.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(deletedProduct);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to Delete Product",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params: { id } }) {
  try {
    const {
      barcode,
      categoryId,
      description,
      farmerId,
      imageUrl,
      isActive,
      isWholesale,
      productCode,
      productPrice,
      salePrice,
      sku,
      slug,
      tags,
      title,
      unit,
      wholesalePrice,
      wholesaleQty,
      productStock,
      qty,
      productImages,
    } = await request.json();
    const existingProduct = await db.product.findUnique({
      where: {
        id,
      },
    });
    if (!existingProduct) {
      return NextResponse.json(
        {
          data: null,
          message: `Not Found`,
        },
        { status: 404 }
      );
    }
    if (!(await authorize(existingProduct))) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const normalizedProductImages =
      Array.isArray(productImages) && productImages.length > 0
        ? productImages
        : existingProduct.productImages?.length > 0
        ? existingProduct.productImages
        : existingProduct.imageUrl
        ? [existingProduct.imageUrl]
        : [];

    const updatedProduct = await db.product.update({
      where: { id },
      data: {
        barcode,
        categoryId,
        description,
        userId: farmerId,
        productImages: normalizedProductImages,
        imageUrl: normalizedProductImages[0] ?? existingProduct.imageUrl,
        isActive,
        isWholesale,
        productCode,
        productPrice: parseFloat(productPrice),
        salePrice: parseFloat(salePrice),
        sku,
        slug,
        tags,
        title,
        unit,
        wholesalePrice: parseFloat(wholesalePrice),
        wholesaleQty: parseInt(wholesaleQty),
        productStock: parseInt(productStock),
        qty: parseInt(qty),
        // category: {
        //   connect: { id: categoryId },
        // },
        // user: {
        //   connect: { id: farmerId },
        // },
      },
    });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to Update Product",
      },
      { status: 500 }
    );
  }
}
