import connectToMongoDB from "@/lib/connection";
import PregnantModel from "@/lib/models/pregnant";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToMongoDB();
    const pregnant = await PregnantModel.find().exec();
    if (!pregnant) {
      return NextResponse.json(
        { success: false, message: "No record found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Successfully loaded the data",
      data: pregnant,
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
