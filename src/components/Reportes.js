import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";

const Reportes = () => {
  const [proyectos, setProyectos] = useState([]);
  const [reporteSeleccionado, setreporteSeleccionado] = useState("pruebas");

  useEffect(() => {
    const fetchMetricas = async () => {
      try {
        const response = await axios.get(
          "https://us-central1-my-project-pg-e4715.cloudfunctions.net/app/api/proyectos"
        );
        setProyectos(response.data);
      } catch (error) {
        console.error("Error al obtener las métricas globales:", error);
      }
    };
    fetchMetricas();
  }, []);

  return (
    <div className="App">
      <Header />
      <div className="container mx-auto p-6 relative p-4">
        <div className="flex justify-between p-6">
          <div className="order-first">
            <h1 className="text-5xl font-bold">
              {reporteSeleccionado === "pruebas"
                ? "Reporte general de  Pruebas"
                : "Reporte general de Defectos"}
            </h1>
          </div>
          <div className="order-last">
            <div className="flex place-content-center gap-4">
              <button
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                onClick={() => setreporteSeleccionado("pruebas")}
              >
                Reporte pruebas
              </button>
              <button
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                onClick={() => setreporteSeleccionado("defectos")}
              >
                Reporte Defectos
              </button>
            </div>
          </div>
        </div>

        {reporteSeleccionado == "pruebas" && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden table-auto">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="py-3 px-6 text-center">Proyecto</th>
                  <th className="py-3 px-6 text-center">Hito</th>
                  <th className="py-3 px-6 text-center">Prueba</th>
                  <th className="py-3 px-6 text-center hidden sm:table-cell">
                    Descripcion
                  </th>
                  <th className="py-3 px-6 text-center hidden sm:table-cell">
                    Estado
                  </th>
                  <th className="py-3 px-6 text-center">Resultado</th>
                  <th className="py-3 px-6 text-center">Criterio aceptacion</th>
                </tr>
              </thead>
              <tbody>
                {proyectos.map((proyecto) =>
                  proyecto.Hito.map((hito) =>
                    hito.Prueba.map((prueba) => (
                      <tr key={prueba} className="border-b border-gray-200">
                        <td className="py-3 px-1">{proyecto.Proyecto}</td>
                        <td className="py-3 px-1">{hito.Descripcion}</td>
                        <td className="py-3 px-1">{prueba.Nombre}</td>
                        <td className="py-3 px-1 hidden sm:table-cell">
                          {prueba.Comentario}
                        </td>
                        <td className="py-3 px-1 hidden sm:table-cell">
                          {prueba.Estado}
                        </td>
                        <td className="py-3 px-1">{prueba.Resultado}</td>
                        <td className="py-3 px-1">
                          {prueba.Criterio_aceptacion}
                        </td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
        {reporteSeleccionado == "defectos" && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="py-3 px-6 text-center">Proyecto</th>
                  <th className="py-3 px-6 text-center">Hito</th>
                  <th className="py-3 px-6 text-center hidden sm:table-cell">
                    Prueba
                  </th>
                  <th className="py-3 px-6 text-center">Defecto</th>
                  <th className="py-3 px-6 text-center">Resolucion</th>
                  <th className="py-3 px-6 text-center">Recurso</th>
                  <th className="py-3 px-6 text-center">Resuelto</th>
                  <th className="py-3 px-6 text-center">Tiempo(hrs)</th>
                </tr>
              </thead>
              <tbody>
                {proyectos.map((proyecto) =>
                  proyecto.Hito.map((hito) =>
                    hito.Prueba.map((prueba) =>
                      prueba.Defecto.map((defecto) => (
                        <tr key={prueba} className="border-b border-gray-200">
                          <td className="py-3 px-1">{proyecto.Proyecto}</td>
                          <td className="py-3 px-1">{hito.Descripcion}</td>
                          <td className="py-3 px-1">{prueba.Nombre}</td>
                          <td className="py-3 px-1">{defecto.Nombre}</td>
                          <td className="py-3 px-1">{defecto.Resolucion}</td>
                          <td className="py-3 px-1">{defecto.Propietario}</td>
                          <td className="py-3 px-1">{defecto.Resuelto}</td>
                          <td className="py-3 px-1">{defecto.Tiempo}</td>
                        </tr>
                      ))
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reportes;
