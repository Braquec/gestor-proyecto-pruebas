import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const RecursoForm = ({ recurso }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [proyecto, setProyecto] = useState([]);

  const [formData, setFormData] = useState(
    recurso || {
      Nombre: "",
      Rol: "Project Manager",
    }
  );

  const roles = ["Project Manager", "Developer", "QA/Tester", "Key-user"];
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `https://us-central1-my-project-pg-e4715.cloudfunctions.net/app/api/proyectos/${proyecto.id}/recurso`,
        formData
      );
      alert("Recurso agregado");
      obtenerProyecto();
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
    navigate(`/home`); // Redirige al home
  };

  useEffect(() => {
    // Verificar si el token esta en el localStorage
    const token = localStorage.getItem("token");
    obtenerProyecto();
    if (!token) {
      // Redirigir al login si no hay token
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="App">
      <Header />
      <div className="container mx-auto p-6 relative p-4">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Recursos proyecto: {proyecto.Proyecto}
        </h1>
        <div className="flex justify-start mb-4">
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
                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
              />
            </svg>
          </Link>
        </div>
        {
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="py-3 px-6 text-center">Nombre</th>
                <th className="py-3 px-6 text-center">Rol</th>
              </tr>
            </thead>
            <tbody>
              {proyecto.Recurso?.map((recurso) => (
                <tr key={recurso.Nombre}>
                  <td className="py-3 px-1">{recurso.Nombre}</td>
                  <td className="py-3 px-1">{recurso.Rol}</td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
      <div className="container mx-auto p-6 relative p-4">
        <div>
          <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Agregar recurso
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
                  Rol
                </label>
                <select
                  name="Rol"
                  value={formData.Rol}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {roles.map((rol, index) => (
                    <option key={index} value={rol}>
                      {rol}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
              >
                Agregar recurso
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecursoForm;
