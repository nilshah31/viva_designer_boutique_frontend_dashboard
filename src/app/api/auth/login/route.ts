import { NextResponse } from "next/server";
import * as jwt from "jsonwebtoken"

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const apiRes = await fetch(`${process.env.BACKEND_API_HOST}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: body.email,
        password: body.password,
      }),
    });

    if (!apiRes.ok) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const data = await apiRes.json();
    const { accessToken, refreshToken } = data;

    // Decode token to extract role
    const decoded = jwt.decode(accessToken) as any;
    const role = decoded?.role || "tailor";

    console.log("🔐 Login - Decoded JWT:", { username: decoded?.username, role: decoded?.role, sub: decoded?.sub });
    console.log("🔐 Login - Setting role cookie:", role);

    const res = NextResponse.json({ success: true });

    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    // Store role in NON-httpOnly cookie so frontend can read it
    // (role is not sensitive - it's already in the JWT payload)
    res.cookies.set("role", role, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
