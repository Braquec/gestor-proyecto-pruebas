import React, { useEffect, useState } from "react";
import Header from "./Header";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PruebaForm = () => {
  const navigate = useNavigate();
  const { id, index } = useParams();
  const [proyecto, setProyecto] = useState([]);
  const [recurso, setRecurso] = useState([]);
  const estados = ["En proceso", "Pausa", "Planificado", "Finalizado"];
  const resultados = ["Exitoso", "Erroneo", "Pendiente"];
  const [formData, setFormData] = useState({
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
  });

  const handleCancel = async (e) => {
    e.preventDefault();
    navigate(`/proyecto/pruebas/${id}/${index}`); // Redirige a detalle tareas
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
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const [year, month, day] = fecha.split("-");
    return `${day}-${month}-${year}`;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //Formateo las fechas ya que vienen en formato mmddyyyy
      formData.Fecha_inicio = formatearFecha(formData.Fecha_inicio);
      formData.Fecha_fin = formatearFecha(formData.Fecha_fin);
      await axios.post(
        `https://us-central1-my-project-pg-e4715.cloudfunctions.net/app/api/proyectos/${id}/hito/${index}/prueba`,
        formData
      );
      alert("Prueba registrada con exito!");
      navigate(`/proyecto/pruebas/${id}/${index}`); // Redirige a detalle tareas
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
    obtenerRecurso();
  }, [navigate]);

  return (
    <div className="App">
      <Header />
      <div className="container mx-auto p-6 relative p-4">
        <div>
          <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Registrar prueba
            </h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Nombre
                </label>
                <input
                  name="Nombre"
                  value={formData.Nombre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
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
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Recurso
                </label>
                <select
                  name="Propietario"
                  value={formData.Propietario}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {}
                  {recurso.map((recurso) => (
                    <option key={recurso.Nombre} value={recurso.Nombre}>
                      {recurso.Nombre} - {recurso.Rol}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Fecha inicio
                </label>
                <input
                  type="date"
                  name="Fecha_inicio"
                  value={formData.Fecha_inicio}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Fecha fin
                </label>
                <input
                  type="date"
                  name="Fecha_fin"
                  value={formData.Fecha_fin}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Comentario
                </label>
                <input
                  type="text"
                  name="Comentario"
                  value={formData.Comentario}
                  onChange={handleInputChange}
                  className="w-full px-4 py-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Criterio aceptacion
                </label>
                <input
                  type="text"
                  name="Criterio_aceptacion"
                  value={formData.Criterio_aceptacion}
                  onChange={handleInputChange}
                  className="w-full px-4 py-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Resultado:
                </label>
                <select
                  name="Resultado"
                  value={formData.Resultado}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {resultados.map((resultado, index) => (
                    <option key={index} value={resultado}>
                      {resultado}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
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
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              >
                Registrar prueba
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-5 rounded mt-4"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PruebaForm;
