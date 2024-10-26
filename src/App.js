import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../src/components/Login";
import Register from "../src/components/Register";
import Home from "../src/components/Home";
import PrivateRoute from "../src/components/PrivateRoute";
import ProjectForm from "../src/components/ProjectForm";
import DetalleProject from "../src/components/DetalleProject";
import RecursoForm from "../src/components/RecursoForm";
import HitoForm from "./components/HitoForm";
import DetallePruebas from "./components/DetallePruebas";
import PruebaForm from "./components/PruebaForm";
import DetalleDefectos from "./components/DetalleDefectos";
import DefectosForm from "./components/DefectosForm";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registrar" element={<Register />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/proyectos/crear"
            element={
              <PrivateRoute>
                <ProjectForm />
              </PrivateRoute>
            }
          />
          {/* Ruta dinámica para el detalle del proyecto */}
          <Route
            path="/proyecto/:id"
            element={
              <PrivateRoute>
                <DetalleProject />
              </PrivateRoute>
            }
          />
          <Route
            path="/proyecto/hito/crear/:id"
            element={
              <PrivateRoute>
                <HitoForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/proyecto/recurso/crear/:id"
            element={
              <PrivateRoute>
                <RecursoForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/proyecto/pruebas/:id/:index"
            element={
              <PrivateRoute>
                <DetallePruebas />
              </PrivateRoute>
            }
          />
          <Route
            path="/proyecto/pruebas/crear/:id/:index"
            element={
              <PrivateRoute>
                <PruebaForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/proyecto/pruebas/defectos/:id/:indexHito/:indexPrueba"
            element={
              <PrivateRoute>
                <DetalleDefectos />
              </PrivateRoute>
            }
          />
          <Route
            path="/proyecto/pruebas/defectos/:prueba"
            element={
              <PrivateRoute>
                <DefectosForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
