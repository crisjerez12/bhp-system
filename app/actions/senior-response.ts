"use server";

import connectToMongoDB from "@/lib/connection";
import connectToDatabase from "@/lib/connection";
import { calculateAge } from "@/lib/Functions";
import SeniorCitizenModel from "@/lib/models/senior-citizen";

export async function createSeniorCitizen(formData: FormData) {
  try {
    await connectToDatabase();
    const birthDate = new Date(formData.get("birthDate") as string);

    const seniorResponse = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      birthDate: birthDate,
      age: calculateAge(birthDate),
      weight: formData.get("weight"),
      systolic: formData.get("systolic"),
      diastolic: formData.get("diastolic"),
      assignedStaff: formData.get("assignedStaff"),
      address: formData.get("address"),
      medicines: formData.getAll("medicines[]"),
    };
    const duplicateInfo = await SeniorCitizenModel.findOne({
      firstName: seniorResponse.firstName,
      lastName: seniorResponse.lastName,
    });
    if (duplicateInfo) {
      throw new Error("Duplicate records found");
    }
    const seniorCitizen = new SeniorCitizenModel(seniorResponse);
    const savedData = await seniorCitizen.save();
    if (!savedData) {
      throw new Error("Data aren't saved");
    }
    return { success: true, message: "Senior Citizen created successfully!" };
  } catch (error) {
    return { success: false, message: "Failed to create Senior Citizen" };
  }
}
export async function updateSeniorCitizenRecord(formData: FormData) {
  try {
    await connectToDatabase();
    const _id = formData.get("_id");
    if (!_id) {
      throw new Error("Household ID is required for updating");
    }
    const birthDate = new Date(formData.get("birthDate") as string);
    const seniorResponse = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      birthDate: birthDate,
      age: calculateAge(birthDate),
      weight: formData.get("weight"),
      systolic: formData.get("systolic"),
      diastolic: formData.get("diastolic"),
      assignedStaff: formData.get("assignedStaff"),
      address: formData.get("address"),
      medicines: formData.getAll("medicines[]"),
    };

    const updatedHousehold = await SeniorCitizenModel.findByIdAndUpdate(
      _id,
      seniorResponse,
      { new: true, runValidators: true }
    );
    if (!updatedHousehold) {
      throw new Error("failed to update the record");
    }
    return {
      success: true,
      message: "Successfully Updated the record",
    };
  } catch (error) {
    return {
      sucess: false,
      message: "Update Failed",
    };
  }
}
export async function deleteSeniorCitizenRecord(id: string | undefined) {
  try {
    await connectToMongoDB();
    if (!id) {
      throw new Error("SeniorCitizenRecord ID is required for updating");
    }

    const deleteRecord = await SeniorCitizenModel.findByIdAndDelete(id, {
      new: true,
      runValidators: true,
    });

    if (deleteRecord) {
      return {
        success: true,
        message: "Record deleted successfully",
      };
    } else {
      return {
        success: false,
        message: "Record not found or delete failed",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Error deleting Senior Citizen Record",
      error: (error as Error).message || "Unknown error",
    };
  }
}
