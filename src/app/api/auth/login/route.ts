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

    console.log("apiRes", apiRes.body);

    if (!apiRes.ok) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const data = await apiRes.json();
    const { accessToken, refreshToken } = data;

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

    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
