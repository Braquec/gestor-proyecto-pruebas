import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Confirmacion from "./Confirmacion";

const DetalleProject = () => {
  const { id } = useParams();
  const [proyecto, setProyecto] = useState(null);
  const [hitoSeleccionado, setHitoSeleccionado] = useState(null);
  const [indexHito, setIndexHito] = useState(null);
  const [recurso, setRecurso] = useState([]);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [fechaInicioForm, setFechaInicioForm] = useState(null);
  const [fechaFinForm, setFechaFinForm] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    Descripcion: "",
    Propietario: "",
    Fecha_inicio: "",
    Fecha_fin: "",
    Estado: "",
    Porcentaje: "0",
    Prueba: [],
  });
  const estados = [
    "Planificado",
    "En proceso",
    "Pausa",
    "Planificado",
    "Finalizado",
  ];
  const navigate = useNavigate();

  const handleEliminar = (index) => {
    setIndexHito(index);
    setMostrarConfirmacion(true);
  };

  const handleCerrarClick = () => {
    setFormData({
      Descripcion: "",
      Propietario: "",
      Fecha_inicio: "",
      Fecha_fin: "",
      Estado: "",
      Porcentaje: "0",
      Prueba: [],
    }); // Limpiar los datos del formulario
    setIsOpen(false);
  };
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
  const handleEditarClick = (hito, index) => {
    setFechaInicioForm(desformatearFecha(hito.Fecha_inicio));
    setFechaFinForm(desformatearFecha(hito.Fecha_fin));
    setIndexHito(index);
    setFormData(hito);
    setHitoSeleccionado(hito);
    setIsOpen(true);
  };

  const handleConfirmarEliminar = () => {
    // Aquí llamas a la función de eliminación usando el proyectoIdSeleccionado
    eliminarHito(indexHito);
    setMostrarConfirmacion(false); // Ocultar el modal después de eliminar
  };

  const obtenerProyecto = async () => {
    try {
      // Hacer una solicitud al backend para obtener el proyecto por su ID
      const response = await axios.get(
        `https://us-central1-my-project-pg-e4715.cloudfunctions.net/app/api/proyectos/${id}`
      );
      setProyecto(response.data);
    } catch (error) {
      console.error("Error al obtener el proyecto:", error);
    }
  };

  const obtenerRecurso = async () => {
    try {
      const response = await axios.get(
        `https://us-central1-my-project-pg-e4715.cloudfunctions.net/app/api/proyectos/${id}/recurso`
      );
      setRecurso(response.data);
    } catch (error) {
      console.error("Error al obtener recurso:", error);
    }
  };
  const agregarHito = (proyecto) => {
    navigate(`/proyecto/hito/crear/${proyecto.id}`); // Redirige a crear hito
  };

  const eliminarHito = async (index) => {
    try {
      await axios.delete(
        `https://us-central1-my-project-pg-e4715.cloudfunctions.net/app/api/proyectos/${id}/hito/${index}`
      );
      setMostrarConfirmacion(false);
      obtenerProyecto(); // Refrescar lista después de eliminar
    } catch (error) {
      console.error("Error al eliminar el proyecto:", error);
    }
  };

  const detallePruebas = (proyecto, index) => {
    navigate(`/proyecto/pruebas/${proyecto}/${index}`); // Redirige a detalle tareas
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //Formateo las fechas ya que vienen en formato mmddyyyy
      formData.Fecha_inicio = formatearFecha(fechaInicioForm);
      formData.Fecha_fin = formatearFecha(fechaFinForm);
      await axios.put(
        /*`http://localhost:5001/my-project-pg-e4715/us-central1/app/api/proyectos/${id}/hito/${indexHito}`,*/
        `https://us-central1-my-project-pg-e4715.cloudfunctions.net/app/api/proyectos/${id}/hito/${indexHito}`,
        formData
      );
      alert("Hito modificado con exito");
      obtenerProyecto();
      setIsOpen(false);
    } catch (error) {
      console.error("Error al modificar el hito", error);
    }
  };

  useEffect(() => {
    // Verificar si el token esta en el localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      // Redirigir al login si no hay token
      navigate("/");
    }

    obtenerProyecto();
    obtenerRecurso();
  }, [navigate]);
  // Si no hay proyecto, mostramos un mensaje de carga
  if (!proyecto) {
    return (
      <div className="App">
        <Header />
        <div className="text-center">Cargando proyecto...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />

      <div className="container mx-auto p-6 relative p-4">
        <h1 className="text-5xl font-bold mb-6 text-center">
          {proyecto.Proyecto}
        </h1>

        <h2 className="text-3xl font-semibold mb-4">Hitos</h2>

        <div className="flex justify-between mb-4">
          <Link
            to="/home"
            className="bg-blue-500 text-white px-4 py-2 font-bold rounded-md hover:bg-blue-600"
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
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </Link>

          <button
            onClick={() => agregarHito(proyecto)}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
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
          </button>
        </div>

        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-3 px-6 text-center">Hito</th>
              <th className="py-3 px-6 text-center">Propietario</th>
              <th className="py-3 px-6 text-center">Estado</th>
              <th className="py-3 px-6 text-center">%</th>
              <th className="py-3 px-6 text-center">Fecha inicio</th>
              <th className="py-3 px-6 text-center">Fecha fin</th>
              <th className="py-3 px-6 text-center">Pruebas</th>
              <th className="py-3 px-6 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {proyecto.Hito?.map((hito, index) => (
              <tr key={hito.Descripcion}>
                <td className="py-3 px-1">{hito.Descripcion}</td>
                <td className="py-3 px-1">{hito.Propietario}</td>
                <td className="py-3 px-1">
                  <span
                    className="px-2 inline-flex text-xs leading-5
                      font-semibold rounded-full bg-gray-100 text-gray-800"
                  >
                    {hito.Estado}
                  </span>
                  {/*<select
                    name="Estado"
                    value={selectedValue}
                    onChange={(e) =>
                      handleHitoUpdate(proyecto.id, hito.Estado, e.target.value)
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {estados.map((estado, index) => (
                      <option key={index} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>*/}
                </td>
                <td className="py-3 px-1">
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${hito.Porcentaje}%` }}
                    ></div>
                  </div>
                  {/* Mostrar el porcentaje */}
                  <span className="text-sm text-gray-600 ml-2">
                    {hito.Porcentaje}%
                  </span>
                </td>
                <td className="py-3 px-1">{hito.Fecha_inicio}</td>
                <td className="py-3 px-1">{hito.Fecha_fin}</td>
                <td className="py-3 px-1">
                  <button
                    onClick={() => detallePruebas(proyecto.id, index)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    {hito.Prueba ? hito.Prueba.length : 0}
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleEditarClick(hito, index)}
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
                  {hito.Prueba?.length > 0 ? (
                    <span></span>
                  ) : (
                    <button
                      onClick={() => handleEliminar(index)}
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
                  )}
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
      </div>
      {/* Formulario flotante */}
      <div className="relative">
        {isOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-10">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Modificar hito</h2>

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
                {hitoSeleccionado?.Descripcion}
              </h1>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    name="Descripcion"
                    value={formData.Descripcion}
                    onChange={handleInputChange}
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Propietario
                  </label>
                  <select
                    name="Propietario"
                    value={formData.Propietario}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">--Seleccione un recurso--</option>
                    {recurso.map((recurso) => (
                      <option key={recurso.Nombre} value={recurso.Nombre}>
                        {recurso.Nombre} - {recurso.Rol}
                      </option>
                    ))}
                  </select>
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

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600 transition duration-300"
                >
                  Actualizar hito
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetalleProject;
