import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import UserModel from "@/lib/models/user";
import connectToMongoDB from "@/lib/connection";
import { z } from "zod";

const loginSchema = z.object({
  username: z
    .string()
    .min(6, { message: "Username must be at least 6 characters" })
    .trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

export async function POST(request: NextRequest) {
  try {
    await connectToMongoDB();

    const body = await request.json();
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Validation error: " +
            JSON.stringify(result.error.flatten().fieldErrors),
        },
        { status: 400 }
      );
    }

    const { username, password } = result.data;
    const user = await UserModel.findOne({ username });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect password",
        },
        { status: 401 }
      );
    }

    // For this example, we'll just send back a success message with user info
    // In a real application, you'd set up a session or JWT here
    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
