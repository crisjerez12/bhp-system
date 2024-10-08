"use server";

import {
  SeniorCitizenSchema,
  SeniorCitizen,
  SeniorCitizenModel,
} from "@/lib/models/senior-citizen";
import connectToDatabase from "@/lib/connection";

export async function createSeniorCitizen(data: SeniorCitizen) {
  console.log("Received data in server action:", data); // Log the received data
  try {
    // Connect to the database
    await connectToDatabase();

    // Validate the data using the schema
    const validatedData = SeniorCitizenSchema.parse(data);

    // Create a new SeniorCitizenModel instance
    const seniorCitizen = new SeniorCitizenModel(validatedData);

    // Save the data to the database
    await seniorCitizen.save();

    console.log("Senior Citizen saved:", validatedData);

    return { success: true, message: "Senior Citizen created successfully!" };
  } catch (error) {
    console.error("Error creating Senior Citizen:", error);
    return { success: false, message: "Failed to create Senior Citizen" };
  }
}
