import React, { useEffect, useState } from "react";
import Header from "./Header";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Confirmacion from "./Confirmacion";

const DetalleDefectos = () => {
  const { id, indexHito, indexPrueba } = useParams();
  const [prueba, setPrueba] = useState(null);
  const [defecto, setDefecto] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [recurso, setRecurso] = useState([]);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [indexDefecto, setIndexDefecto] = useState(false);
  const estados = ["Planificado", "Completado", "En proceso"];
  const [formData, setFormData] = useState({
    Nombre: "",
    Propietario: "",
    Estado: "",
    Resolucion: "",
    Resuelto: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleForm = () => {
    setIsOpen(!isOpen);
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
  const obtenerDefectos = async () => {
    try {
      // Llamar al backend para obtener los hitos y pruebas
      const response = await axios.get(
        `https://us-central1-my-project-pg-e4715.cloudfunctions.net/app/api/proyectos/${id}/hito/${indexHito}/prueba/${indexPrueba}/defecto`
      );

      setDefecto(response.data.defectos);
      setPrueba(response.data.prueba);
    } catch (error) {
      console.error("Error al obtener los hitos y pruebas:", error);
    }
  };

  const regresarDetalle = (id) => {
    navigate(`/proyecto/pruebas/${id}/${indexHito}`); // Redirige al detalle pruebas
  };

  const handleEliminar = (index) => {
    setIndexDefecto(index);
    setMostrarConfirmacion(true);
  };

  const eliminarDefecto = async () => {
    try {
      await axios.delete(
        `https://us-central1-my-project-pg-e4715.cloudfunctions.net/app/api/proyectos/${id}/hito/${indexHito}/prueba/${indexPrueba}/defecto/${indexDefecto}`
      );
      obtenerDefectos();
      setMostrarConfirmacion(false);
    } catch (error) {
      console.error("Error al eliminar el proyecto:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //Formateo las fechas ya que vienen en formato mmddyyyy
      await axios.post(
        `https://us-central1-my-project-pg-e4715.cloudfunctions.net/app/api/proyectos/${id}/hito/${indexHito}/prueba/${indexPrueba}/defecto`,
        formData
      );
      alert("Defecto agregado con exito");
      obtenerDefectos();
      toggleForm();
      //navigate(`/proyecto/${proyecto.id}`); // Redirige al detalle de proyecto
    } catch (error) {
      console.error("Error al enviar el formulario", error);
    }
  };
  useEffect(() => {
    // Verificar si el token esta en el localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirigir al login si no hay token
      navigate("/");
    }

    obtenerDefectos();
    obtenerRecurso();
  }, [navigate]);

  return (
    <div>
      <Header />
      <div className="container mx-auto mt-10">
        <div className="flex justify-between mb-4">
          <button
            onClick={() => regresarDetalle(id)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
              />
            </svg>
          </button>

          <button
            onClick={() => toggleForm()}
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
        <h1 className="text-4xl font-semibold mb-4">
          Defectos asignados a prueba: {prueba?.Nombre}
        </h1>
        {defecto?.length === 0 ? (
          <p>
            No se encontraron defectos, presione el boton "+" para agregar
            defectos
          </p>
        ) : (
          <div key={indexPrueba} className="mb-6">
            {defecto?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.keys(defecto).map((defectoKey) => {
                  const def = defecto[defectoKey];
                  return (
                    <div
                      key={defectoKey}
                      className="relative bg-white p-6 rounded-lg shadow-lg mb-6"
                    >
                      <button
                        onClick={() => handleEliminar(defectoKey)}
                        className="absolute top-2 right-2 bg-red-500 text-white font-bold py-1 px-3 rounded-lg hover:bg-red-700"
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
                      <h3 className="text-lg font-semibold mb-2">
                        <b>{def.Nombre}</b>
                      </h3>
                      <p className="text-gray-700 mb-4">
                        <b>Recurso: </b>
                        {def.Propietario}
                      </p>
                      <p className="text-gray-700 mb-4">
                        <b>Resolucion: </b>
                        {def.Resolucion}
                      </p>
                      <p className="text-gray-700 mb-4">
                        <b>Estado: </b>
                        {def.Estado}
                      </p>
                      <p className="text-gray-700 mb-4">
                        <b>Resuelto?: </b> {def.Resuelto}
                      </p>
                      <button
                        className="mt-3 bg-green-500 text-white py-2 px-4 rounded"
                        /*onClick={() => handleEditarClick(prueba, pruebaKey)*/
                      >
                        Editar
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>
                No se encontraron defectos, presione el boton "+" para agregar
                una nueva prueba
              </p>
            )}
          </div>
        )}
      </div>
      <Confirmacion
        mostrar={mostrarConfirmacion}
        onConfirm={eliminarDefecto}
        onCancel={() => setMostrarConfirmacion(false)}
      />
      {/* Formulario flotante */}
      <div className="relative">
        {isOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl ">
                  Defecto para <b>{prueba?.Nombre}</b>
                </h2>
                <button
                  onClick={toggleForm}
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

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    name="Nombre"
                    value={formData.Nombre}
                    onChange={handleInputChange}
                    type="text"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Nombre defecto"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Recurso
                  </label>
                  <select
                    name="Propietario"
                    value={formData.Propietario}
                    onChange={handleInputChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                  <label className="block text-sm font-medium text-gray-700">
                    Resolucion
                  </label>
                  <input
                    name="Resolucion"
                    value={formData.Resolucion}
                    onChange={handleInputChange}
                    type="text"
                    className="mt-1 p-6 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Resolucion defecto"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Estado
                  </label>
                  <select
                    name="Estado"
                    value={formData.Estado}
                    onChange={handleInputChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">--Seleccione un estado--</option>
                    {estados.map((estado, index) => (
                      <option key={index} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Resuelto
                  </label>
                  <select
                    name="Resuelto"
                    value={formData.Resuelto}
                    onChange={handleInputChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">--Seleccione una opcion--</option>
                    <option key="1" value="Sí">
                      Sí
                    </option>
                    <option key="2" value="No">
                      No
                    </option>
                    <option key="3" value="Pendiente">
                      Pendiente
                    </option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600 transition duration-300"
                >
                  Enviar
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetalleDefectos;
