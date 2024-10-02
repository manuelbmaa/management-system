import { useState } from "react";
import { Project} from "../app/models/project"; // Importa los modelos creados
import { Task} from "../app/models/task"; // Importa los modelos creados

interface ProjectCardProps {
  project: Project; // Definir que este componente recibe un objeto `Project`
}

function ProjectCard({ project }: ProjectCardProps) {
  const [newTaskName, setNewTaskName] = useState("");

  const handleAddTask = () => {
    const newTask: Task = {
      id: Date.now().toString(), // Crear un ID único
      name: newTaskName,
      completed: false,
    };
    project.tasks.push(newTask); // Añadir la tarea al proyecto
    setNewTaskName(""); // Limpiar el input de nueva tarea
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{project.name}</h2>
        <ul>
          {project.tasks.map((task) => (
            <li key={task.id} className="flex justify-between items-center">
              <span>{task.name}</span>
              <input
                type="checkbox"
                checked={task.completed}
                className="checkbox"
              />
            </li>
          ))}
        </ul>
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
      </div>
    </div>
  );
}

export default ProjectCard;