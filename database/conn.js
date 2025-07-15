import mongoose from "mongoose";

export default async function connect() {
  try {
    await mongoose.connect(process.env.ATLAS_URI);
    console.log("Database connected!");
  } catch (error) {
    console.error("Database connection error:", error.message);
    throw error;
  }
}
