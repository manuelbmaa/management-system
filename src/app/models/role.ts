import { Schema, model, models } from "mongoose";

const RoleSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "Role name is required"],
    },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Role = models.Role || model("Role", RoleSchema);

export default Role;
