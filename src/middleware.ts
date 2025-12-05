import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken");

  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
  const isHomePage = request.nextUrl.pathname === "/";
  const isLoginPage = request.nextUrl.pathname === "/login";

  // If no session → redirect everything except login
  if (!token && (isDashboardRoute || isHomePage)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If logged in → block /logindpong
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/login",
  ],
};
