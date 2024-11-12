import mongoose, { Schema } from "mongoose";

export interface IPregnant {
  _id: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  age: number;
  takingFerrous: boolean;
  weight: number;
  systolic: number;
  diastolic: number;
  months: number;
  weeks: number;
  assignedStaff: string;
  address: string;
}

export const PregnantSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: Date, required: true },
    age: { type: Number, required: true },
    takingFerrous: { type: Boolean, required: true },
    weight: { type: Number, required: true },
    systolic: { type: Number, required: true },
    diastolic: { type: Number, required: true },
    months: { type: Number, required: true },
    weeks: { type: Number, required: true },
    assignedStaff: { type: String, required: true },
    address: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const PregnantModel =
  mongoose.models.Pregnant ||
  mongoose.model<IPregnant>("Pregnant", PregnantSchema);
export default PregnantModel;
