"use client";
import { useSession } from "next-auth/react";
import AdminUserManagement from "@/components/AdminUserManagement";
import ProjectManagerHome from "@/components/ProjectManagerHome";
import TeamMemberHome from "@/components/TeamMemberHome";

function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session || !session.user) {
    return <div>Access Denied</div>;
  }

  return (
    <div className="bg-gray-500 dark:text-white max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Home</h1>
      {session.user.role === "Admin" && (
        <>
          <AdminUserManagement />
        </>
      )}
      {session.user.role === "ProjectManager" && (
        <ProjectManagerHome />
      )}
      {session.user.role === "TeamMember" && (
        <TeamMemberHome />
      )}
    </div>
  );
}

export default HomePage;
