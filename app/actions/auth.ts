"use server";

import connectToMongoDB from "@/lib/connection";
import UserModel from "@/lib/models/user";
import { z } from "zod";
import bcryptjs from "bcryptjs";
const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
});

export async function loginAction(formData: z.infer<typeof loginSchema>) {
  const result = loginSchema.safeParse(formData);

  if (!result.success) {
    return { success: false, error: "Invalid form data" };
  }

  const { username, password } = result.data;
  console.log(username, password);
  try {
    await connectToMongoDB();

    const user = await UserModel.findOne({ username });
    if (!user) {
      return { success: false, error: "Invalid username or password" };
    }

    // Replace the direct comparison with bcryptjs
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, error: "Invalid username or password" };
    }

    return { success: true, userId: user._id.toString() };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An error occurred during login" };
  }
}
