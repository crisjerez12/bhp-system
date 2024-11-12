"use server";

import connectToMongoDB from "@/lib/connection";
import { calculateAge, capitalizeName } from "@/lib/Functions";
import PregnantModel from "@/lib/models/pregnant";
import { IPregnant } from "@/lib/models/pregnant";

export async function submitMotherInfo(formData: FormData) {
  try {
    await connectToMongoDB();
    const birthDate = new Date(formData.get("birthDate") as string);

    const pregnantResponse: Partial<IPregnant> = {
      firstName: capitalizeName(formData.get("firstName") as string),
      lastName: capitalizeName(formData.get("lastName") as string),
      birthDate: birthDate,
      age: calculateAge(birthDate),
      takingFerrous: Boolean(formData.get("takingFerrous")),
      weight: parseFloat(formData.get("weight") as string),
      systolic: parseInt(formData.get("systolic") as string),
      diastolic: parseInt(formData.get("diastolic") as string),
      months: parseInt(formData.get("months") as string),
      weeks: parseInt(formData.get("weeks") as string),
      assignedStaff: formData.get("assignedStaff") as string,
      address: formData.get("address") as string,
    };
    const duplicateInfo = await PregnantModel.findOne({
      firstName: pregnantResponse.firstName,
      lastName: pregnantResponse.lastName,
    });
    if (duplicateInfo) {
      throw new Error("Duplicate records found");
    }
    const data = new PregnantModel(pregnantResponse);
    const savedData = await data.save();
    if (!savedData) {
      throw new Error("Data aren't saved");
    }
    return { success: true, message: "Successfully Recorded" };
  } catch (error) {
    return {
      success: false,
      message: "Error creating Pregnant Info Record",
      error: (error as Error).message || "Unknown error",
    };
  }
}
export async function updateMotherInfo(formData: FormData) {
  try {
    await connectToMongoDB();
    const birthDate = new Date(formData.get("birthDate") as string);

    const pregnantData = {
      _id: formData.get("_id"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      address: formData.get("address"),
      takingFerrous: formData.get("takingFerrous"),
      weight: formData.get("weight"),
      systolic: formData.get("systolic"),
      diastolic: formData.get("diastolic"),
      months: formData.get("months"),
      weeks: formData.get("weeks"),
      age: calculateAge(birthDate),
      assignedStaff: formData.get("assignedStaff"),
    };
    if (!pregnantData._id) {
      throw new Error("_id is required for updating");
    }

    const updatedData = await PregnantModel.findByIdAndUpdate(
      pregnantData._id,
      pregnantData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedData) {
      throw new Error(
        `No document found with _id: ${pregnantData.firstName} ${pregnantData.lastName}`
      );
    }

    return { success: true, message: "Record successfully Updated" };
  } catch (error) {
    console.error("Error in updateMotherInfo:", error);
  }
}

export async function deletePregnantRecord(id: string) {
  try {
    await connectToMongoDB();
    if (!id) {
      throw new Error("PregnantRecord ID is required for updating");
    }

    const deleteRecord = await PregnantModel.findByIdAndDelete(id, {
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
    console.error("Error deleting Family Planning Record:", error);
    return {
      success: false,
      message: "Error deleting Family Planning Record",
      error: (error as Error).message || "Unknown error",
    };
  }
}
