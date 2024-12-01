"use server";

import bcrypt from "bcryptjs";
import UserModel, { IUser } from "@/lib/models/user";
import connectToMongoDB from "@/lib/connection";
import { z } from "zod";
import { createSession, deleteSession } from "@/lib/session";

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }).trim(),
  password: z.string().min(1, { message: "Password is required" }).trim(),
});

export async function login(formData: FormData) {
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

    await createSession(user?._id?.toString() || "", user?.role || "");

    return {
      success: true,
      role: user.role,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

export async function logout() {
  await deleteSession();
  return { success: true };
}
