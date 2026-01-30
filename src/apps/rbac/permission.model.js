import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true, // CRM.LEAD.CREATE
    },
    module: {
      type: String,
      required: true, // CRM
    },
    resource: {
      type: String,
      required: true, // LEAD
    },
    action: {
      type: String,
      required: true, // CREATE, READ, EXPORT
    },
    description: String,
  },
  { timestamps: true },
);

export default mongoose.model("Permission", permissionSchema);
