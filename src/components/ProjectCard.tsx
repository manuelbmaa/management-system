import { useState } from "react";
import { Project} from "../app/models/project"; // Importa los modelos creados
import { Task} from "../app/models/task"; // Importa los modelos creados
import { useRouter } from "next/navigation";

interface ProjectCardProps {
    project: Project;
    onDelete: (id: string) => void; // Función para eliminar el proyecto
  }
  
  function ProjectCard({ project, onDelete }: ProjectCardProps) {
    const [newTaskName, setNewTaskName] = useState("");
    const [isTaskError, setIsTaskError] = useState(false);
    const router = useRouter();
  
    const handleAddTask = () => {
      if (!newTaskName.trim()) {
        setIsTaskError(true);
        return;
      }
      setIsTaskError(false);
      const newTask: Task = {
        id: Date.now().toString(), // Generar un ID único
        name: newTaskName,
        completed: false,
      };
      project.tasks.push(newTask); // Añadir la tarea al proyecto
      setNewTaskName(""); // Limpiar el input
    };
  
    const handleDeleteProject = () => {
      onDelete(project.id); // Llamar a la función onDelete pasando el ID del proyecto
    };
  
    const handleEditProject = () => {
      router.push("/dashboard/page2"); // Redirigir a page2
    };
  
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{project.name}</h2>
          <ul>
            {project.tasks.map((task) => (
              <li key={task.id} className="flex justify-between items-center">
                <span>{task.name}</span>
                <input type="checkbox" checked={task.completed} className="checkbox" />
              </li>
            ))}
          </ul>
  
          {/* Nueva tarea */}
          <div className="flex mt-3">
            <input
              type="text"
              placeholder="New Task"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              className="input input-bordered"
            />
            <button onClick={handleAddTask} className="btn btn-primary ml-2">
              Add Task
            </button>
          </div>
          {isTaskError && <p className="text-red-500">El nombre de la tarea no puede estar vacio!</p>}
  
          {/* Botones de editar y eliminar */}
          <div className="flex justify-end space-x-3 mt-3">
            <button onClick={handleEditProject} className="btn btn-warning">
              Edit
            </button>
            <button onClick={handleDeleteProject} className="btn btn-error">
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default ProjectCard;