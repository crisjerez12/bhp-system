import connectToMongoDB from "@/lib/connection";
import HouseholdModel from "@/lib/models/households";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await connectToMongoDB();

    const householdId = request.nextUrl.pathname.split("/").pop();

    if (!householdId) {
      return NextResponse.json(
        { success: true, message: "household ID is required" },
        { status: 400 }
      );
    }

    const household = await HouseholdModel.findOne({ _id: householdId });

    if (!household) {
      return NextResponse.json(
        { success: false, message: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully fetched a record",
      data: household,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
