import React from "react";
import appFirebase from "../credenciales";
import { getAuth, signOut } from "firebase/auth";
import { Link, Navigate, useNavigate } from "react-router-dom";

// Definimos el componente Header
const Header = () => {
  const navigate = useNavigate();
  const auth = getAuth(appFirebase);

  const onSignOut = () => {
    signOut(auth).then(() => {
      localStorage.removeItem("token");
      navigate("/");
    });
  };

  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo o nombre de la marca */}
        <div className="text-2xl font-bold">
          <Link to="/home">Inicio</Link>
        </div>

        {/* Menú de navegación */}
        <nav className="space-x-6 hidden md:flex">
          {/*
          <Link to="/home" className="hover:text-gray-400">
            Hitos
          </Link>
          <Link to="/home" className="hover:text-gray-400">
            Pruebas
          </Link>
          <Link to="/home" className="hover:text-gray-400">
            Defectos
          </Link>
          */}
          <Link to="/dashboard">Dashboard</Link>
        </nav>

        {/* Botón de cerrar sesion */}
        <div className="hidden md:block">
          <a href="/" onClick={onSignOut}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-7"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
          </a>
        </div>

        {/* Menú móvil (solo visible en pantallas pequeñas) */}
        <div className="md:hidden">
          <button className="text-white focus:outline-none">
            {/* Ícono del menú hamburguesa */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
