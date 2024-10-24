"use server";

import connectToMongoDB from "@/lib/connection";
import FamilyPlanning from "@/lib/models/family-planning";

export async function submitFamilyPlanningInfo(formData: FormData) {
  try {
    await connectToMongoDB();
    const familyPlanningData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      address: formData.get("address"),
      age: formData.get("age"),
      controlType: formData.get("controlType"),
      birthDate: formData.get("birthDate"),
      assignedStaff: formData.get("assignedStaff"),
    };
    const data = new FamilyPlanning(familyPlanningData);
    await data.save();
  } catch (error) {}
  return { message: "Form submitted successfully" };
}
