import mongoose, { Schema } from "mongoose";

export interface Member {
  firstName: string;
  lastName: string;
  birthdate: string;
  gender: "Male" | "Female";
  occupation: string;
}

export interface HouseholdType {
  householdName: string;
  householdType: string;
  nhtsStatus: string;
  toilet: string;
  assignedStaff: string;
  address: string;
  members: Member[];
}

const MemberSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthdate: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female"], required: true },
  occupation: { type: String, required: true },
});

const HouseholdSchema: Schema = new Schema({
  householdName: { type: String, required: true },
  householdType: { type: String, required: true },
  nhtsStatus: { type: String, required: true },
  toilet: { type: String, required: true },
  assignedStaff: { type: String, required: true },
  address: { type: String, required: true },
  members: { type: [MemberSchema], required: true },
});
export default mongoose.models.Household ||
  mongoose.model("Household", HouseholdSchema);
