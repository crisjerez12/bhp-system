import mongoose, { Schema, Document } from "mongoose";

// Interface to define the structure of a User document
export interface IUser extends Document {
  username: string;
  password: string;
  // Removed: comparePassword method
}

// Define the schema for the User model
const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    // Removed: minlength constraint
  },
});

// Removed: Pre-save hook for password hashing

// Removed: comparePassword method

// Create and export the User model
export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
