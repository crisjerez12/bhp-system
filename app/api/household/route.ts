import connectToMongoDB from "@/lib/connection";
import HouseholdModel from "@/lib/models/households";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToMongoDB();
    const households = await HouseholdModel.find().exec();

    return NextResponse.json(households);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to export households" },
      { status: 500 }
    );
  }
}
