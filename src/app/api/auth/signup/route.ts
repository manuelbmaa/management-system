import { NextResponse } from "next/server";
import User from "@/app/models/user";
import bcrypt from "bcrypt";
import { connectDB } from "@/app/libs/mongodb";

export async function POST(request: Request) {
  try {
    const { email, password, fullname, role } = await request.json();

    if (!password || password.length < 6)
      return NextResponse.json(
        {
          message: "Password must be at least 6 characters long",
        },
        {
          status: 400,
        }
      );

    await connectDB();

    const userFound = await User.findOne({ email });

    if (userFound)
      return NextResponse.json(
        {
          message: "Email already exists",
        },
        {
          status: 409,
        }
      );

    if (!role || !["Admin", "ProjectManager", "TeamMember"].includes(role)) {
      return NextResponse.json(
        {
          message: "Invalid role specified",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      password: hashedPassword,
      fullname,
      role,
    });

    const savedUser = await user.save();

    return NextResponse.json(
      {
        message: "User created successfully",
        _id: savedUser.id,
        email: savedUser.email,
        fullname: savedUser.fullname,
        role: savedUser.role,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);

    if (error instanceof Error) {
      if (error.name === "ValidationError") {
        return NextResponse.json(
          {
            message: error.message,
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
