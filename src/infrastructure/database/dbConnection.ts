import mongoose from "mongoose";

const connectToDatabase = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI; // Ensure this is defined in your environment variables
  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in the environment variables.");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectToDatabase;
