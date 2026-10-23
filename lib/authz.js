import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";

const ADMIN_ROLES = ["ADMIN", "MODERATOR"];

export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

export const isAdmin = (user) => !!user && ADMIN_ROLES.includes(user.role);

export const unauthorized = () =>
  NextResponse.json({ message: "Unauthorized" }, { status: 401 });
export const forbidden = () =>
  NextResponse.json({ message: "Forbidden" }, { status: 403 });

// Returns a NextResponse when access is denied, otherwise null.
// Allowed: admins/moderators, or the user whose id equals ownerId.
export async function requireOwnerOrAdmin(ownerId) {
  const user = await getSessionUser();
  if (!user) return unauthorized();
  if (isAdmin(user) || (ownerId && String(ownerId) === user.id)) return null;
  return forbidden();
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user) return unauthorized();
  return isAdmin(user) ? null : forbidden();
}

// Removes credential fields before a user record is sent to the browser.
export function safeUser(user) {
  if (!user) return user;
  const { password, verificationToken, resetTokenHash, resetTokenExpires, ...rest } = user;
  return rest;
}
