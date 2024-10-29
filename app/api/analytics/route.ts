import connectToMongoDB from "@/lib/connection";
import FamilyPlanning from "@/lib/models/family-planning";
import HouseholdModel from "@/lib/models/households";
import PregnantModel from "@/lib/models/pregnant";
import SeniorCitizen from "@/lib/models/senior-citizen";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToMongoDB();
    const householdsCount = await HouseholdModel.countDocuments();
    const pregnantsCount = await PregnantModel.countDocuments();
    const seniorCitizenCount = await SeniorCitizen.countDocuments();
    const familyPlanningCount = await FamilyPlanning.countDocuments();

    return NextResponse.json({
      householdsCount,
      pregnantsCount,
      seniorCitizenCount,
      familyPlanningCount,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to export households" },
      { status: 500 }
    );
  }
}
