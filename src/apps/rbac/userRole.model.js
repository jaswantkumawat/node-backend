import mongoose from "mongoose";

const userRoleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// prevent duplicate role assignment
userRoleSchema.index({ userId: 1, roleId: 1 }, { unique: true });

export default mongoose.model("UserRole", userRoleSchema);
