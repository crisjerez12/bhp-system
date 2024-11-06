import connectToMongoDB from "@/lib/connection";
import PregnantModel from "@/lib/models/pregnant";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await connectToMongoDB();
    const PregnantId = request.nextUrl.pathname.split("/").pop();

    if (!PregnantId) {
      return NextResponse.json(
        { success: true, message: "Pregnant ID is required" },
        { status: 400 }
      );
    }
    const PregnantResponse = await PregnantModel.findOne({
      _id: PregnantId,
    });
    if (!PregnantResponse) {
      return NextResponse.json(
        { success: false, message: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully Fetch",
      data: PregnantResponse,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
