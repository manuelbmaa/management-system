import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user"; // Asegúrate de tener el modelo User correcto

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env file");
}

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(MONGODB_URI);
    if (connection.readyState === 1) {
      console.log("Connected to MongoDB");

      // Verifica y crea el admin si no existe
      await createAdminUser();
      
      return Promise.resolve(true);
    }
  } catch (error) {
    console.error(error);
    return Promise.reject(false);
  }
};

// Función para crear el usuario administrador
const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("1234567", 10);
      const adminUser = new User({
        fullname: "Administrador",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "Admin",
      });
      await adminUser.save();
      console.log("Usuario admin creado");
    } else {
      console.log("El usuario admin ya existe");
    }
  } catch (error) {
    console.error("Error al crear el usuario admin:", error);
  }
};