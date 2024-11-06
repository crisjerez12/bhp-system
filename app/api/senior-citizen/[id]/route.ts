import connectToMongoDB from "@/lib/connection";
import SeniorCitizenModel from "@/lib/models/senior-citizen";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await connectToMongoDB();

    const seniorCitizenId = request.nextUrl.pathname.split("/").pop();

    if (!seniorCitizenId) {
      return NextResponse.json(
        { success: true, message: "seniorCitizen ID is required" },
        { status: 400 }
      );
    }

    const seniorCitizenResponse = await SeniorCitizenModel.findOne({
      _id: seniorCitizenId,
    });
    if (!seniorCitizenResponse) {
      return NextResponse.json(
        { success: false, message: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully fetched a record",
      data: seniorCitizenResponse,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
