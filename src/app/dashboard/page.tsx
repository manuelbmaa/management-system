"use client";

import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { useState, useEffect } from 'react';
import { Project } from "../../components/ProjectManagerHome"; 

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function DashboardPage() {
  const [userCount, setUserCount] = useState(0); //Estado para el número de usuarios
  const [taskTotalCount, setTaskTotalCount] = useState(0); //Estado para el total de tareas
  const [projectCount, setProjectCount] = useState(0); //Estado para el número total de proyectos
  const [projects, setProjects] = useState<Project[]>([]); //Estado para la lista de proyectos

  //Estado para las tareas agregadas en el gráfico de barras
  const [taskStats, setTaskStats] = useState({
    realizadas: 0,
    pendientes: 0,
    finalizadas: 0,
  });

  //Estado para el gráfico de pastel 
  const [projectStatusCount, setProjectStatusCount] = useState({
    completados: 0,
    enProgreso: 0,
  });

  //Función para obtener el número de usuarios
  const fetchUserCount = async () => {
    try {
      const response = await fetch('/api/users'); 
      const data = await response.json();
      setUserCount(data.users.length); //Asigna el número de usuarios
    } catch (error) {
      console.error('Error fetching user count:', error);
    }
  };

  //Función para obtener la lista de proyectos
  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      if (data) {
        setProjects(data); //Establece la lista de proyectos
        setProjectCount(data.length); //Establece el número total de proyectos

        //Actualiza el conteo de estados de proyectos para el gráfico de pastel
        const completados = data.filter((project: Project) => project.status === 'Completado').length;
        const enProgreso = data.filter((project: Project) => project.status === 'En progreso').length;
        setProjectStatusCount({ completados, enProgreso });

        //Calcula estadísticas de tareas y total de tareas
        let realizadas = 0;
        let pendientes = 0;
        let finalizadas = 0;
        let totalTareas = 0;

        data.forEach((project: Project) => {
          totalTareas += project.tasks.length;
          project.tasks.forEach((task) => {
            if (task.status === 'Completa') {
              realizadas += 1;
            } else if (task.status === 'Pendiente') {
              pendientes += 1;
            } else if (task.status === 'En progreso') {
              finalizadas += 1;
            }
          });
        });

        setTaskStats({ realizadas, pendientes, finalizadas });
        setTaskTotalCount(totalTareas); //Asigna el total de tareas
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchUserCount();
    fetchProjects();
  }, []);

  //Configuración para los gráficos
  const options = {
    plugins: {
      legend: {
        labels: {
          color: 'black',
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: 'black',
        },
      },
      x: {
        ticks: {
          color: 'black',
        },
      },
    },
  };

  //Datos dinámicos para el gráfico de pastel de proyectos
  const projectoCompleto = {
    labels: ['Completados', 'En Progreso'],
    datasets: [
      {
        label: 'Proyectos',
        data: [projectStatusCount.completados, projectStatusCount.enProgreso], //Datos calculados dinámicamente
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  //Datos dinámicos para el gráfico de barras de tareas
  const tareas = {
    labels: ['Realizadas', 'Pendientes', 'En Progreso'],
    datasets: [
      {
        label: 'Tareas',
        data: [taskStats.realizadas, taskStats.pendientes, taskStats.finalizadas], //Datos calculados dinámicamente
        backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
      },
    ],
  };

  //Datos para el gráfico de número de proyectos
  const projectoInfo = {
    labels: ['Proyectos'],
    datasets: [
      {
        label: 'Número de Proyectos',
        data: [projectCount], //Datos dinámicos para el número de proyectos
        backgroundColor: ['#FF6384'],
      },
    ],
  };

  return (     
      <div className="flex-1 p-6 bg-gray-100 flex flex-col items-center justify-start min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-black text-center">Dashboard</h1>
        </div>

        {/*Tarjetas*/} 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl border border-black transition">
            <h3 className="text-xl font-semibold text-black mb-4">Total de Tareas</h3>
            <p className="text-3xl font-bold text-black">{taskTotalCount}</p> {/* Mostrar el número total de tareas */}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl border border-black transition">
            <h3 className="text-xl font-semibold text-black mb-4">Ganado</h3>
            <p className="text-3xl font-bold text-black">$12,345</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl border border-black transition">
            <h3 className="text-xl font-semibold text-black mb-4">Usuarios</h3>
            <p className="text-3xl font-bold text-black">{userCount}</p> {/*Muestra el número de usuarios*/}
          </div>
        </div>

        {/*Gráficos*/} 
        <div className="bg-white p-6 rounded-lg shadow-lg border border-black w-full max-w-6xl">
          <h3 className="text-xl font-semibold text-black mb-4 text-center">Vista de análisis</h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/*Gráfico de pastel*/}
            <div className="bg-white p-4 rounded-lg shadow-lg border border-black">
              <h4 className="text-center text-lg font-semibold text-black mb-2">Proyectos Completados vs En Progreso</h4>
              <Pie data={projectoCompleto} />
            </div>

            {/*Gráfico de barras*/}
            <div className="bg-white p-4 rounded-lg shadow-lg border border-black">
              <h4 className="text-center text-lg font-semibold text-black mb-2">Tareas</h4>
              <Bar data={tareas} options={options} />
            </div>

            {/*Gráfico de proyectos totales*/}
            <div className="bg-white p-4 rounded-lg shadow-lg border border-black">
              <h4 className="text-center text-lg font-semibold text-black mb-2">Total de Proyectos</h4>
              <Bar data={projectoInfo} options={options} />
            </div>
          </div>
        </div>
      </div>
  );
}

export default DashboardPage;