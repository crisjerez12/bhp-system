import { Model, Document } from "mongoose";
import { NextResponse, NextRequest } from "next/server";
import connectToMongoDB from "@/lib/connection";
import HouseholdModel from "@/lib/models/households";
import PregnantModel from "@/lib/models/pregnant";
import SeniorCitizen from "@/lib/models/senior-citizen";
import FamilyPlanning from "@/lib/models/family-planning";

interface MonthlyCountResult {
  year: number;
  month: number;
  count: number;
}

async function getMonthlyCount(model: Model<Document>): Promise<MonthlyCountResult[]> {
  const result = await model.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        count: 1,
      },
    },
    {
      $sort: { year: 1, month: 1 },
    },
  ]);

  return result;
}

export async function GET(request: NextRequest) {
  const timestamp = request.nextUrl.searchParams.get('t');
  
  try {
    await connectToMongoDB();

    const [
      householdsCount,
      pregnantsCount,
      seniorCitizensCount,
      familyPlanningsCount,
      monthlyResponse,
    ] = await Promise.all([
      HouseholdModel.countDocuments(),
      PregnantModel.countDocuments(),
      SeniorCitizen.countDocuments(),
      FamilyPlanning.countDocuments(),
      getMonthlyCount(HouseholdModel),
    ]);

    const totalProfiles =
      householdsCount +
      pregnantsCount +
      seniorCitizensCount +
      familyPlanningsCount;

    return NextResponse.json({
      success: true,
      message: "Successfully retrieved document counts",
      totalProfiles,
      data: {
        households: householdsCount,
        pregnants: pregnantsCount,
        seniorCitizens: seniorCitizensCount,
        familyPlannings: familyPlanningsCount,
        monthlyResponse,
      },
      timestamp
    }, {
      headers: {
        'Cache-Control': 'no-store',
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to retrieve document counts" },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store',
        }
      }
    );
  }
}
