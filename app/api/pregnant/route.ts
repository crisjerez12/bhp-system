import connectToMongoDB from "@/lib/connection";
import PregnantModel from "@/lib/models/pregnant";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const timestamp = request.nextUrl.searchParams.get('t');
  
  try {
    await connectToMongoDB();
    const pregnant = await PregnantModel.find();
    if (!pregnant) {
      return NextResponse.json(
        { success: false, message: "No record found" },
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
      data: pregnant,
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
