import React, { useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Confirmacion from "./Confirmacion";

export const Home = () => {
  const [idProyecto, setIdProyecto] = useState(null);
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [fechaInicioForm, setFechaInicioForm] = useState(null);
  const [fechaFinForm, setFechaFinForm] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    Proyecto: "",
    Estado: "",
    Porcentaje: "0",
    Propietario: "",
    Fecha_inicio: "",
    Fecha_fin: "",
    Url_repo: "",
    Hito: [],
  });
  const estados = ["En proceso", "Pausa", "Planificado", "Finalizado"];
  const navigate = useNavigate();

  const obtenerProyectos = async () => {
    try {
      const response = await axios.get(
        `https://us-central1-my-project-pg-e4715.cloudfunctions.net/app/api/proyectos`
      );
      setProyectos(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener proyectos:", error);
      setLoading(false);
    }
  };

  const eliminarProyecto = async (id) => {
    try {
      await axios.delete(
        `https://us-central1-my-project-pg-e4715.cloudfunctions.net/app/api/proyectos/${id}`
      );
      obtenerProyectos(); // Refrescar lista después de eliminar
      setMostrarConfirmacion(false);
    } catch (error) {
      console.error("Error al eliminar el proyecto:", error);
    }
  };

  const agregarRecurso = async (proyecto) => {
    navigate(`/proyecto/recurso/crear/${proyecto.id}`); // Redirige a crear recurso
  };

  // holaa
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "Fecha_fin":
        setFechaFinForm(value);
        break;
      case "Fecha_inicio":
        setFechaInicioForm(value);
        break;
      default:
        setFormData({ ...formData, [name]: value });
        break;
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const [year, month, day] = fecha.split("-");
    return `${day}-${month}-${year}`;
  };

  const desformatearFecha = (fecha) => {
    if (!fecha) return "";
    const [day, month, year] = fecha.split("-");
    return `${year}-${month}-${day}`; //Format para el INPUT
  };

  const handleCerrarClick = () => {
    setFormData({
      Proyecto: "",
      Estado: "En proceso",
      Porcentaje: "0",
      Propietario: "",
      Fecha_inicio: "",
      Fecha_fin: "",
      Url_repo: "",
      Hito: [],
    }); // Limpiar los datos del formulario
    setIsOpen(false);
  };

  const handleEditarClick = (proyecto) => {
    setFechaInicioForm(desformatearFecha(proyecto.Fecha_inicio));
    setFechaFinForm(desformatearFecha(proyecto.Fecha_fin));
    setProyectoSeleccionado(proyecto);
    setFormData(proyecto);
    setIsOpen(true);
  };
  // Función para ver los detalles de un proyecto
  const verDetalleProyecto = (proyecto) => {
    navigate(`/proyecto/${proyecto.id}`); // Redirige al detalle de proyecto
  };

  const handleEliminar = (id) => {
    setIdProyecto(id);
    setMostrarConfirmacion(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //Formateo las fechas ya que vienen en formato mmddyyyy
      formData.Fecha_inicio = formatearFecha(fechaInicioForm);
      formData.Fecha_fin = formatearFecha(fechaFinForm);
      await axios.put(
        `https://us-central1-my-project-pg-e4715.cloudfunctions.net/app/api/proyectos/${proyectoSeleccionado.id}`,
        formData
      );
      alert("Proyecto modificado con exito");
      obtenerProyectos();
      setIsOpen(false);
    } catch (error) {
      console.error("Error al modificar el proyecto", error);
    }
  };
  // Función que maneja la confirmación de la eliminación
  const handleConfirmarEliminar = () => {
    // Aquí llamas a la función de eliminación usando el proyectoIdSeleccionado
    eliminarProyecto(idProyecto);
    setMostrarConfirmacion(false); // Ocultar el modal después de eliminar
  };
  useEffect(() => {
    // Verificar si el token esta en el localStorage
    const token = localStorage.getItem("token");
    obtenerProyectos();
    if (!token) {
      // Redirigir al login si no hay token
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="App">
      <Header />

      <div className="md:ml-50 p-6">
        <h1 className="text-5xl font-bold">Bienvenido</h1>
      </div>
      <p>Para ver los hitos del proyecto presione el nombre del proyecto</p>
      <div className="container mx-auto p-6 relative p-4">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Listado de Proyectos
        </h1>

        <Link
          to="/proyectos/crear"
          className="absolute top-5 right-5 bg-green-500 text-white px-4 py-2 font-bold rounded-md hover:bg-green-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </Link>

        {loading ? (
          <p className="text-center text-gray-600">Cargando proyectos...</p>
        ) : (
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="py-3 px-6 text-center">Proyecto</th>
                <th className="py-3 px-6 text-center">Estado</th>
                <th className="py-3 px-6 text-center">%</th>
                <th className="py-3 px-6 text-center">Propietario</th>
                <th className="py-3 px-6 text-center">Fecha de Inicio</th>
                <th className="py-3 px-6 text-center">Fecha de Fin</th>
                <th className="py-3 px-6 text-center">URL Repositorio</th>
                <th className="py-3 px-6 text-center">Recursos</th>
                <th className="py-3 px-6 text-center"></th>
                <th className="py-3 px-6 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {proyectos.map((proyecto) => (
                <tr key={proyecto.id} className="border-b border-gray-200">
                  <td className="py-3 px-1">
                    <button
                      onClick={() => verDetalleProyecto(proyecto)}
                      className="text-blue-500 hover:underline"
                    >
                      {proyecto.Proyecto}
                    </button>
                  </td>
                  <td className="py-3 px-1">{proyecto.Estado}</td>
                  <td className="py-3 px-1">
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${proyecto.Porcentaje}%` }}
                      ></div>
                    </div>
                    {/* Mostrar el porcentaje */}
                    <span className="text-sm text-gray-600 ml-2">
                      {proyecto.Porcentaje}%
                    </span>
                  </td>
                  <td className="py-3 px-1">{proyecto.Propietario}</td>
                  <td className="py-3 px-1">{proyecto.Fecha_inicio}</td>
                  <td className="py-3 px-1">{proyecto.Fecha_fin || "N/A"}</td>
                  <td className="py-3 px-1">
                    {proyecto.Url_repo == "" ? (
                      "N/A"
                    ) : (
                      <a
                        href={proyecto.Url_repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Ver Repositorio
                      </a>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => agregarRecurso(proyecto)}
                      className="bg-emerald-500 hover:bg-emerald-700 text-black font-bold py-2 px-4 rounded"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                        />
                      </svg>
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleEditarClick(proyecto)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-1 rounded"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleEliminar(proyecto.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-1 rounded"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                    <Confirmacion
                      mostrar={mostrarConfirmacion}
                      onConfirm={handleConfirmarEliminar}
                      onCancel={() => setMostrarConfirmacion(false)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Formulario flotante */}
      <div className="relative">
        {isOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-10">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Modificar proyecto</h2>

                <button
                  onClick={handleCerrarClick}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <h1 className="text-2xl font-bold">
                {proyectoSeleccionado.Proyecto}
              </h1>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    name="Proyecto"
                    value={formData.Proyecto}
                    onChange={handleInputChange}
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Estado:
                  </label>
                  <select
                    name="Estado"
                    value={formData.Estado}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    /*className="w-full px-4 py-2 border rounded-lg"*/
                  >
                    {estados.map((estado, index) => (
                      <option key={index} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Porcentaje:
                  </label>
                  <input
                    name="Porcentaje"
                    type="number"
                    value={formData.Porcentaje}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    placeholder="0-100"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    name="Fecha_inicio"
                    value={fechaInicioForm}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Fecha fin
                  </label>
                  <input
                    type="date"
                    name="Fecha_fin"
                    value={fechaFinForm}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Propietario:
                  </label>
                  <input
                    name="Propietario"
                    value={formData.Propietario}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Url proyecto:
                  </label>
                  <input
                    type="url"
                    name="Url_repo"
                    value={formData.Url_repo}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    pattern="https://.*"
                    size="30"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600 transition duration-300"
                >
                  Actualizar proyecto
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
