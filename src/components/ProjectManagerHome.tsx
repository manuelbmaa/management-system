import React, { useState, useEffect } from "react";
import axios from "axios";
import CommentsSection from "./CommentsSection";

interface Task {
  name: string;
  description: string;
  assignedTo: string; // ID del miembro al que está asignado
  status: string; // Puede ser "Pendiente", "En progreso", "Completa"
}

export interface Project {
  _id?: string;
  name: string;
  description: string;
  status: string; // "Iniciado", "En progreso", "Completado"
  members: string[];
  tasks: Task[];
}

interface Member {
  _id: string;
  fullname: string;
  email: string;
  role: string;
}

const ProjectManagerHome = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [taskName, setTaskName] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [selectedTaskMember, setSelectedTaskMember] = useState<string>("");
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [editTaskIndex, setEditTaskIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/api/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    const fetchMembers = async () => {
      try {
        const response = await axios.get("/api/users");
        // Filtrar solo los usuarios que tienen el rol "TeamMember"
        const teamMembers = response.data.users.filter((member: Member) => member.role === "TeamMember");
        setMembers(teamMembers);
      } catch (error) {
        console.error("Error fetching members:", error);
        setMembers([]);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("/api/currentUser");
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchProjects();
    fetchMembers();
    fetchCurrentUser();
  }, []);

  const handleCreateOrEditProject = async () => {
    if (editProjectId) {
      try {
        await axios.put("/api/projects", {
          id: editProjectId,
          name,
          description,
        });
        setProjects(
          projects.map((project) =>
            project._id === editProjectId ? { ...project, name, description } : project
          )
        );
        setEditProjectId(null);
        setName("");
        setDescription("");
      } catch (error) {
        console.error("Error updating project:", error);
      }
    } else {
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

  const handleAssignTask = async (projectId: string) => {
    const newTask: Task = {
      name: taskName,
      description: taskDescription,
      assignedTo: selectedTaskMember,
      status: "Pendiente",
    };
    try {
      await axios.put(`/api/projects`, {
        id: projectId,
        task: newTask,
      });
      setProjects(
        projects.map((project) =>
          project._id === projectId
            ? { ...project, tasks: [...project.tasks, newTask] }
            : project
        )
      );
      setTaskName("");
      setTaskDescription("");
      setSelectedTaskMember("");
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };

  const handleEditTask = (projectId: string, taskIndex: number) => {
    const project = projects.find((p) => p._id === projectId);
    if (project) {
      const task = project.tasks[taskIndex];
      setTaskName(task.name);
      setTaskDescription(task.description);
      setSelectedTaskMember(task.assignedTo);
      setEditTaskIndex(taskIndex);
    }
  };

  const handleUpdateTask = async (projectId: string) => {
    if (editTaskIndex === null) return;

    try {
      const updatedTask: Task = {
        name: taskName,
        description: taskDescription,
        assignedTo: selectedTaskMember,
        status: "Pendiente", // Mantén el estado como pendiente al actualizar
      };

      await axios.put(`/api/projects`, {
        id: projectId,
        updateTask: { taskIndex: editTaskIndex, updatedTask },
      });

      setProjects(
        projects.map((project) =>
          project._id === projectId
            ? {
                ...project,
                tasks: project.tasks.map((task, index) =>
                  index === editTaskIndex ? updatedTask : task
                ),
              }
            : project
        )
      );
      setTaskName("");
      setTaskDescription("");
      setSelectedTaskMember("");
      setEditTaskIndex(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (projectId: string, taskIndex: number) => {
    try {
      await axios.put(`/api/projects`, {
        id: projectId,
        deleteTaskIndex: taskIndex,
      });

      setProjects(
        projects.map((project) =>
          project._id === projectId
            ? {
                ...project,
                tasks: project.tasks.filter((_, index) => index !== taskIndex),
              }
            : project
        )
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="bg-black p-6">
      <h1 className="text-2xl font-bold mb-4 tex-black">Gestión de Proyectos</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nombre del proyecto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-900 p-2 border mb-2 w-full"
        />
        <textarea
          placeholder="Descripción del proyecto"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-gray-900 p-2 border w-full"
        />
        <button
          onClick={handleCreateOrEditProject}
          className="mt-2 p-2 bg-blue-500 text-white rounded"
        >
          {editProjectId ? "Actualizar Proyecto" : "Crear Proyecto"}
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4">Proyectos Actuales</h2>
      {projects.length > 0 ? (
        projects.map((project) => (
          <div key={project._id} className="border p-4 mb-4">
            <h3 className="text-lg font-bold">{project.name}</h3>
            <p>{project.description}</p>
            <p>Estado: {project.status}</p>
            <button
              onClick={() => handleDeleteProject(project._id as string)}
              className="bg-red-500 text-white px-4 py-2 rounded mt-2"
            >
              Eliminar Proyecto
            </button>
            <button
              onClick={() => {
                setEditProjectId(project._id as string);
                setName(project.name);
                setDescription(project.description);
              }}
              className="bg-yellow-500 text-white px-4 py-2 rounded mt-2 ml-2"
            >
              Editar Proyecto
            </button>

            {/* Assign Task to Member */}
            <div className="mt-4">
              <h4 className="font-bold">Asignar Tarea</h4>
              <input
                type="text"
                placeholder="Nombre de la tarea"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="bg-gray-900 p-2 border mb-2 w-full"
              />
              <textarea
                placeholder="Descripción de la tarea"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="bg-gray-900 p-2 border mb-2 w-full"
              />
              <select
                value={selectedTaskMember}
                onChange={(e) => setSelectedTaskMember(e.target.value)}
                className="bg-gray-900 p-2 border mb-2 w-full"
              >
                <option value="">Seleccione un miembro para la tarea</option>
                {members.length > 0 &&
                  members.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.fullname}
                    </option>
                  ))}
              </select>
              <button
                onClick={() =>
                  editTaskIndex === null
                    ? handleAssignTask(project._id as string)
                    : handleUpdateTask(project._id as string)
                }
                className="bg-purple-500 text-white px-4 py-2 rounded"
              >
                {editTaskIndex === null ? "Asignar Tarea" : "Actualizar Tarea"}
              </button>
            </div>

            {/* Display Assigned Tasks */}
            {project.tasks.length > 0 && (
              <div className="mt-4">
                <h4 className="font-bold">Tareas</h4>
                <ul>
                  {project.tasks.map((task, index) => (
                    <li key={index} className="border p-2 mt-2">
                      <p>
                        <strong>Tarea:</strong> {task.name}
                      </p>
                      <p>
                        <strong>Descripción:</strong> {task.description}
                      </p>
                      <p>
                        <strong>Asignado a:</strong>{" "}
                        {members.find((m) => m._id === task.assignedTo)?.fullname}
                      </p>
                      <p>
                        <strong>Estado:</strong> {task.status}
                      </p>
                      <button
                        onClick={() => handleEditTask(project._id as string, index)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded mt-2 mr-2"
                      >
                        Editar Tarea
                      </button>
                      <button
                        onClick={() => handleDeleteTask(project._id as string, index)}
                        className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                      >
                        Eliminar Tarea
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}


          </div>
        ))
      ) : (
        <p>No hay proyectos creados aún.</p>
      )}
    </div>
  );
};

export default ProjectManagerHome;
