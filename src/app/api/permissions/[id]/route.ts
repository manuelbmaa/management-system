import { NextResponse } from "next/server";
import Permission from "@/app/models/permission";
import { connectDB } from "@/app/libs/mongodb";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json(
        {
          message: "Permission ID is required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const permission = await Permission.findById(id);

    if (!permission) {
      return NextResponse.json(
        {
          message: "Permission not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      permission,
    });
  } catch (error) {
    console.error("Error getting permission:", error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json(
        {
          message: "Permission ID is required",
        },
        { status: 400 }
      );
    }

    const { name, description } = await request.json();

    if (!name || !description) {
      return NextResponse.json(
        {
          message: "Name and description are required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const permission = await Permission.findByIdAndUpdate(
      id,
      {
        name,
        description,
      },
      { new: true }
    );

    if (!permission) {
      return NextResponse.json(
        {
          message: "Permission not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Permission updated successfully",
        _id: permission.id,
        name: permission.name,
        description: permission.description,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating permission:", error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json(
        {
          message: "Permission ID is required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const permission = await Permission.findByIdAndDelete(id);

    if (!permission) {
      return NextResponse.json(
        {
          message: "Permission not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Permission deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting permission:", error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
