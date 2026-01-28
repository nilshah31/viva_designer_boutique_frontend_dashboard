import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jwt from "jsonwebtoken";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("accessToken");
  const refreshToken = request.cookies.get("refreshToken");

  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
  const isHomePage = request.nextUrl.pathname === "/";
  const isLoginPage = request.nextUrl.pathname === "/login";

  // If no session → redirect everything except login
  if (!token && (isDashboardRoute || isHomePage)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If logged in → block /login
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Check and refresh token if expired
  if (token && refreshToken) {
    try {
      // Decode without verification (just to check expiration)
      const decoded = jwt.decode(token.value) as any;

      if (decoded && decoded.exp) {
        const currentTime = Math.floor(Date.now() / 1000);

        // Token is expired, refresh it
        if (decoded.exp < currentTime) {
          console.log("Token expired, refreshing...");
          const refreshRes = await fetch(`${process.env.BACKEND_API_HOST}/auth/refresh`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token.value}`,
            },
            body: JSON.stringify({
              userId: decoded.sub,
              refreshToken: refreshToken.value,
            }),
          });

          console.log("Refresh response status:", refreshRes.status);
          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            const newAccessToken =
              refreshData.data?.accessToken || refreshData.accessToken;

            if (newAccessToken) {
              const response = NextResponse.next();
              response.cookies.set("accessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 15, // 15 minutes
                path: "/",
              });
              return response;
            }
          }
        }
      }
    } catch (error) {
      console.error("Token validation/refresh error:", error);
    }
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
