import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const apiRes = await fetch(`${process.env.BACKEND_API_HOST}/customers`, {
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

  const body = await req.json();
  
  const apiRes = await fetch(`${process.env.BACKEND_API_HOST}/customers`, {
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

export async function PUT(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const { id, ...updateData } = body;

  console.log("Updating customer with id:", id, "Data:", updateData);
  const apiRes = await fetch(`${process.env.BACKEND_API_HOST}/customers/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
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

  const body = await req.json();
  const { id } = body;

  const apiRes = await fetch(`${process.env.BACKEND_API_HOST}/customers/${id}`, {
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
