// src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // Obtener el token de localStorage (o el estado de autenticación)
  const token = localStorage.getItem("token");

  // Si no hay token, redirigir al login
  if (!token) {
    return <Navigate to="/" />;
  }

  // Si hay token, mostrar el componente protegido
  return children;
};

export default PrivateRoute;
