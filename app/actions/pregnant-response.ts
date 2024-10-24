"use server";

import connectToMongoDB from "@/lib/connection";
import Pregnant from "@/lib/models/pregnant";

// type ActionResult = {
//   message?: string;
//   error?: string;
// };

export async function submitMotherInfo(formData: FormData) {
  try {
    console.log(formData);
    await connectToMongoDB();
    const pregnantResponse = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      birthDate: formData.get("birthDate"),
      age: formData.get("age"),
      takingFerrous: formData.get("takingFerrous"),
      weight: formData.get("weight"),
      systolic: formData.get("systolic"),
      diastolic: formData.get("diastolic"),
      months: formData.get("months"),
      weeks: formData.get("weeks"),
      assignedStaff: formData.get("assignedStaff"),
      address: formData.get("address"),
    };
    console.log(pregnantResponse);
    const data = new Pregnant(pregnantResponse);
    await data.save();
    console.log("Created Pregnant Response:", pregnantResponse);
  } catch (error) {
    console.error("Something went wrong:", error);
  }
}
