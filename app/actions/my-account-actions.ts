"use server";

import connectToMongoDB from "@/lib/connection";
import { User } from "../dashboard/my-account/page";
import UserModel from "@/lib/models/user";
import bcryptjs from "bcryptjs";
export async function editCredentials(formData: FormData) {
  try {
    await connectToMongoDB();
    const res = await UserModel.findById("67052e583b96536154d20171");
    if (!res) {
      return new Error("Can not find the current user");
    }

    // Hash the password if it exists in formData
    const password = formData.get("password");
    if (password) {
      const hashedPassword = await bcryptjs.hash(password as string, 10); // Hash the password
      formData.set("password", hashedPassword); // Update formData with hashed password
    }

    await UserModel.findByIdAndUpdate(
      "67052e583b96536154d20171", // User ID
      { $set: Object.fromEntries(formData) }, // Update data
      { new: true } // Return the updated document
    );
    return {
      success: true,
      message: "Successful update for this user",
    }; // Return the updated user
  } catch (error) {
    console.error(error);
  }
}

export async function addStaff(formData: FormData) {
  try {
    await connectToMongoDB();
    const userCount = await UserModel.countDocuments(); // Count the number of documents

    // Hash the password if it exists in formData
    const password = formData.get("password");
    if (password) {
      const hashedPassword = await bcryptjs.hash(password as string, 10); // Hash the password
      formData.set("password", hashedPassword); // Update formData with hashed password
    }

    const staffData = {
      ...Object.fromEntries(formData),
      role: userCount === 0 ? "admin" : formData.get("role") || "staff", // Set role based on user count
    };
    const staff = new UserModel(staffData);
    await staff.save();
  } catch (error) {}
  return { message: "Form submitted successfully" };
}

export async function updateUsers(id: string, data: User) {
  try {
    await connectToMongoDB();
    const user = await UserModel.findById(id); // Correctly find user by id
    if (!user) {
      // Check if user exists
      return new Error("User not found");
    }

    await UserModel.findByIdAndUpdate(
      id,
      { $set: data }, // Directly use data for update
      { new: true }
    );
    return { message: "User updated successfully" }; // Return success message and updated user
  } catch (error) {
    console.error(error); // Log the error
  }
  return { message: "Failed to update user" }; // Return failure message
}

export async function deleteUser(id: string) {
  console.log(id);
  try {
    await connectToMongoDB();
    const user = await UserModel.findById(id);
    if (!user) {
      return { message: "User not found" }; // Return a message instead of an Error object
    }
    await UserModel.findByIdAndDelete(id);
    return { message: "User deleted successfully" }; // Return success message
  } catch (error) {
    console.error(error); // Log the error
    return { message: "Failed to delete user" }; // Return failure message
  }
}
