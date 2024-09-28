import { NextResponse } from "next/server";
import Role from "@/app/models/role";
import { connectDB } from "@/app/libs/mongodb";
import Permission from "@/app/models/permission";

export async function POST(request: Request) {
  try {
    await connectDB();

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

    const permissionsIds = Permission.find({
      _id: { $in: permissions },
    });

    if ((await permissionsIds).length !== permissions.length) {
      return NextResponse.json(
        {
          message: "Invalid permissions",
        },
        { status: 422 }
      );
    }

    const role = new Role({
      name,
      permissions,
    });

    await role.save();

    return NextResponse.json(
      {
        role,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating role:", error);

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

    const roles = await Role.find().populate("permissions");

    return NextResponse.json(
      {
        roles,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting roles:", error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
