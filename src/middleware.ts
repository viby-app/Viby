import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  const isAuth = !!token;
  const isProfileComplete = !!token?.phone;

  const isLoginPage = pathname === "/login";
  const isProfilePage = pathname.startsWith("/loginFlow/completeProfile");

  if (!isAuth && !isLoginPage && !pathname.startsWith("/api/auth")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuth && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isAuth && !isProfileComplete && !isProfilePage) {
    return NextResponse.redirect(new URL("/loginFlow/completeProfile", req.url));
  }

  if (isAuth && isProfileComplete && isProfilePage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth|api/trpc).*)"],
};
