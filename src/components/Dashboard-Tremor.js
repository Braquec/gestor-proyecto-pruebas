import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, BarChart, Title } from "@tremor/react";
import Header from "./Header";

const Dashboard = () => {
  const [metricasGlobales, setMetricasGlobales] = useState([]);

  useEffect(() => {
    const fetchMetricasGlobales = async () => {
      try {
        const response = await axios.get(
          "https://us-central1-my-project-pg-e4715.cloudfunctions.net/app/api/proyecto/metricas"
        );
        setMetricasGlobales(response.data);
      } catch (error) {
        console.error("Error al obtener las métricas globales:", error);
      }
    };

    fetchMetricasGlobales();
  }, []);

  if (metricasGlobales.length === 0) {
    return <div>Cargando métricas globales...</div>;
  }

  // Preparar los datos para el gráfico de barras
  const dataParaGrafico = metricasGlobales.map((proyecto) => ({
    nombreProyecto: proyecto.nombreProyecto,
    hitos: proyecto.totalHitos,
    pruebas: proyecto.totalPruebas,
    defectos: proyecto.totalDefectos,
    defectosAbiertos: proyecto.defectosAbiertos,
    defectosCerrados: proyecto.defectosCerrados,
  }));

  return (
    <div className="App">
      <Header />
      <div className="container mx-auto p-6">
        <Title className="text-3xl font-bold text-center mb-8">
          Métricas Globales de Proyectos
        </Title>

        <Card>
          <Title>Total de Hitos por Proyecto</Title>
          <BarChart
            className="h-80"
            data={dataParaGrafico}
            index="nombreProyecto"
            categories={["hitos"]}
            colors={["blue"]}
            marginTop="mt-6"
          />
        </Card>

        <Card className="mt-8">
          <Title>Total de Pruebas por Proyecto</Title>
          <BarChart
            data={dataParaGrafico}
            dataKey="nombreProyecto"
            categories={["pruebas"]}
            colors={["green"]}
            marginTop="mt-6"
          />
        </Card>

        <Card className="mt-8">
          <Title>Total de Defectos por Proyecto</Title>
          <BarChart
            data={dataParaGrafico}
            dataKey="nombreProyecto"
            categories={["defectos", "defectosAbiertos", "defectosCerrados"]}
            colors={["red", "yellow", "green"]}
            marginTop="mt-6"
          />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
