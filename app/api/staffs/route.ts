import connectToMongoDB from "@/lib/connection";
import UserModel from "@/lib/models/user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToMongoDB();
    const users = await UserModel.find().exec();
    if (!users) {
      return NextResponse.json(
        { success: false, message: "No users found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Successfully loaded the data",
      data: users,
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
export const dynamic = "force-dynamic";
