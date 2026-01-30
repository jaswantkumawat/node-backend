import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    mongoose.set("bufferCommands", false); // 🔥 fail fast

    await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true,
    });

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed");
    console.error(err);
    process.exit(1);
  }
};
