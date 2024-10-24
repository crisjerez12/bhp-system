import mongoose, { Schema, Document } from "mongoose";

// Define the interface for the Pregnant document
interface IFamilyPlanning extends Document {
  firstName: string;
  lastName: string;
  birthDate: Date;
  age: number;
  assignedStaff: string;
  address: string;
}

// Create the schema for the Pregnant model
export const FamilyPlanningSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: Date, required: true },
    age: { type: Number, required: true },
    assignedStaff: { type: String, required: true },
    address: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const FamilyPlanning =
  mongoose.models.FamilyPlanning ||
  mongoose.model<IFamilyPlanning>("FamilyPlanning", FamilyPlanningSchema);

export default FamilyPlanning;
