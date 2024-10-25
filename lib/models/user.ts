import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  role?: "admin" | "staff";
}

const UserSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
