import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
    {
      email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Email is invalid",
        ],
      },
      password: {
        type: String,
        required: [true, "Password is required"],
        select: false,
      },
      fullname: {
        type: String,
        required: [true, "fullname is required"],
        minLength: [3, "fullname must be at least 3 characters"],
        maxLength: [50, "fullname must be at most 50 characters"],
      },
      role: {
        type: String,
        enum: ['Admin', 'ProjectManager', 'TeamMember'], 
        default: 'TeamMember',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    },
  );

  const User = models.User || model('User', UserSchema)
  export default User;