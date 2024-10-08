import mongoose, { Schema, Document } from "mongoose";
import { z } from "zod";

// Define the Zod schema for validation
export const SeniorCitizenSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  birthDate: z.object({
    month: z.string().min(1, "Month is required"),
    day: z.string().min(1, "Day is required"),
    year: z.string().min(1, "Year is required"),
  }),
  age: z.number().min(0),
  weight: z.string().min(1, "Weight is required"),
  bloodPressure: z.object({
    systolic: z.string().min(1, "Systolic pressure is required"),
    diastolic: z.string().min(1, "Diastolic pressure is required"),
  }),
  assignedStaff: z.string().min(1, "Assigned staff is required"),
  address: z.string().min(1, "Address is required"),
});

export type SeniorCitizen = z.infer<typeof SeniorCitizenSchema>;

// Define the Mongoose schema
const SeniorCitizenMongooseSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDate: {
    month: { type: String, required: true },
    day: { type: String, required: true },
    year: { type: String, required: true },
  },
  age: { type: Number, required: true },
  weight: { type: String, required: true },
  bloodPressure: {
    systolic: { type: String, required: true },
    diastolic: { type: String, required: true },
  },
  assignedStaff: { type: String, required: true },
  address: { type: String, required: true },
});

// Define the Mongoose model
export interface ISeniorCitizen extends Document, SeniorCitizen {}

export const SeniorCitizenModel = mongoose.model<ISeniorCitizen>(
  "SeniorCitizen",
  SeniorCitizenMongooseSchema
);
