"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";


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
  status: string; // "Iniciado", "En progreso", "Completado"
  members: string[];
  tasks: Task[];
}

const TeamMemberHome = () => {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (status === "authenticated" && session?.user) {
        try {
          // Asegúrate de que `session.user.id` existe y tiene el ID del usuario.
          const userId = session?.user._id;

          if (userId) {
            console.log("Usuario autenticado con ID:", userId); // Log para depurar
            const response = await axios.get(`/api/projects?memberId=${userId}`);
            console.log("Proyectos asignados:", response.data); // Log para depurar
            setProjects(response.data);
          } else {
            console.error("No se encontró el ID del usuario en la sesión.");
          }
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      }
    };

    fetchProjects();
  }, [status, session]);

  // Cambiar el estado de una tarea
  const handleTaskStatusChange = async (projectId: string, taskIndex: number) => {
    const project = projects.find((p) => p._id === projectId);
    if (!project) return;

    const task = project.tasks[taskIndex];
    if (!task) return;

    // Ciclo de estado: "Pendiente" -> "En progreso" -> "Completado"
    let newStatus = "";
    if (task.status === "Pendiente") {
      newStatus = "En progreso";
    } else if (task.status === "En progreso") {
      newStatus = "Completado";
    } else {
      return; // Si ya está "Completado", no se hace nada
    }

    try {
      // Realizar una solicitud PUT para actualizar el estado de la tarea en el backend
      await axios.put("/api/projects", {
        id: projectId,
        updateTask: { taskIndex, updatedTask: { ...task, status: newStatus } },
      });

      // Actualizar el estado del proyecto en el frontend
      setProjects(
        projects.map((p) =>
          p._id === projectId
            ? {
                ...p,
                tasks: p.tasks.map((t, index) =>
                  index === taskIndex ? { ...t, status: newStatus } : t
                ),
              }
            : p
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <div className="bg-black border-blue-200 text-white p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Welcome, Team Member</h1>
      <p className="mb-4">Here you can view your tasks and project updates.</p>

      <h2 className="text-xl text-white font-bold mb-4">Proyectos Asignados</h2>
      {projects.length > 0 ? (
        projects.map((project) => (
          <div key={project._id} 
          style={{
            backgroundImage: "url('https://t3.ftcdn.net/jpg/05/93/52/12/360_F_593521259_FTBggkMSTck8OKcMhZe9KZUkXFuVB3FG.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            fontFamily: 'verdana'
          }}
          className=" bg-green-900 border p-4 mb-4">
            <h3 className="text-lg text-white font-bold">{project.name}</h3>
            <p>{project.description}</p>
            <p>Estado del Proyecto: {project.status}</p>

            {/* Mostrar Tareas Asignadas */}
            {project.tasks.length > 0 && (
              <div className="mt-4">
                <h4 className="text-white font-bold">Tus Tareas</h4>
                <ul>
                  {project.tasks
                    .filter((task) => task.assignedTo === session?.user._id || task.assignedTo === session?.user._id)
                    .map((task, index) => (
                      <li key={index} className="text-white border p-2 mt-2">
                        <p>
                          <strong>Tarea:</strong> {task.name}
                        </p>
                        <p>
                          <strong>Descripción:</strong> {task.description}
                        </p>
                        <p>
                          <strong>Estado:</strong> {task.status}
                        </p>
                        {task.status !== "Completado" && (
                          <button
                            onClick={() => handleTaskStatusChange(project._id as string, index)}
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                          >
                            {task.status === "Pendiente"
                              ? "Cambiar a En progreso"
                              : "Cambiar a Completado"}
                          </button>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No tienes proyectos asignados aún.</p>
      )}
    </div>
  );
};

export default TeamMemberHome;
