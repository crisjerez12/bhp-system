import mongoose, { Connection } from "mongoose";

let cachedConnection: Connection | null = null;

export default async function connectToMongoDB() {
  if (!process.env.MONGODB_URI) {
    console.log("MONGODB_URI environment variable is not set");
    return; // Early return if URI is not set
  }

  if (cachedConnection) {
    console.log("Using cached db connection");
    return cachedConnection;
  }

  try {
    const mongooseConnection = await mongoose.connect(process.env.MONGODB_URI!);
    cachedConnection = mongooseConnection.connection;
    console.log("New MongoDB connection established");
    return cachedConnection;
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error; // Rethrow the error for further handling
  }
}
