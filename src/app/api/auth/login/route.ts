import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  // ✅ HARD-CODED LOGIN (for now)
  if (body.email === "admin" && body.password === "admin") {
    const fakeResponse = {
      accessToken: "secure-admin-token",
      user: {
        id: "1",
        name: "Admin",
        role: "admin",
      },
    };

    const res = NextResponse.json({ success: true, user: fakeResponse.user });

    // ✅ SECURE COOKIE (HttpOnly)
    res.cookies.set("accessToken", fakeResponse.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    res.cookies.set("authUser", JSON.stringify(fakeResponse.user), {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return res;
  }

  return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
}
