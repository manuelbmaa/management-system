/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";
// Extender los tipos de sesión para incluir 'role' en 'user'
declare module "next-auth" {
  interface Session {
    user: {
      _id: string | null,
      role: string;  // Agregar 'role' al objeto 'user'
      name: string | null;
      email: string | null;
    };
  }
}
