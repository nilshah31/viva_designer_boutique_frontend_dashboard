import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const apiRes = await fetch(`${process.env.BACKEND_API_HOST}/users`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    }
  });

  const data = await apiRes.json();
  
  if (!apiRes.ok) {
    return NextResponse.json(
      { success: false, error: data },
      { status: apiRes.status }
    );
  }

  return NextResponse.json({
    success: true,
    data,
  });
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Verify user has permission to manage users
  const decoded = jwt.decode(accessToken) as any;
  if (!decoded || decoded.role !== "admin") {
    return NextResponse.json(
      { success: false, error: "Forbidden: Only admins can create users" },
      { status: 403 }
    );
  }

  const body = await req.json();
  
  const apiRes = await fetch(`${process.env.BACKEND_API_HOST}/users`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await apiRes.json();
  
  if (!apiRes.ok) {
    return NextResponse.json(
      { success: false, error: data },
      { status: apiRes.status }
    );
  }

  return NextResponse.json({
    success: true,
    data,
  });
}

export async function DELETE(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Verify user has permission to manage users
  const decoded = jwt.decode(accessToken) as any;
  if (!decoded || decoded.role !== "admin") {
    return NextResponse.json(
      { success: false, error: "Forbidden: Only admins can delete users" },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { id } = body;

  const apiRes = await fetch(`${process.env.BACKEND_API_HOST}/users/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  });
  
  if (!apiRes.ok) {
    const data = await apiRes.json();

    return NextResponse.json(
      { success: false, error: data },
      { status: apiRes.status }
    );
  }

  return NextResponse.json({
    success: true,
    data: {},
  });
}
