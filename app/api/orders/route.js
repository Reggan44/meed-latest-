import db from "@/lib/db";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/authz";
import { SHIPPING_DAYS } from "@/lib/shipping";

function generateOrderNumber(length) {
  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let orderNumber = "";
  for (let i = 0; i < length; i++) {
    orderNumber += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return orderNumber;
}

export async function POST(request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { message: "Please log in to place an order" },
        { status: 401 }
      );
    }
    const { checkoutFormData, orderItems } = await request.json();
    const {
      city,
      country,
      email,
      firstName,
      lastName,
      phone,
      shippingCost,
      streetAddress,
      state,
      zip,
    } = checkoutFormData ?? {};

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return NextResponse.json({ message: "Your cart is empty" }, { status: 400 });
    }
    if (!(Number(shippingCost) in SHIPPING_DAYS)) {
      return NextResponse.json(
        { message: "Please choose a valid shipping option" },
        { status: 400 }
      );
    }

    // Prices, vendors and availability come from the database, never from the browser.
    const products = await db.product.findMany({
      where: { id: { in: orderItems.map((i) => String(i.id)) }, isActive: true },
    });
    const byId = new Map(products.map((p) => [p.id, p]));
    const lines = [];
    for (const item of orderItems) {
      const product = byId.get(String(item.id));
      const qty = parseInt(item.qty);
      if (!product || !(qty > 0)) {
        return NextResponse.json(
          { message: `"${item.title ?? "An item"}" is no longer available` },
          { status: 400 }
        );
      }
      if (product.productStock != null && product.productStock < qty) {
        return NextResponse.json(
          {
            message: `Insufficient stock for "${product.title}". Only ${product.productStock} left in stock.`,
          },
          { status: 400 }
        );
      }
      lines.push({ product, qty });
    }

    const result = await db.$transaction(async (prisma) => {
      const newOrder = await prisma.order.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          email,
          phone,
          streetAddress,
          city,
          country,
          state,
          zip,
          shippingCost: Number(shippingCost),
          paymentMethod: "IntaSend (M-Pesa / Card)",
          paymentProvider: "INTASEND",
          orderNumber: generateOrderNumber(8),
        },
      });

      await prisma.orderItem.createMany({
        data: lines.map(({ product, qty }) => ({
          productId: product.id,
          vendorId: product.userId,
          quantity: qty,
          price: product.salePrice,
          orderId: newOrder.id,
          imageUrl: product.imageUrl,
          title: product.title,
        })),
      });

      // NOTE: Sales are NOT recorded here anymore. They are created in lib/payments.js
      // only when payment confirmation succeeds (paymentStatus === "PAID").

      return newOrder;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to create Order" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const orders = await db.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        orderItems: true,
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to Fetch Orders",
      },
      { status: 500 }
    );
  }
}
