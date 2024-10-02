"use client";

import { useState } from "react";
import ProjectCard from "../../components/ProjectCard"; // Componente para mostrar el proyecto
import { Project } from "../models/project";

function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [isProjectError, setIsProjectError] = useState(false);

  const handleAddProject = () => {
    if (!newProjectName.trim()) {
      setIsProjectError(true);
      return;
    }
    setIsProjectError(false);
    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName,
      tasks: [],
    };
    setProjects([...projects, newProject]);
    setNewProjectName(""); // Limpiar el input
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter((project) => project.id !== projectId));
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-5">Projects Dashboard</h1>

      {/* Nueva creación de proyecto */}
      <div className="flex mb-5">
        <input
          type="text"
          placeholder="New Project"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          className="input input-bordered w-full"
        />
        <button onClick={handleAddProject} className="btn btn-primary ml-2">
          Add Project
        </button>
      </div>
      {isProjectError && <p className="text-red-500">El nombre del proyecto no puede estara vacio!</p>}

      {/* Mostrar lista de proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onDelete={handleDeleteProject} />
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;