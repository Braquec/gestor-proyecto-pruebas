import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DefectosForm = () => {
  const { prueba } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const toggleForm = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="App">
      <div className="relative">
        {/* Botón para abrir el formulario */}
        <button
          onClick={toggleForm}
          className="fixed bottom-5 right-5 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
        >
          {isOpen ? "Cerrar Formulario" : "Abrir Formulario"}
        </button>

        {/* Formulario flotante */}
        {isOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Formulario flotante</h2>

              <form>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Ingresa tu nombre"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Correo
                  </label>
                  <input
                    type="email"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Ingresa tu correo"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600 transition duration-300"
                >
                  Enviar
                </button>
              </form>

              {/* Botón de cierre */}
              <button
                onClick={toggleForm}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                X
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DefectosForm;
