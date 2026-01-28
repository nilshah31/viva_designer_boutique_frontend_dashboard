import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get("customerId");
  console.log("customerIdcustomerIdcustomerId", customerId)
  const fakeResponse = {
    blouseTop: {
      blouseLength: 14,
      kurtaLength: 42,
      upperChest: 34,
      chest: 36,
      waist: 30,
      hip: 38,
      shoulder: 14,
      sleeveLength: 18,
      mori: 10,
      byshape: 12,
      armhole: 16,
      frontNeckDepth: 8,
      backNeckDepth: 10,
      dartPoint: 6,
    },

    lehengaPant: {
      length: 40,
      waist: 30,
      hip: 38,
      thigh: 22,
      knee: 16,
      ankle: 12,
      crotch: 14,
      mori: 11,
    },
  };

  return NextResponse.json({
    success: true,
    data: fakeResponse,
  });
}
