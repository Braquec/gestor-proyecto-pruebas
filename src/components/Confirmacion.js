import React from "react";

const Confirmacion = ({ mostrar, onConfirm, onCancel }) => {
  if (!mostrar) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold text-gray-800">
          Confirmar eliminación
        </h2>
        <p className="mt-4 text-gray-600">
          ¿Estás seguro de que deseas eliminar este registro? Esta acción no se
          puede deshacer.
        </p>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmacion;
