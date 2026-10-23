import db from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { timingSafeEqual } from "crypto";
import { hashToken } from "@/lib/resetToken";
import { rateLimit, clientIp } from "@/lib/rateLimit";

const invalid = () =>
  NextResponse.json(
    { message: "This reset link is invalid or has expired." },
    { status: 400 }
  );

export async function PUT(request) {
  try {
    if (!rateLimit(`reset:${clientIp(request)}`, 10, 15 * 60 * 1000).ok) {
      return NextResponse.json(
        { message: "Too many attempts. Please try again later." },
        { status: 429 }
      );
    }
    const { password, id, token } = await request.json();
    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }
    if (typeof id !== "string" || typeof token !== "string") return invalid();
    const user = await db.user.findUnique({ where: { id } }).catch(() => null);
    if (!user?.resetTokenHash || !user.resetTokenExpires) return invalid();
    if (user.resetTokenExpires < new Date()) return invalid();
    const a = Buffer.from(hashToken(token));
    const b = Buffer.from(user.resetTokenHash);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return invalid();

    await db.user.update({
      where: { id },
      data: {
        password: await bcrypt.hash(password, 10),
        resetTokenHash: null,
        resetTokenExpires: null,
      },
    });
    return NextResponse.json({ message: "Password updated" });
  } catch (error) {
    console.error("update-password failed:", error?.message);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
