import { Model, Document } from "mongoose";
import { NextResponse } from "next/server";
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

async function getTotalCount(model: Model<Document>): Promise<number> {
  return await model.countDocuments();
}

async function getMonthlyCount(
  model: Model<Document>
): Promise<Record<string, number>> {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); // Get data for last 6 months

  const result: MonthlyCountResult[] = await model.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo },
      },
    },
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
    { $sort: { year: -1, month: -1 } },
  ]);

  const monthlyCount: Record<string, number> = {};
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ] as const;

  const currentDate = new Date();
  for (let i = 0; i < 6; i++) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    const monthName = months[date.getMonth()];
    const matchingResult = result.find(
      (item: MonthlyCountResult) =>
        item.year === date.getFullYear() && item.month === date.getMonth() + 1
    );
    monthlyCount[monthName] = matchingResult ? matchingResult.count : 0;
  }

  return monthlyCount;
}

export async function GET() {
  try {
    await connectToMongoDB();

    const [
      householdsCount,
      pregnantsCount,
      seniorCitizensCount,
      familyPlanningsCount,
      householdsMonthly,
      pregnantsMonthly,
      seniorCitizensMonthly,
      familyPlanningsMonthly,
    ] = await Promise.all([
      getTotalCount(HouseholdModel),
      getTotalCount(PregnantModel),
      getTotalCount(SeniorCitizen),
      getTotalCount(FamilyPlanning),
      getMonthlyCount(HouseholdModel),
      getMonthlyCount(PregnantModel),
      getMonthlyCount(SeniorCitizen),
      getMonthlyCount(FamilyPlanning),
    ]);

    const totalProfiles =
      householdsCount +
      pregnantsCount +
      seniorCitizensCount +
      familyPlanningsCount;

    const monthlyResponse: Record<string, number> = {};
    Object.keys(householdsMonthly).forEach((month) => {
      monthlyResponse[month] =
        (householdsMonthly[month] || 0) +
        (pregnantsMonthly[month] || 0) +
        (seniorCitizensMonthly[month] || 0) +
        (familyPlanningsMonthly[month] || 0);
    });

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
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to retrieve document counts" },
      { status: 500 }
    );
  }
}
