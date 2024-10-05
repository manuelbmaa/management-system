"use client";
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function DashboardPage() {
  //Configuración para color labels
  const options = {
    plugins: {
      legend: {
        labels: {
          color: 'black', //color
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: 'black', //Color  eje Y
        },
      },
      x: {
        ticks: {
          color: 'blac', //Color eje X
        },
      },
    },
  };

  //Datos para el gráfico de pastel
  const projectoCompleto = {
    labels: ['Completado', 'Incompleto'],
    datasets: [
      {
        label: 'Porcentaje Completado',
        data: [50, 50], // Aquí puedes cambiar el porcentaje dinámicamente
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  // Datos para el gráfico de barras (Tareas)
  const tareas = {
    labels: ['Realizadas', 'Pendientes', 'Finalizadas'],
    datasets: [
      {
        label: 'Tareas',
        data: [10, 5, 7], // Aquí puedes ajustar las cifras dinámicamente
        backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
      },
    ],
  };

  // Datos para el gráfico de proyectos
  const projectoInfo = {
    labels: ['Proyectos'],
    datasets: [
      {
        label: 'Número de Proyectos',
        data: [12], // Cambia dinámicamente el número de proyectos
        backgroundColor: ['#FF6384'],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-64 bg-white shadow-lg">
        <div className="px-4 py-6">
          <h2 className="text-2xl font-semibold text-black">Dashboard</h2>
        </div>
        <nav className="mt-10">
          <ul>
            <li className="mb-2">
              <a href="#" className="block px-4 py-2 text-black hover:bg-blue-600 hover:text-white rounded-md transition">Vista</a>
            </li>
            <li className="mb-2">
              <a href="#" className="block px-4 py-2 text-black hover:bg-blue-600 hover:text-white rounded-md transition">Análisis</a>
            </li>
            <li className="mb-2">
              <a href="#" className="block px-4 py-2 text-black hover:bg-blue-600 hover:text-white rounded-md transition">Bookings</a>
            </li>
          </ul>
        </nav>
      </div>

      {/*Contenedor de todo*/}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-black">Dashboard</h1>
          <button className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition">Crear nuevo</button>
        </div>

        <div className="mt-8">
          {/*Tarjetas*/}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl border border-black transition">
              <h3 className="text-xl font-semibold text-black mb-4">Bookings</h3>
              <p className="text-2xl font-bold text-black">245</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl border border-black transition">
              <h3 className="text-xl font-semibold text-black mb-4">Ganado</h3>
              <p className="text-2xl font-bold text-black">$12,345</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl border border-black transition">
              <h3 className="text-xl font-semibold text-black mb-4">Visitantes</h3>
              <p className="text-2xl font-bold text-black">300</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl border border-black transition">
              <h3 className="text-xl font-semibold text-black mb-4">Usuarios</h3>
              <p className="text-2xl font-bold text-black">3</p>
            </div>
          </div>

          {/*Gráficos*/}
          <div className="mt-12 bg-white p-6 rounded-lg shadow-lg border border-black">
            <h3 className="text-xl font-semibold text-black mb-4">Vista de análisis</h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/*Gráfico de pastel*/}
              <div className="bg-white p-4 rounded-lg shadow-lg border border-black">
                <h4 className="text-center font-semibold text-black">Porcentaje Completado</h4>
                <Pie data={projectoCompleto} options={options} />
              </div>

              {/*Gráfico de barras*/}
              <div className="bg-white p-4 rounded-lg shadow-lg border border-black">
                <h4 className="text-center font-semibold text-black">Tareas</h4>
                <Bar data={tareas} options={options} />
              </div>

              {/*Gráfico de proyectos*/}
              <div className="bg-white p-4 rounded-lg shadow-lg border border-black">
                <h4 className="text-center font-semibold text-black">Proyectos</h4>
                <Bar data={projectoInfo} options={options} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;