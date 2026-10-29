import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import base64url from "base64url";
import { rateLimit, clientIp } from "@/lib/rateLimit";
import { getSessionUser, isAdmin, requireAdmin, safeUser } from "@/lib/authz";
export async function POST(request) {
  try {
    //extract the credentials
    if (!rateLimit(`register:${clientIp(request)}`, 10, 60 * 60 * 1000).ok) {
      return NextResponse.json(
        { message: "Too many sign-ups from this network. Try again later." },
        { status: 429 }
      );
    }
    const { name, email, password, role: requestedRole, storeName, phone, physicalAddress } =
      await request.json();
    if (
      typeof email !== "string" ||
      !/^\S+@\S+\.\S+$/.test(email) ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return NextResponse.json(
        { data: null, message: "A valid email and a password of at least 8 characters are required" },
        { status: 400 }
      );
    }
    // Public sign-up may only create shoppers or sellers; staff roles need an admin.
    const PUBLIC_ROLES = ["USER", "VENDOR"];
    const caller = await getSessionUser();
    const role = PUBLIC_ROLES.includes(requestedRole)
      ? requestedRole
      : isAdmin(caller) && ["ADMIN", "MODERATOR"].includes(requestedRole)
      ? requestedRole
      : "USER";
    //Check if the user Already exists in the db
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return NextResponse.json(
        {
          data: null,
          message: `User with this email ( ${email})  already exists in the Database`,
        },
        { status: 409 }
      );
    }
    // Encrypt the Password =>bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    // Generate a random UUID (version 4)
    const rawToken = uuidv4();
    // Encode the token using Base64 URL-safe format
    const token = base64url.encode(rawToken);
    // Create a User in the DB
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        verificationToken: token,
        ...(role === "VENDOR" && {
          sellerProfile: {
            create: {
              storeName: String(storeName || name || "").slice(0, 120),
              phone: String(phone || "").slice(0, 30),
              physicalAddress: String(physicalAddress || "").slice(0, 200),
            },
          },
        }),
      },
    });
    return NextResponse.json(
      {
        data: safeUser(newUser),
        message: "User Created Successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Server Error: Something went wrong",
      },
      { status: 500 }
    );
  }
}
export async function GET(request) {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    const safeUsers = users.map(
      ({ password, verificationToken, ...rest }) => rest
    );
    return NextResponse.json(safeUsers);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to Fetch Users",
      },
      { status: 500 }
    );
  }
}
