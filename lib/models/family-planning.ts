import mongoose, { Schema } from "mongoose";
export interface IFamilyPlanning {
  _id?: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  age: number;
  assignedStaff: string;
  controlType: string;
  address: string;
}

export const FamilyPlanningSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    controlType: { type: String, required: true },
    birthDate: { type: Date, required: true },
    age: { type: Number, required: true },
    assignedStaff: { type: String, required: true },
    address: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const FamilyPlanningModel =
  mongoose.models.FamilyPlanning ||
  mongoose.model<IFamilyPlanning>("FamilyPlanning", FamilyPlanningSchema);

export default FamilyPlanningModel;
