import { config } from "dotenv";
config();
import mongoose from "mongoose";

const connectToDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    console.log(mongoUri);
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in the environment variables.");
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectToDatabase;
