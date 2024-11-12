"use server";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import UserModel from "@/lib/models/user";
import connectToMongoDB from "@/lib/connection";
import { z } from "zod";
import { redirect } from "next/navigation";

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

export async function Login(formData: FormData) {
  await connectToMongoDB();
  const result = loginSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return {
      success: false,
      message:
        "Validation error: " +
        JSON.stringify(result.error.flatten().fieldErrors),
    };
  }
  const { username, password } = result.data;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return {
      success: false,
      message: "Incorrect password",
    };
  }
  // Set a cookie with the user information
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
  redirect("/dashboard/");
}
