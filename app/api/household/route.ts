import connectToMongoDB from "@/lib/connection";
import HouseholdModel from "@/lib/models/households";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToMongoDB();
    const households = await HouseholdModel.find().exec();
    if (!households) {
      return NextResponse.json(
        { success: false, message: "No record found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Successfully loaded the data",
      data: households,
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