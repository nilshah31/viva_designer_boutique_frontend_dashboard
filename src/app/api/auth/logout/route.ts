import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  res.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
  res.cookies.set("authUser", "", { maxAge: 0, path: "/" });

  return res;
}
