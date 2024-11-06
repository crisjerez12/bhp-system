"use server";

import connectToMongoDB from "@/lib/connection";
import connectToDatabase from "@/lib/connection";
import SeniorCitizenModel, {
  ISeniorCitizen,
} from "@/lib/models/senior-citizen";

export async function createSeniorCitizen(formData: FormData) {
  try {
    await connectToDatabase();
    const seniorResponse = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      birthDate: formData.get("birthDate"),
      age: formData.get("age"),
      weight: formData.get("weight"),
      systolic: formData.get("systolic"),
      diastolic: formData.get("diastolic"),
      assignedStaff: formData.get("assignedStaff"),
      address: formData.get("address"),
      medicines: formData.getAll("medicines[]"),
    };
    const seniorCitizen = new SeniorCitizenModel(seniorResponse);

    await seniorCitizen.save();

    return { success: true, message: "Senior Citizen created successfully!" };
  } catch (error) {
    console.error("Error creating Senior Citizen:", error);
    return { success: false, message: "Failed to create Senior Citizen" };
  }
}
export async function updateSeniorCitizenRecord(data: ISeniorCitizen) {
  await connectToDatabase();

  const { _id, ...updateData } = data;
  if (!_id) {
    throw new Error("Household ID is required for updating");
  }

  const updatedHousehold = await SeniorCitizenModel.findByIdAndUpdate(
    _id,
    updateData,
    { new: true, runValidators: true }
  );
  if (!updatedHousehold) {
    throw new Error("failed to update the record");
  }
  return {
    success: true,
    message: "Successfully Updated the record",
  };
}
export async function deleteSeniorCitizenRecord(id: string) {
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
    console.error("Error deleting Senior Citizen Record:", error);
    return {
      success: false,
      message: "Error deleting Senior Citizen Record",
      error: (error as Error).message || "Unknown error",
    };
  }
}
