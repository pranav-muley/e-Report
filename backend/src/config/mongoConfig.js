import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_ENDPOINT_URL);
    console.log(`MongoDB Connected successfully. ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed -> ", error.message);
    process.exit(1);
  }
};