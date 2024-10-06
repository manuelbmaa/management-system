"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react"; 
import { useRouter } from "next/navigation";
import AdminUserManagement from "@/components/AdminUserManagement";
import ProjectManagerHome from "@/components/ProjectManagerHome";
import TeamMemberHome from "@/components/TeamMemberHome";

function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Si el estado de autenticación es "authenticated", verifica el rol del usuario
    if (status === "unauthenticated") {
      router.push("/login");  // Redirige al login si no está autenticado
    }
  }, [status, session, router]);

  // Comprobación de acceso antes de renderizar el contenido
  if (status === "loading") {
    return <div>Loading...</div>; // Muestra un mensaje de carga o acceso denegado
  }

  if (!session || !session.user) {
    return <div>Access Denied</div>;
  }

  return (
    <div className="dark:text-white max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Home</h1>
      {session.user.role === "Admin" && <AdminUserManagement />}
      {session.user.role === "ProjectManager" && <ProjectManagerHome />}
      {session.user.role === "TeamMember" && <TeamMemberHome />}
    </div>
  );
}

export default HomePage;
