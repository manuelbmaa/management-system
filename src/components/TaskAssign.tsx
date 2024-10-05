import React, { useState, useEffect } from "react";
import axios from "axios";

interface Task {
  name: string;
  description: string;
  assignedTo: string;
  status: string; // Puede ser "Pendiente", "En progreso", "Completa"
}

interface Project {
  _id?: string;
  name: string;
  description: string;
  status: string;
  members: string[];
  tasks: Task[];
}

const ProjectManagerHome = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    // Fetch existing projects
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/api/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    const newProject: Project = {
      name,
      description,
      status: "Iniciado",
      members: [],
      tasks: [],
    };
    try {
      const response = await axios.post("/api/projects", newProject);
      setProjects([...projects, response.data]);
      setName("");
      setDescription("");
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await axios.delete(`/api/projects?id=${projectId}`);
      setProjects(projects.filter((project) => project._id !== projectId));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleUpdateProjectStatus = async (projectId: string, newStatus: string) => {
    try {
      await axios.put(`/api/projects`, {
        id: projectId,
        status: newStatus,
      });
      setProjects(
        projects.map((project) =>
          project._id === projectId ? { ...project, status: newStatus } : project
        )
      );
    } catch (error) {
      console.error("Error updating project status:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Proyectos</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nombre del proyecto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border mb-2 w-full"
        />
        <textarea
          placeholder="Descripción del proyecto"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 border w-full"
        />
        <button
          onClick={handleCreateProject}
          className="mt-2 p-2 bg-blue-500 text-white rounded"
        >
          Crear Proyecto
        </button>
      </div>
      <h2 className="text-xl font-bold mb-4">Proyectos Actuales</h2>
      {projects.length > 0 ? (
        projects.map((project) => (
          <div key={project._id} className="border p-4 mb-4">
            <h3 className="text-lg font-bold">{project.name}</h3>
            <p>{project.description}</p>
            <p>Estado: {project.status}</p>

            {/* Añadir el código para actualizar el estado del proyecto aquí */}
            <div>
              <h4>Actualizar Estado del Proyecto</h4>
              <select
                value={project.status}
                onChange={(e) =>
                  handleUpdateProjectStatus(project._id as string, e.target.value)
                }
                className="p-2 border mb-2 w-full"
              >
                <option value="Iniciado">Iniciado</option>
                <option value="En progreso">En progreso</option>
                <option value="Completado">Completado</option>
              </select>
            </div>

            <button
              onClick={() => handleDeleteProject(project._id as string)}
              className="bg-red-500 text-white px-4 py-2 rounded mt-2"
            >
              Eliminar Proyecto
            </button>
            {/* Aquí podrías agregar opciones para asignar miembros y tareas */}
          </div>
        ))
      ) : (
        <p>No hay proyectos creados aún.</p>
      )}
    </div>
  );
};

export default ProjectManagerHome;
