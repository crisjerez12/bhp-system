import connectToMongoDB from "@/lib/connection";
import FamilyPlanningModel from "@/lib/models/family-planning";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToMongoDB();
    const familyPlanning = await FamilyPlanningModel.find().exec();
    if (!familyPlanning) {
      return NextResponse.json(
        { success: false, message: "No record found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Successfully loaded the data",
      data: familyPlanning,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error,
      },
      { status: 500 }
    );
  }
}
