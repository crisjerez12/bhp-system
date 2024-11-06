import mongoose, { Schema } from "mongoose";

export interface ISeniorCitizen {
  _id?: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  age: number;
  weight: number;
  systolic: number;
  diastolic: number;
  assignedStaff: string;
  address: string;
  medicines?: string[];
}

const SeniorCitizenSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: Date, required: true },
    age: { type: Number, required: true },
    takingFerrous: { type: Boolean, required: false },
    weight: { type: Number, required: true },
    systolic: { type: Number, required: true },
    diastolic: { type: Number, required: true },
    assignedStaff: { type: String, required: true },
    address: { type: String, required: true },
    medicines: { type: [String], required: false },
  },
  {
    timestamps: true,
  }
);

const SeniorCitizenModel =
  mongoose.models.SeniorCitizen ||
  mongoose.model<ISeniorCitizen>("SeniorCitizen", SeniorCitizenSchema);
export default SeniorCitizenModel;
