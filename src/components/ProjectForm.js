import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const ProyectoForm = ({ proyecto, editar }) => {
  const [formData, setFormData] = useState(
    proyecto || {
      Proyecto: "",
      Estado: "En proceso",
      Porcentaje: "0",
      Propietario: "",
      Fecha_inicio: "",
      Fecha_fin: "",
      Url_repo: "",
      Hito: [],
    }
  );
  const estados = ["En proceso", "Pausa", "Planificado", "Finalizado"];

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función para convertir la fecha de yyyy-mm-dd a dd-mm-yyyy
  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const [year, month, day] = fecha.split("-");
    return `${day}-${month}-${year}`;
  };

  const desformatearFecha = (fecha) => {
    if (!fecha) return "";
    const [day, month, year] = fecha.split("-");
    return `${year}-${month}-${day}`;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editar) {
        await axios.put(
          `https://us-central1-my-project-pg-e4715.cloudfunctions.net/app/api/proyectos/${proyecto.id}`,
          formData
        );
      } else {
        //Formateo las fechas ya que vienen en formato mmddyyyy
        formData.Fecha_inicio = formatearFecha(formData.Fecha_inicio);
        formData.Fecha_fin = formatearFecha(formData.Fecha_fin);
        await axios.post(
          "https://us-central1-my-project-pg-e4715.cloudfunctions.net/app/api/proyectos",
          formData
        );
      }
      alert("Proyecto agregado con exito");
      navigate("/home"); // Redirige al listado de proyectos después de crear/editar
    } catch (error) {
      console.error("Error al enviar el formulario", error);
    }
  };
  const handleCancel = async (e) => {
    e.preventDefault();
    navigate("/home");
  };

  useEffect(() => {
    // Verifica si el token está en localStorage
    const token = localStorage.getItem("token");

    // Si no hay token, redirige al login
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="App">
      <Header />
      <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Agregar Nuevo Proyecto
        </h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Nombre del proyecto:
            </label>
            <input
              name="Proyecto"
              value={formData.Proyecto}
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
              /*className="w-full px-4 py-2 border rounded-lg"*/
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
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Fecha de Inicio
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
          <label className="block text-gray-700 font-semibold mb-2">
            Propietario:
          </label>
          <input
            name="Propietario"
            value={formData.Propietario}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            {editar ? "Actualizar" : "Crear"} Proyecto
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
  );
};

export default ProyectoForm;
