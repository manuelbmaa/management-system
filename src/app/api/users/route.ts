import { NextResponse } from "next/server";
import User from "@/app/models/user";
import { connectDB } from "@/app/libs/mongodb";
import bcrypt from 'bcrypt';

// Obtener usuario(s)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url); // Extrae los parámetros de la URL
  const userId = searchParams.get('userId'); // Obtiene el 'userId' de los parámetros si existe
  const userLogueado = searchParams.get('userLogueado');

  try {
    await connectDB(); // Conectar a la base de datos

    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
      return NextResponse.json(user, { status: 200 });
    } else {
      const users = await User.find({
        _id: {
          $ne: userLogueado,
        }
      });
      return NextResponse.json({ users }, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


// Eliminar usuario
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ message: "User ID not provided" }, { status: 400 });
  }

  try {
    await connectDB();
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// Actualizar rol de usuario
export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url); 
  const userId = searchParams.get('userId'); // Obtener userId desde los parámetros de la URL

  const { fullname, email, role } = await request.json();
  try {
    await connectDB();
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullname, email, role },
      { new: true }
    );
    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// Crear usuario
export async function POST(request: Request) {
  try {
    const { email, fullname, password, role } = await request.json();

    // Validar si la contraseña tiene al menos 6 caracteres
    if (!password || password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Encriptar la contraseña con bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);

    // Validar y crear el usuario con la contraseña encriptada
    const newUser = new User({
      email,
      fullname,
      password: hashedPassword, // Asignar la contraseña encriptada
      role,
    });

    await newUser.save();
    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to create user" }, { status: 500 });
  }
}