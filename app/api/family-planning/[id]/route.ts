import connectToMongoDB from "@/lib/connection";
import FamilyPlanningModel from "@/lib/models/family-planning";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await connectToMongoDB();

    const FamilyPlanningId = request.nextUrl.pathname.split("/").pop();

    if (!FamilyPlanningId) {
      return NextResponse.json(
        { success: true, message: "FamilyPlanning ID is required" },
        { status: 400 }
      );
    }

    const familyPlanningResponse = await FamilyPlanningModel.findOne({
      _id: FamilyPlanningId,
    });
    if (!familyPlanningResponse) {
      return NextResponse.json(
        { success: false, message: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully fetched a record",
      data: familyPlanningResponse,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
