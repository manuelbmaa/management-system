import { Schema, model, models } from "mongoose";

const PermissionSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "Name is required"],
      minLength: [3, "Name must be at least 3 characters"],
      maxLength: [50, "Name must be at most 50 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minLength: [3, "Description must be at least 3 characters"],
      maxLength: [255, "Description must be at most 255 characters"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Permission = models.Permission || model("Permission", PermissionSchema);

export default Permission;