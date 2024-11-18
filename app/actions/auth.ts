"use server";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import UserModel, { IUser } from "@/lib/models/user";
import connectToMongoDB from "@/lib/connection";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }).trim(),
  password: z.string().min(1, { message: "Password is required" }).trim(),
});

export async function Login(formData: FormData) {
  try {
    await connectToMongoDB();
    const result = loginSchema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
      const errorMessages = result.error.issues.map((issue) => issue.message);
      return {
        success: false,
        message: errorMessages.join(", "),
      };
    }

    const { username, password } = result.data;
    const user: IUser | null = await UserModel.findOne({ username });

    if (!user) {
      return {
        success: false,
        message: "Invalid username or password",
      };
    }
    const passwordMatch = await bcrypt.compare(password, user.password || "");
    if (!passwordMatch) {
      return {
        success: false,
        message: "Invalid username or password",
      };
    }
    cookies().set(
      "user",
      JSON.stringify({
        id: user._id,
        username: user.username,
        role: user.role,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      }
    );
    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((issue) => issue.message);
      return {
        success: false,
        message: errorMessages.join(", "),
      };
    } else {
      return {
        success: false,
        message: "An unexpected error occurred",
      };
    }
  }
}
