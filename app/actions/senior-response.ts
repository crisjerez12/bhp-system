"use server";

import { z } from "zod";
import connectToDatabase from "@/lib/connection";
import { calculateAge } from "@/lib/Functions";
import SeniorCitizenModel, {
  ISeniorCitizen,
} from "@/lib/models/senior-citizen";

const SeniorCitizenSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  weight: z.coerce.number().positive("Weight must be a positive number"),
  systolic: z.coerce
    .number()
    .int()
    .positive("Systolic pressure must be a positive integer"),
  diastolic: z.coerce
    .number()
    .int()
    .positive("Diastolic pressure must be a positive integer"),
  assignedStaff: z.string().min(1, "Assigned staff is required"),
  address: z.string().min(1, "Address is required"),
  medicines: z.array(z.string()).optional(),
});

type ActionResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createSeniorCitizen(
  formData: FormData
): Promise<ActionResult> {
  try {
    await connectToDatabase();

    const rawData: Record<string, any> = {};
    formData.forEach((value, key) => {
      if (key === "medicines[]") {
        rawData.medicines = formData.getAll("medicines[]");
      } else {
        rawData[key] = formData.get(key);
      }
    });

    const validationResult = SeniorCitizenSchema.safeParse(rawData);

    if (!validationResult.success) {
      return {
        success: false,
        errors: validationResult.error.flatten().fieldErrors,
        message: "Validation failed",
      };
    }

    const { birthDate, ...validatedData } = validationResult.data;
    const parsedBirthDate = new Date(birthDate);

    const seniorResponse: Omit<ISeniorCitizen, "_id"> = {
      ...validatedData,
      birthDate: parsedBirthDate,
      age: calculateAge(parsedBirthDate),
    };

    const duplicateInfo = await SeniorCitizenModel.findOne({
      firstName: seniorResponse.firstName,
      lastName: seniorResponse.lastName,
    });

    if (duplicateInfo) {
      return { success: false, message: "Duplicate records found" };
    }

    const seniorCitizen = new SeniorCitizenModel(seniorResponse);
    const savedData = await seniorCitizen.save();

    if (!savedData) {
      return { success: false, message: "Data not saved" };
    }

    return { success: true, message: "Senior Citizen created successfully!" };
  } catch (error) {
    console.error("Error in createSeniorCitizen:", error);
    return { success: false, message: "Failed to create Senior Citizen" };
  }
}
export async function updateSeniorCitizen(
  formData: FormData
): Promise<ActionResult> {
  try {
    await connectToDatabase();

    const rawData: Record<string, any> = {};
    formData.forEach((value, key) => {
      if (key === "medicines[]") {
        rawData.medicines = formData.getAll("medicines[]");
      } else {
        rawData[key] = formData.get(key);
      }
    });

    const id = rawData._id;
    delete rawData._id;

    const validationResult = SeniorCitizenSchema.safeParse(rawData);

    if (!validationResult.success) {
      return {
        success: false,
        errors: validationResult.error.flatten().fieldErrors,
        message: "Validation failed",
      };
    }

    const { birthDate, ...validatedData } = validationResult.data;
    const parsedBirthDate = new Date(birthDate);

    const seniorResponse: Omit<ISeniorCitizen, "_id"> = {
      ...validatedData,
      birthDate: parsedBirthDate,
      age: calculateAge(parsedBirthDate),
    };

    const updatedSeniorCitizen = await SeniorCitizenModel.findByIdAndUpdate(
      id,
      seniorResponse,
      { new: true, runValidators: true }
    );

    if (!updatedSeniorCitizen) {
      return { success: false, message: "Senior Citizen not found" };
    }

    return { success: true, message: "Senior Citizen updated successfully!" };
  } catch (error) {
    console.error("Error in updateSeniorCitizen:", error);
    return { success: false, message: "Failed to update Senior Citizen" };
  }
}

export async function deleteSeniorCitizen(id: string): Promise<ActionResult> {
  try {
    await connectToDatabase();

    const deletedSeniorCitizen = await SeniorCitizenModel.findByIdAndDelete(id);

    if (!deletedSeniorCitizen) {
      return { success: false, message: "Senior Citizen not found" };
    }

    return { success: true, message: "Senior Citizen deleted successfully" };
  } catch (error) {
    console.error("Error in deleteSeniorCitizen:", error);
    return { success: false, message: "Failed to delete Senior Citizen" };
  }
}
