import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const HitoForm = ({ hito }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [proyecto, setProyecto] = useState([]);
  const [recurso, setRecurso] = useState([]);

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

  const obtenerProyecto = async () => {
    try {
      const response = await axios.get(
        `https://us-central1-my-project-pg-e4715.cloudfunctions.net/app/api/proyectos/${id}`
      );
      setProyecto(response.data);
    } catch (error) {
      console.error("Error al obtener proyectos:", error);
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
        `https://us-central1-my-project-pg-e4715.cloudfunctions.net/app/api/proyectos/${proyecto.id}/hito`,
        formData
      );
      alert("Hito agregado con exito");
      navigate(`/proyecto/${proyecto.id}`); // Redirige al detalle de proyecto
    } catch (error) {
      console.error("Error al enviar el formulario", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    navigate(`/proyecto/${proyecto.id}`); // Redirige al detalle de proyecto
  };
  useEffect(() => {
    // Verificar si el token esta en el localStorage
    const token = localStorage.getItem("token");
    obtenerProyecto();
    obtenerRecurso();
    if (!token) {
      // Redirigir al login si no hay token
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="App">
      <Header />
      <div className="container mx-auto p-6 relative p-4">
        <div>
          <h1 className="text-5xl font-bold mb-6 text-center">
            Proyecto: {proyecto.Proyecto}
          </h1>
        </div>
        <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Agregar Hito
          </h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Hito
              </label>
              <input
                name="Descripcion"
                value={formData.Descripcion}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
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
                Recurso
              </label>
              <div className="flex justify-between items-center mb-2">
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

                <Link
                  to={`/proyecto/recurso/crear/${proyecto.id}`}
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
                </Link>
              </div>
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
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Crear hito
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
  );
};

export default HitoForm;
