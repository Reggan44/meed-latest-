import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Resources any signed-in user may create/update (onboarding, profile).
const AUTHENTICATED_RESOURCES = ["vendors", "customers"];
// Resources restricted to back-office roles for writes.
const STAFF_RESOURCES = [
  "products",
  "categories",
  "banners",
  "coupons",
  "staffs",
  "sales",
];
// Shop-wide shopper/staff data: listing it requires a back-office login.
const PRIVATE_LISTS = [
  "users",
  "customers",
  "vendors",
  "staffs",
  "sales",
  "orders",
];
// Catalogue resources only admins/moderators may change (they are shared by all sellers).
const ADMIN_ONLY_WRITES = ["categories", "banners", "staffs"];
const STAFF_ROLES = ["ADMIN", "MODERATOR", "VENDOR"];

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const isWriteEarly = !["GET", "HEAD", "OPTIONS"].includes(req.method);
  const segments = pathname.split("/").filter(Boolean);
  const isPrivateList =
    segments[0] === "api" && segments.length === 2 && PRIVATE_LISTS.includes(segments[1]);
  if (!pathname.startsWith("/dashboard") && !isWriteEarly && !isPrivateList) {
    return NextResponse.next();
  }
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // API writes
  const isWrite = !["GET", "HEAD", "OPTIONS"].includes(req.method);
  if (!isWrite) {
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (!STAFF_ROLES.includes(token.role))
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    return NextResponse.next();
  }

  const resource = pathname.split("/")[2];
  const deny = (status, message) =>
    NextResponse.json({ message }, { status });

  if (pathname.startsWith("/api/uploadthing")) {
    // Callbacks from UploadThing's servers carry no cookie; they are
    // verified by UploadThing's own HMAC signature. Browser upload requests
    // are authorised in the file router (core.js).
    return NextResponse.next();
  }
  if (STAFF_RESOURCES.includes(resource)) {
    if (!token) return deny(401, "Unauthorized");
    if (!STAFF_ROLES.includes(token.role)) return deny(403, "Forbidden");
    if (
      ADMIN_ONLY_WRITES.includes(resource) &&
      !["ADMIN", "MODERATOR"].includes(token.role)
    )
      return deny(403, "Forbidden");
  } else if (AUTHENTICATED_RESOURCES.includes(resource) && !token) {
    return deny(401, "Unauthorized");
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
