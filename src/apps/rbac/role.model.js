// models/role.model.js
import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Manager, Admin
    },
    permissions: {
      type: [String], // permission KEYS
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Role", roleSchema);
