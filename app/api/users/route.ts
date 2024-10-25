import connectToMongoDB from "@/lib/connection";
import UserModel from "@/lib/models/user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToMongoDB();
    const users = await UserModel.find().exec();

    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to export users" },
      { status: 500 }
    );
  }
}
