"use server";

import connectToMongoDB from "@/lib/connection";
import HouseholdModel, { HouseholdType } from "@/lib/models/households";
type UpdateHouseholdType = HouseholdType & { id: string };
export async function createHousehold(data: HouseholdType) {
  try {
    await connectToMongoDB();
    const household = new HouseholdModel(data);
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

export async function updateHousehold(data: UpdateHouseholdType) {
  try {
    await connectToMongoDB();
    const { id, ...updateData } = data;
    if (!id) {
      throw new Error("Household ID is required for updating");
    }

    const updatedHousehold = await HouseholdModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (updatedHousehold) {
      return {
        success: true,
        message: "Household updated successfully",
      };
    } else {
      return {
        success: false,
        message: "Household not found or update failed",
      };
    }
  } catch (error) {
    console.error("Error updating household:", error);
    return {
      success: false,
      message: "Error updating household",
      error: (error as Error).message || "Unknown error",
    };
  }
}
export async function deleteHousehold(id: string) {
  try {
    await connectToMongoDB();
    if (!id) {
      throw new Error("Household ID is required for updating");
    }

    const deleteRecord = await HouseholdModel.findByIdAndDelete(id, {
      new: true,
      runValidators: true,
    });

    if (deleteRecord) {
      return {
        success: true,
        message: "Household deleted successfully",
      };
    } else {
      return {
        success: false,
        message: "Household not found or delete failed",
      };
    }
  } catch (error) {
    console.error("Error deleting household:", error);
    return {
      success: false,
      message: "Error deleting household",
      error: (error as Error).message || "Unknown error",
    };
  }
}
