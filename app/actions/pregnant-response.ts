"use server";

import { z } from "zod";
import connectToMongoDB from "@/lib/connection";
import { calculateAge, capitalizeName } from "@/lib/Functions";
import PregnantModel, { IPregnant } from "@/lib/models/pregnant";

const PregnantSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .transform(capitalizeName),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .transform(capitalizeName),
  birthDate: z.string().transform((str) => new Date(str)),
  takingFerrous: z.boolean(),
  weight: z.number().positive("Weight must be a positive number"),
  systolic: z
    .number()
    .int()
    .positive("Systolic pressure must be a positive integer"),
  diastolic: z
    .number()
    .int()
    .positive("Diastolic pressure must be a positive integer"),
  months: z.number().int().min(0).max(9, "Months must be between 0 and 9"),
  weeks: z.number().int().min(0).max(3, "Weeks must be between 0 and 3"),
  assignedStaff: z.string().min(1, "Assigned staff is required"),
  address: z.string().min(1, "Address is required"),
});

export async function submitMotherInfo(formData: FormData) {
  try {
    await connectToMongoDB();

    const rawFormData = Object.fromEntries(formData.entries());
    const validatedData = PregnantSchema.parse({
      ...rawFormData,
      takingFerrous: rawFormData.takingFerrous === "true",
      weight: parseFloat(rawFormData.weight as string),
      systolic: parseInt(rawFormData.systolic as string),
      diastolic: parseInt(rawFormData.diastolic as string),
      months: parseInt(rawFormData.months as string),
      weeks: parseInt(rawFormData.weeks as string),
    });

    const pregnantResponse: Partial<IPregnant> = {
      ...validatedData,
      age: calculateAge(validatedData.birthDate),
    };

    const duplicateInfo = await PregnantModel.findOne({
      firstName: pregnantResponse.firstName,
      lastName: pregnantResponse.lastName,
    });

    if (duplicateInfo) {
      return { success: false, message: "Duplicate records found" };
    }

    const data = new PregnantModel(pregnantResponse);
    const savedData = await data.save();

    if (!savedData) {
      return { success: false, message: "Data couldn't be saved" };
    }

    return { success: true, message: "Successfully Recorded" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation Error",
        errors: error.errors,
      };
    } else {
      return {
        success: false,
        message: "Error creating Pregnant Info Record",
        error: (error as Error).message || "Unknown error",
      };
    }
  }
}

export async function updateMotherInfo(formData: FormData) {
  try {
    await connectToMongoDB();

    const rawFormData = Object.fromEntries(formData.entries());
    const validatedData = PregnantSchema.parse({
      ...rawFormData,
      takingFerrous: rawFormData.takingFerrous === "true",
      weight: parseFloat(rawFormData.weight as string),
      systolic: parseInt(rawFormData.systolic as string),
      diastolic: parseInt(rawFormData.diastolic as string),
      months: parseInt(rawFormData.months as string),
      weeks: parseInt(rawFormData.weeks as string),
    });

    const pregnantData = {
      ...validatedData,
      _id: rawFormData._id,
      age: calculateAge(validatedData.birthDate),
    };

    if (!pregnantData._id) {
      return { success: false, message: "_id is required for updating" };
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
      return {
        success: false,
        message: `No document found with _id: ${pregnantData._id}`,
      };
    }

    return { success: true, message: "Record successfully Updated" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation Error",
        errors: error.errors,
      };
    } else {
      return {
        success: false,
        message: "Error updating Pregnant Info Record",
        error: (error as Error).message || "Unknown error",
      };
    }
  }
}

export async function deletePregnantRecord(id: string) {
  try {
    await connectToMongoDB();
    if (!id) {
      return {
        success: false,
        message: "PregnantRecord ID is required for deleting",
      };
    }

    const deleteRecord = await PregnantModel.findByIdAndDelete(id);

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
      message: "Error deleting Pregnant Record",
      error: (error as Error).message || "Unknown error",
    };
  }
}
