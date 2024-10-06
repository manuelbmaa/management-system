"use client";

import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { useState, useEffect } from 'react';
import { Project } from "../../components/ProjectManagerHome"; 
import { Member } from "../../components/ProjectManagerHome"; 
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";  //Importa useSession de NextAuth

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function DashboardPage() {
  const { data: session, status } = useSession();  //Accede a la sesión y al estado de autenticación
  const router = useRouter();
  const [userCount, setUserCount] = useState(0); //Estado para el número de usuarios
  const [taskTotalCount, setTaskTotalCount] = useState(0); // stado para el total de tareas
  const [projectCount, setProjectCount] = useState(0); //Estado para el número total de proyectos
  
  const [roleCount, setRoleCount] = useState({
    Admin: 0,
    ProjectManager: 0,
    TeamMember: 0,
  });
  useEffect(() => {
    //Si el estado de autenticación es "authenticated", verifica el rol del usuario
    if (status === "authenticated") {
      const userRole = session?.user?.role;

      if (userRole !== "Admin" && userRole !== "ProjectManager") {
        router.push("/access-denied");  //Redirige si no es Admin o Project Manager
      }
    } else if (status === "unauthenticated") {
      router.push("/login");  //Redirige al login si no está autenticado
    }
  }, [status, session, router]);


  //Estado para las tareas agregadas en el gráfico de pastel
  const [taskStats, setTaskStats] = useState({
    realizadas: 0,
    pendientes: 0,
    finalizadas: 0,
  });

  //Función para obtener el número de usuarios y sus roles
  const fetchUserCount = async () => {
    try {
      const response = await fetch('/api/users'); 
      const data: { users: Member[] } = await response.json(); //Asigna el tipo 'Member[]' a los usuarios

      setUserCount(data.users.length); //Asigna el número de usuarios

      //Contar roles
      const adminCount = data.users.filter((user: Member) => user.role === 'Admin').length;
      const projectManagerCount = data.users.filter((user: Member) => user.role === 'ProjectManager').length;
      const teamMemberCount = data.users.filter((user: Member) => user.role === 'TeamMember').length;

      setRoleCount({
        Admin: adminCount,
        ProjectManager: projectManagerCount,
        TeamMember: teamMemberCount,
      });

    } catch (error) {
      console.error('Error fetching user count:', error);
    }
  };

  //Función para obtener la lista de proyectos
  const fetchProjects = async () => {
    try {
      let uri = "";

      if (session?.user.role === "Admin") {
        uri = "/api/projects";
      } else {
        uri = `/api/projects?managerId=${session?.user._id}`;
      }

      const response = await fetch(uri);
      const data = await response.json();
      if (data) {
        setProjectCount(data.length); //Se establece el número total de proyectos

        //Se calcula estadísticas de tareas y total de tareas
        let realizadas = 0;
        let pendientes = 0;
        let finalizadas = 0;
        let totalTareas = 0;

        data.forEach((project: Project) => {
          totalTareas += project.tasks.length;
          project.tasks.forEach((task) => {
            console.log('Tarea:', task.name, 'Estado:', task.status); //Registro para verificar el estado de las tareas
            if (task.status === 'Completado') {
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

  //Datos dinámicos para el gráfico de pastel de tareas
  const tareas = {
    labels: ['Realizadas', 'Pendientes', 'En Progreso'],
    datasets: [
      {
        label: 'Tareas',
        data: [taskStats.realizadas, taskStats.pendientes, taskStats.finalizadas], // Datos calculados dinámicamente
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl border border-black transition">
            <h3 className="text-xl font-semibold text-black mb-4 text-center">Total de Tareas</h3>
            <p className="text-3xl font-bold text-black">{taskTotalCount}</p> {/*Muestra el número total de tareas*/}
          </div>
          <div
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl border border-black transition"
            style={{
              display: session?.user.role === "Admin" ? "" : "none",
            }}
          >
            <h3 className="text-xl font-semibold text-black mb-4 text-center">Roles de Usuarios</h3>
            <p className="text-lg font-bold text-black">Admin: {roleCount.Admin}</p>
            <p className="text-lg font-bold text-black">Project Manager: {roleCount.ProjectManager}</p>
            <p className="text-lg font-bold text-black">Team Member: {roleCount.TeamMember}</p>
          </div>
          <div
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl border border-black transition"
            style={{
              display: session?.user.role === "Admin" ? "" : "none",
            }}
          >
            <h3 className="text-xl font-semibold text-black mb-4 text-center">Usuarios</h3>
            <p className="text-3xl font-bold text-black">{userCount}</p> {/*Muestra el número de usuarios*/}
          </div>
        </div>

        {/* Gráficos */} 
        <div className="bg-white p-6 rounded-lg shadow-lg border border-black w-full max-w-6xl">
          <h3 className="text-xl font-semibold text-black mb-4 text-center">Vista de análisis</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de pastel de tareas */}
            <div className="bg-white p-4 rounded-lg shadow-lg border border-black">
              <h4 className="text-center text-lg font-semibold text-black mb-2">Estadísticas de Tareas</h4>
              <Pie data={tareas} />
            </div>

            {/* Gráfico de proyectos totales */}
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