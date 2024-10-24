"use server";

import connectToMongoDB from "@/lib/connection";
import Household, { HouseholdType } from "@/lib/models/households";

export async function createHousehold(data: HouseholdType) {
  try {
    await connectToMongoDB();
    const household = new Household(data);
    const res = await household.save();
    if (res) {
      return {
        success: true,
        message: "Household created successfully",
      };
    } else {
      return {
        success: false,
        message: "Household creation failed",
      };
    }
  } catch (error) {
    console.error("Error creating household:", error);
    return {
      success: false,
      message: "Error creating household",
      error: (error as Error).message || "Unknown error",
    };
  }
}
