import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  if (
    !token &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/api/auth")
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
