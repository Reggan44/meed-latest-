import { NextResponse } from "next/server";
import db from "@/lib/db";
import { randomBytes } from "crypto";
import { hashToken } from "@/lib/resetToken";
import { rateLimit, clientIp } from "@/lib/rateLimit";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-template";
export async function PUT(request) {
  const generic = NextResponse.json(
    { data: null, message: "If that email exists, a reset link has been sent." },
    { status: 200 }
  );
  try {
    const { email } = await request.json();
    if (typeof email !== "string" || !email) return generic;
    const ip = clientIp(request);
    if (
      !rateLimit(`forgot:ip:${ip}`, 5, 15 * 60 * 1000).ok ||
      !rateLimit(`forgot:email:${email.toLowerCase()}`, 3, 15 * 60 * 1000).ok
    ) {
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
    const existingUser = await db.user.findUnique({ where: { email } });
    if (!existingUser) return generic;

    // Only the hash is stored; the raw token exists only in the emailed link.
    const token = randomBytes(32).toString("hex");
    await db.user.update({
      where: { id: existingUser.id },
      data: {
        resetTokenHash: hashToken(token),
        resetTokenExpires: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://meedcollections.store";
    const fromAddress = process.env.EMAIL_FROM || "Meed Collections <orders@meedcollections.store>";
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: "Password Reset - Meed Collections",
      react: EmailTemplate({
        name: existingUser.name,
        redirectUrl: `${baseUrl}/reset-password?token=${token}&id=${existingUser.id}`,
        linkText: "Reset Password",
        description:
          "Click on the following link in order to reset your password. The link expires in 1 hour.",
        subject: "Password Reset - Meed Collections",
      }),
    });
    return generic;
  } catch (error) {
    console.error("forgot-password failed:", error?.message);
    return generic;
  }
}
