import React, { useEffect, useState } from "react";
import Header from "./Header";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Confirmacion from "./Confirmacion";

const DetallePruebas = () => {
  const { id, index } = useParams();
  const [nombreProyecto, setNombreProyecto] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hito, setHito] = useState([]);
  const [recurso, setRecurso] = useState([]);
  const [modoEditar, setModoEditar] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [pruebaIndexSeleccionado, setPruebaIndexSeleccionado] = useState(null);
  const [fechaInicioForm, setFechaInicioForm] = useState(null);
  const [fechaFinForm, setFechaFinForm] = useState(null);
  const estados = ["Planificado", "En proceso", "Pausa", "Finalizado"];
  const resultados = ["Pendiente", "Exitoso", "Erroneo"];
  const [formData, setFormData] = useState({
    Nombre: "",
    Estado: "Planificado",
    Propietario: "",
    Fecha_inicio: "",
    Fecha_fin: "",
    Comentario: "",
    Archivo_adjunto: "",
    Criterio_aceptacion: "",
    Resultado: "Pendiente",
    Defecto: [],
  });
  const navigate = useNavigate();

  const handleAgregarClick = () => {
    setFormData({
      Nombre: "",
      Estado: "",
      Propietario: "",
      Fecha_inicio: "",
      Fecha_fin: "",
      Comentario: "",
      Archivo_adjunto: "",
      Criterio_aceptacion: "",
      Resultado: "",
      Defecto: [],
    }); // Limpiar los datos del formulario
    setFechaInicioForm("");
    setFechaFinForm("");
    setModoEditar(false); // Establecer modo agregar
    toggleForm();
  };

  const handleEditarClick = (prueba, index) => {
    setFechaInicioForm(desformatearFecha(prueba.Fecha_inicio));
    setFechaFinForm(desformatearFecha(prueba.Fecha_fin));
    setFormData(prueba);
    setPruebaIndexSeleccionado(index); //Establecer index de prueba
    setModoEditar(true); // Establecer modo agregar
    toggleForm();
  };

  const handleCerrarClick = () => {
    setFormData({
      Nombre: "",
      Estado: "",
      Propietario: "",
      Fecha_inicio: "",
      Fecha_fin: "",
      Comentario: "",
      Archivo_adjunto: "",
      Criterio_aceptacion: "",
      Resultado: "",
      Defecto: [],
    }); // Limpiar los datos del formulario
    toggleForm();
  };
  const toggleForm = () => {
    setIsOpen(!isOpen);
  };

  const regresarDetalle = (id) => {
    navigate(`/proyecto/${id}`); // Redirige a detalle proyecto
  };

  const verDefectos = (id, indexHito, indexPrueba) => {
    navigate(`/proyecto/pruebas/defectos/${id}/${indexHito}/${indexPrueba}`); // Redirige agregar prueba
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "Fecha_fin":
        setFechaFinForm(value);
        break;
      case "Fecha_inicio":
        setFechaInicioForm(value);
      default:
        setFormData({ ...formData, [name]: value });
        break;
    }
  };

  const obtenerHitos = async () => {
    try {
      // Llamar al backend para obtener los hitos y pruebas
      const response = await axios.get(
        `https://us-central1-my-project-pg-e4715.cloudfunctions.net/app/api/proyectos/${id}/prueba`
      );
      setNombreProyecto(response.data.proyecto);
      setHito(response.data.hitos[index]);
    } catch (error) {
      console.error("Error al obtener los hitos y pruebas:", error);
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

  const handleEliminar = (index) => {
    setPruebaIndexSeleccionado(index);
    setMostrarConfirmacion(true);
  };

  const eliminarPrueba = async () => {
    try {
      await axios.delete(
        `https://us-central1-my-project-pg-e4715.cloudfunctions.net/app/api/proyectos/${id}/hito/${index}/prueba/${pruebaIndexSeleccionado}`
      );
      obtenerHitos();
      setMostrarConfirmacion(false);
    } catch (error) {
      console.error("Error al eliminar el proyecto:", error);
    }
  };
  const handleSubmit = async (e, nuevaPrueba) => {
    e.preventDefault();
    if (modoEditar) {
      try {
        //Formateo las fechas ya que vienen en formato mmddyyyy
        formData.Fecha_inicio = formatearFecha(fechaInicioForm);
        formData.Fecha_fin = formatearFecha(fechaFinForm);

        const response = await axios.put(
          `https://us-central1-my-project-pg-e4715.cloudfunctions.net/app/api/proyectos/${id}/hito/${index}/prueba/${pruebaIndexSeleccionado}`,
          formData
        );
        obtenerHitos();
        if (response.ok) {
        } else {
          console.error("Error al actualizar la prueba");
        }
        toggleForm();
      } catch (error) {
        console.error("Error al enviar el formulario", error);
      }
    } else {
      try {
        //Formateo las fechas ya que vienen en formato mmddyyyy
        formData.Fecha_inicio = formatearFecha(fechaInicioForm);
        formData.Fecha_fin = formatearFecha(fechaFinForm);
        await axios.post(
          `https://us-central1-my-project-pg-e4715.cloudfunctions.net/app/api/proyectos/${id}/hito/${index}/prueba`,
          formData
        );
        alert("Prueba registrada con exito!");
        toggleForm();
        obtenerHitos();
      } catch (error) {
        console.error("Error al enviar el formulario", error);
      }
    }
  };

  useEffect(() => {
    // Verificar si el token esta en el localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirigir al login si no hay token
      navigate("/");
    }
    obtenerRecurso();
    obtenerHitos();
  }, [navigate]);
  return (
    <div className="App">
      <Header />
      <div className="container mx-auto mt-10">
        <h1 className="text-4xl font-bold mb-6">Pruebas: {nombreProyecto}</h1>

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
            onClick={handleAgregarClick}
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
        {hito.length === 0 ? (
          <p>No se encontraron pruebas</p>
        ) : (
          <div key={index} className="mb-6">
            <h1 className="text-4xl font-semibold mb-4">
              Hito: {hito.Descripcion}
            </h1>
            {/*Muestra por CARD por cada prueba*/}
            {hito.Prueba?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.keys(hito.Prueba).map((pruebaKey) => {
                  const prueba = hito.Prueba[pruebaKey];
                  return (
                    <div
                      key={pruebaKey}
                      className="relative bg-white p-6 rounded-lg shadow-lg mb-6"
                    >
                      <button
                        onClick={() => handleEliminar(pruebaKey)}
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
                      <h3 className="text-2xl font-bold mb-2">
                        {prueba.Nombre}
                      </h3>
                      <p className="text-gray-700 mb-4">
                        <b>Estado: </b>
                        {prueba.Estado}
                      </p>
                      <p className="text-gray-700 mb-4">
                        <b>Recurso: </b>
                        {prueba.Propietario}
                      </p>
                      <p className="text-gray-700 mb-4">
                        <b>Fecha inicio: </b>
                        {prueba.Fecha_inicio}
                      </p>
                      <p className="text-gray-700 mb-4">
                        <b>Fecha fin: </b>
                        {prueba.Fecha_fin}
                      </p>
                      <p className="text-gray-700 mb-4">
                        <b>Comentario: </b>
                        {prueba.Comentario}
                      </p>
                      <p className="text-gray-700 mb-4">
                        <b>Archivo adjunto: </b>
                        {prueba.Archivo_adjunto}
                      </p>
                      <p className="text-gray-700 mb-4">
                        <b>Criterio aceptacion: </b>
                        {prueba.Criterio_aceptacion}
                      </p>
                      <p className="text-gray-700 mb-4">
                        <b>Resultado: </b>
                        {prueba.Resultado}
                      </p>
                      <button
                        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                        onClick={() => verDefectos(id, index, pruebaKey)}
                      >
                        Ver defectos: <b>{prueba.Defecto?.length}</b>
                      </button>
                      <button
                        className="mt-3 bg-green-500 text-white py-2 px-4 rounded"
                        onClick={() => handleEditarClick(prueba, pruebaKey)}
                      >
                        Editar
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>
                No se encontraron pruebas, presione el boton "+" para agregar
                una nueva prueba
              </p>
            )}
          </div>
        )}
      </div>
      <Confirmacion
        mostrar={mostrarConfirmacion}
        onConfirm={eliminarPrueba}
        onCancel={() => setMostrarConfirmacion(false)}
      />
      {/* Formulario flotante */}
      <div className="relative">
        {isOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-10">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {modoEditar ? "Editar Prueba" : "Agregar Nueva Prueba"}
                </h2>
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
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre prueba"
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
                  >
                    {estados.map((estado, index) => (
                      <option key={index} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Recurso
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
                  <label className="block text-sm font-medium text-gray-700">
                    Fecha inicio
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
                  <label className="block text-sm font-medium text-gray-700">
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
                  <label className="block text-sm font-medium text-gray-700">
                    Comentario
                  </label>
                  <input
                    type="text"
                    name="Comentario"
                    value={formData.Comentario}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Criterio aceptacion
                  </label>
                  <input
                    type="text"
                    name="Criterio_aceptacion"
                    value={formData.Criterio_aceptacion}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Resultado
                  </label>
                  <select
                    name="Resultado"
                    value={formData.Resultado}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">--Seleccione un estado--</option>
                    {resultados.map((resultado, index) => (
                      <option key={index} value={resultado}>
                        {resultado}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Adjuntar archivo
                  </label>
                  <input
                    type="text"
                    name="Archivo_adjunto"
                    value={formData.Archivo_adjunto}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600 transition duration-300"
                >
                  {modoEditar ? "Editar Prueba" : "Agregar Nueva Prueba"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetallePruebas;
