import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get("customerId");
  console.log("customerId to fetch measurements for - ", customerId)
  
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const apiRes = await fetch(`${process.env.BACKEND_API_HOST}/measurements?customerId=${customerId}`, {
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
  
  // Build request body - only include non-empty measurement objects
  const requestBody: any = {
    customerId: body.customerId,
  };

  if (body.blouseTop && Object.keys(body.blouseTop).length > 0) {
    requestBody.blouseTop = body.blouseTop;
  }

  if (body.lehengaPant && Object.keys(body.lehengaPant).length > 0) {
    requestBody.lehengaPant = body.lehengaPant;
  }

  const apiRes = await fetch(`${process.env.BACKEND_API_HOST}/measurements/upsert`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
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
