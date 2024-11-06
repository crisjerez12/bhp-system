import connectToMongoDB from "@/lib/connection";
import SeniorCitizenModel from "@/lib/models/senior-citizen";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToMongoDB();
    const seniorCitizens = await SeniorCitizenModel.find().exec();
    if (!seniorCitizens) {
      return NextResponse.json(
        { success: false, message: "No record found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Successfully loaded the data",
      data: seniorCitizens,
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
