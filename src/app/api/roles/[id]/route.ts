import { NextResponse } from "next/server";
import { connectDB } from "@/app/libs/mongodb";
import Role from "@/app/models/role";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json(
        {
          message: "Role ID is required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const role = await Role.findById(id);

    if (!role) {
      return NextResponse.json(
        {
          message: "role not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      role,
    });
  } catch (error) {
    console.error("Error getting role:", error);

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
          message: "Role ID is required",
        },
        { status: 400 }
      );
    }

    const { name, permissions } = await request.json();

    if (!name) {
      return NextResponse.json(
        {
          message: "Role name is required",
        },
        { status: 422 }
      );
    }

    if (!permissions || !permissions.length) {
      return NextResponse.json(
        {
          message: "Role permissions are required",
        },
        { status: 422 }
      );
    }

    await connectDB();

    const role = await Role.findByIdAndUpdate(
      id,
      {
        name,
        permissions,
      },
      {
        new: true,
      }
    );

    if (!role) {
      return NextResponse.json(
        {
          message: "Role not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Role updated successfully",
      ...role.toJSON(),
    });
  } catch (error) {
    console.error("Error updating role:", error);

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
          message: "Role ID is required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const role = await Role.findByIdAndDelete(id);

    if (!role) {
      return NextResponse.json(
        {
          message: "Role not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Role deleted successfully",
      ...role.toJSON(),
    });
  } catch (error) {
    console.error("Error deleting role:", error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
