import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
    profileType: {
      type: String,
      enum: ["USER", "CUSTOMER", "VENDOR", "PARTNER"],
      required: true,
      index: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    avatar: String,
    phone: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

/**
 * Virtual field: fullName
 */
profileSchema.virtual("fullName").get(function () {
  if (!this.firstName && !this.lastName) return "";
  if (!this.firstName) return this.lastName;
  if (!this.lastName) return this.firstName;
  return `${this.firstName} ${this.lastName}`;
});

export default mongoose.model("Profile", profileSchema);
