"use server";

import connectToDatabase from "@/lib/connection";
import SeniorCitizen from "@/lib/models/senior-citizen";

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
    const seniorCitizen = new SeniorCitizen(seniorResponse);

    await seniorCitizen.save();

    return { success: true, message: "Senior Citizen created successfully!" };
  } catch (error) {
    console.error("Error creating Senior Citizen:", error);
    return { success: false, message: "Failed to create Senior Citizen" };
  }
}
