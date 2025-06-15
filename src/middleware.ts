import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

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

  if (!token?.phone && !pathname.startsWith("/completeProfile")) {
    return NextResponse.redirect(new URL("/completeProfile", req.url));
  }

  if (token?.phone && pathname.startsWith("/completeProfile")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth|api/trpc).*)"],
};
