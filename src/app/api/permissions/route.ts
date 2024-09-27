import { NextResponse } from "next/server";
import Permission from "@/app/models/permission";
import { connectDB } from "@/app/libs/mongodb";

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json();

    if (!name || name.length < 3)
      return NextResponse.json(
        {
          message: "Name must be at least 3 characters long",
        },
        {
          status: 422,
        }
      );

    if (!description || description.length < 3)
      return NextResponse.json(
        {
          message: "Description must be at least 3 characters long",
        },
        {
          status: 422,
        }
      );

    await connectDB();

    const permissionFound = await Permission.findOne({
      name,
    });

    if (permissionFound)
      return NextResponse.json(
        {
          message: "Permission already exists",
        },
        {
          status: 409,
        }
      );

    const permission = new Permission({
      name,
      description,
    });

    const savedPermission = await permission.save();

    return NextResponse.json(
      {
        message: "Permission created successfully",
        _id: savedPermission.id,
        name: savedPermission.name,
        description: savedPermission.description,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating permission:", error);

    if (error instanceof Error) {
      if (error.name === "ValidationError") {
        return NextResponse.json(
          {
            message: error.message,
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const permissions = await Permission.find();

    return NextResponse.json(
      {
        permissions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting permissions:", error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
