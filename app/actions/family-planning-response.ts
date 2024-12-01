"use server";

import { z } from "zod";
import connectToMongoDB from "@/lib/connection";
import { calculateAge, capitalizeName } from "@/lib/Functions";
import FamilyPlanningModel, {
  IFamilyPlanning,
} from "@/lib/models/family-planning";
import { revalidatePath } from "next/cache";

const FamilyPlanningSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  controlType: z.string().min(1, "Control type is required"),
  birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  assignedStaff: z.string().min(1, "Assigned staff is required"),
});

export async function submitFamilyPlanningInfo(formData: FormData) {
  try {
    await connectToMongoDB();

    const rawFormData = Object.fromEntries(formData.entries());
    const validatedData = FamilyPlanningSchema.parse(rawFormData);

    const birthDate = new Date(validatedData.birthDate);

    const familyPlanningData: IFamilyPlanning = {
      firstName: capitalizeName(validatedData.firstName),
      lastName: capitalizeName(validatedData.lastName),
      address: validatedData.address,
      controlType: validatedData.controlType,
      birthDate: birthDate,
      age: calculateAge(birthDate),
      assignedStaff: validatedData.assignedStaff,
    };

    const duplicateInfo = await FamilyPlanningModel.findOne({
      firstName: familyPlanningData.firstName,
      lastName: familyPlanningData.lastName,
    });
    if (duplicateInfo) {
      return { error: "Duplicate records found" };
    }

    const data = new FamilyPlanningModel(familyPlanningData);
    await data.save();
    revalidatePath("/dashboard");

    return { success: true, message: "Form submitted successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors[0]?.message || "Validation error";
      return { error: errorMessage };
    }
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function updateFamilyPlanningInfo(formData: FormData) {
  try {
    await connectToMongoDB();

    const rawFormData = Object.fromEntries(formData.entries());
    const validatedData = FamilyPlanningSchema.parse(rawFormData);

    const birthDate = new Date(validatedData.birthDate);
    const id = formData.get("_id") as string;

    if (!id) {
      return { error: "Record ID is required for updating" };
    }

    const familyPlanningData: IFamilyPlanning = {
      firstName: capitalizeName(validatedData.firstName),
      lastName: capitalizeName(validatedData.lastName),
      address: validatedData.address,
      age: calculateAge(birthDate),
      controlType: validatedData.controlType,
      birthDate: birthDate,
      assignedStaff: validatedData.assignedStaff,
    };

    if (familyPlanningData.age < 1 || familyPlanningData.age > 200) {
      return { error: "Age is Invalid" };
    }

    const record = await FamilyPlanningModel.findById(id);
    if (!record) {
      return { error: "No record found" };
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
      return { error: "Failed to Update the Record" };
    }
    revalidatePath("/dashboard");

    return { success: true, message: "Record Updated Successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors[0]?.message || "Validation error";
      return { error: errorMessage };
    }
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function deleteFamilyPlanningRecord(id: string | undefined) {
  try {
    await connectToMongoDB();
    if (!id) {
      return { error: "FamilyPlanningRecord ID is required for deleting" };
    }

    const deleteRecord = await FamilyPlanningModel.findByIdAndDelete(id);
    if (!deleteRecord) {
      return { error: "Record not found or delete failed" };
    }
    revalidatePath("/dashboard");

    return { success: true, message: "Record deleted successfully" };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
