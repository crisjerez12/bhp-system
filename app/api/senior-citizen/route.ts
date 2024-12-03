import connectToMongoDB from "@/lib/connection";
import SeniorCitizenModel from "@/lib/models/senior-citizen";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const timestamp = request.nextUrl.searchParams.get('t');
  
  try {
    await connectToMongoDB();
    const seniorCitizens = await SeniorCitizenModel.find();
    if (!seniorCitizens) {
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
      data: seniorCitizens,
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
