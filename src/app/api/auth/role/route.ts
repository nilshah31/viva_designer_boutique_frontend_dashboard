import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const role = cookieStore.get("role")?.value;

    console.log("📋 /api/auth/role - All cookies:", cookieStore.getAll().map(c => c.name));
    console.log("📋 /api/auth/role - Role cookie value:", role);

    if (!role) {
      console.log("❌ /api/auth/role - No role cookie found");
      return NextResponse.json(
        { success: false, role: null },
        { status: 200 }
      );
    }

    console.log("✅ /api/auth/role - Returning role:", role);
    return NextResponse.json({
      success: true,
      role,
    });
  } catch (error) {
    console.error("❌ /api/auth/role - Error:", error);
    return NextResponse.json(
      { success: false, role: null },
      { status: 200 }
    );
  }
}
