// Extender los tipos de sesión para incluir 'role' en 'user'
declare module "next-auth" {
  interface Session {
    user: {
      role: string;  // Agregar 'role' al objeto 'user'
      name: string | null;
      email: string | null;
    };
  }
}
