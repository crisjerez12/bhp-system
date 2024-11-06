"use server";

import connectToMongoDB from "@/lib/connection";
import FamilyPlanningModel from "@/lib/models/family-planning";

function calculateAge(birthDate: Date): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function capitalizeName(name: string): string {
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function submitFamilyPlanningInfo(formData: FormData) {
  try {
    await connectToMongoDB();

    const birthDate = new Date(formData.get("birthDate") as string);

    const familyPlanningData = {
      firstName: capitalizeName(formData.get("firstName") as string),
      lastName: capitalizeName(formData.get("lastName") as string),
      address: formData.get("address") as string,
      controlType: formData.get("controlType") as string,
      birthDate: birthDate,
      age: calculateAge(birthDate),
      assignedStaff: formData.get("assignedStaff") as string,
    };

    const duplicateInfo = await FamilyPlanningModel.findOne({
      firstName: familyPlanningData.firstName,
      lastName: familyPlanningData.lastName,
    });
    if (duplicateInfo) {
      throw new Error("Duplicate records found");
    }

    const data = new FamilyPlanningModel(familyPlanningData);
    await data.save();
    return { success: true, message: "Form submitted successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: (error as Error).message };
  }
}

export async function updateFamilyPlanningInfo(formData: FormData) {
  try {
    await connectToMongoDB();

    const birthDate = new Date(formData.get("birthDate") as string);
    const id = formData.get("_id") as string;

    const familyPlanningData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      address: formData.get("address") as string,
      age: calculateAge(birthDate),
      controlType: formData.get("controlType") as string,
      birthDate: new Date(formData.get("birthDate") as string),
      assignedStaff: formData.get("assignedStaff") as string,
    };
    const record = await FamilyPlanningModel.findById(id);
    if (!record) {
      return new Error("No record found");
    }
    const toSave = await FamilyPlanningModel.findByIdAndUpdate(
      id,
      familyPlanningData,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!toSave) {
      return new Error("Failed to Update the Record");
    }
    return { success: true, message: "Record Updated Successfully" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function deleteFamilyPlanningRecord(id: string) {
  try {
    await connectToMongoDB();
    if (!id) {
      throw new Error("FamilyPlanningRecord ID is required for updating");
    }

    const deleteRecord = await FamilyPlanningModel.findByIdAndDelete(id);
    if (!deleteRecord) {
      return new Error("Record not found or delete failed");
    }

    return {
      success: true,
      message: "Record deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "Unknown error",
    };
  }
}
