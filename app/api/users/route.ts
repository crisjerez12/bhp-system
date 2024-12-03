import connectToMongoDB from "@/lib/connection";
import UserModel from "@/lib/models/user";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const timestamp = request.nextUrl.searchParams.get('t');
  
  try {
    await connectToMongoDB();
    const users = await UserModel.find();
    if (!users) {
      return NextResponse.json(
        { success: false, message: "No users found" },
        { 
          status: 404,
          headers: {
            'Cache-Control': 'no-store',
          }
        }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Successfully loaded the data",
      data: users,
      timestamp
    }, {
      headers: {
        'Cache-Control': 'no-store',
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error,
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store',
        }
      }
    );
  }
}
