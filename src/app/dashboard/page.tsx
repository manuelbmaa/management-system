"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import ProjectCard from "../../components/ProjectCard"; // Componente para mostrar el proyecto
import { Project } from "../models/project";

function DashboardPage() {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState<Project[]>([]); // Estado para proyectos
  const [newProjectName, setNewProjectName] = useState("");

  const handleCreateProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: newProjectName,
      tasks: [],
    };
    setProjects([...projects, newProject]);
    setNewProjectName(""); // Limpiar el formulario
  };

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Please sign in to access the dashboard</p>;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Project Dashboard</h1>

      <div className="mb-5">
        <input
          type="text"
          placeholder="New Project Name"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          className="input input-bordered"
        />
        <button onClick={handleCreateProject} className="btn btn-primary ml-2">
          Create Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
