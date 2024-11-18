"use server";

import connectToMongoDB from "@/lib/connection";
import UserModel, { IUser } from "@/lib/models/user";
import bcryptjs from "bcryptjs";
import { cookies } from "next/headers";

export async function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const userCookie = cookieStore.get("user");

    if (!userCookie) {
      throw new Error("User cookie not found");
    }

    const userId = JSON.parse(userCookie.value).id;

    await connectToMongoDB();
    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    return {
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      role: user.role,
    };
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
}

export async function editCredentials(formData: FormData) {
  try {
    await connectToMongoDB();
    const data = Object.fromEntries(formData);
    const user = await UserModel.findOne({ username: data.username });
    if (!user) {
      return { success: false, message: "Cannot find the current user" };
    }

    if (data.password) {
      data.password = await bcryptjs.hash(data.password as string, 10);
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { username: data.username },
      { $set: data },
      { new: true }
    );

    if (!updatedUser) {
      return { success: false, message: "Failed to update user" };
    }

    return {
      success: true,
      message: "Successfully updated user credentials",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while updating credentials",
    };
  }
}

export async function addStaff(formData: FormData) {
  try {
    await connectToMongoDB();
    const userCount = await UserModel.countDocuments();
    const username = formData.get("username") as string;

    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return {
        success: false,
        message: "Username already exists",
      };
    }

    const password = formData.get("password");
    if (password) {
      const hashedPassword = await bcryptjs.hash(password as string, 10);
      formData.set("password", hashedPassword);
    }

    const staffData = {
      ...Object.fromEntries(formData),
      role: userCount === 0 ? "admin" : formData.get("role") || "staff",
    };
    const staffToSave = new UserModel(staffData);
    await staffToSave.save();
    return {
      success: true,
      message: "Successfully Added",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to Add",
    };
  }
}

export async function updateUsers(id: string | undefined, data: IUser) {
  try {
    await connectToMongoDB();
    const user = await UserModel.findById(id);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    if (data.username !== user.username) {
      return { success: false, message: "Username already exists" };
    }
    data.password = await bcryptjs.hash(data.password as string, 10);
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
    if (!updatedUser) {
      throw new Error("Failed to update user");
    }
    return { success: true, message: "User updated successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update user" };
  }
}

export async function deleteUser(id: string) {
  try {
    await connectToMongoDB();
    const user = await UserModel.findById(id);
    if (!user) {
      return { success: false, message: "User not found" };
    }
    await UserModel.findByIdAndDelete(id);
    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to delete user" };
  }
}
