"use server";

import connectToMongoDB from "@/lib/connection";
import User from "@/lib/models/user";
import { z } from "zod";

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

    const user = await User.findOne({ username });
    if (!user) {
      return { success: false, error: "Invalid username or password" };
    }

    if (user.password !== password) {
      return { success: false, error: "Invalid username or password" };
    }

    return { success: true, userId: user._id.toString() };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An error occurred during login" };
  }
}
