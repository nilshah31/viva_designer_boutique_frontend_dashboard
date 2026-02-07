import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, user: null },
        { status: 200 }
      );
    }

    // Decode the JWT to extract user info (without verification since we trust our own server)
    const decoded = jwt.decode(accessToken) as any;

    if (!decoded) {
      return NextResponse.json(
        { success: false, user: null },
        { status: 200 }
      );
    }

    // Extract user info from token
    const user = {
      id: decoded.sub,
      username: decoded.username,
      role: decoded.role,
    };

    console.log("✅ /api/auth/user - Returning user:", user);

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("❌ /api/auth/user - Error:", error);
    return NextResponse.json(
      { success: false, user: null },
      { status: 200 }
    );
  }
}
