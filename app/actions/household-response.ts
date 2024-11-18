// file: app/actions/household-response.ts
"use server";

import connectToMongoDB from "@/lib/connection";
import HouseholdModel, { HouseholdType } from "@/lib/models/households";

export async function createHousehold(data: HouseholdType) {
  try {
    console.log(data);
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

export async function updateHousehold(data: HouseholdType) {
  try {
    await connectToMongoDB();
    const { _id, ...updateData } = data;
    if (!_id) {
      throw new Error("Household ID is required for updating");
    }

    const updatedHousehold = await HouseholdModel.findByIdAndUpdate(
      _id,
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

export async function deleteHousehold(id: string | undefined) {
  try {
    await connectToMongoDB();
    if (!id) {
      throw new Error("Household ID is required for deleting");
    }

    const deleteRecord = await HouseholdModel.findByIdAndDelete(id);

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
