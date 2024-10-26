import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactECharts from "echarts-for-react";
import Header from "./Header";

const Dashboard = () => {
  const [data, setData] = useState({
    proyectos: [],
    hitos: [],
    pruebas: [],
    defectos: [],
  });
  const [dataPiePruebas, setDataPiePruebas] = useState([
    {
      value: 0,
      name: "Prueba",
    },
  ]);
  const [dataPieDefectos, setDataPieDefectos] = useState([
    {
      value: 0,
      name: "Defecto",
    },
  ]);

  const colorPalette = ["#00b04f", "#ffbf00", "#ED0000"];

  useEffect(() => {
    const fetchMetricas = async () => {
      try {
        const response = await axios.get(
          "https://us-central1-my-project-pg-e4715.cloudfunctions.net/app/api/proyecto/metricas"
        );

        const proyectos = response.data.map((item) => item.nombreProyecto);
        const hitos = response.data.map((item) => item.totalHitos);
        const pruebas = response.data.map((item) => item.totalPruebas);
        const defectos = response.data.map((item) => item.totalDefectos);
        setData({ proyectos, hitos, pruebas, defectos });

        const responseGlobal = await axios.get(
          "https://us-central1-my-project-pg-e4715.cloudfunctions.net/app/api/proyecto/metricas/all"
        );

        setDataPiePruebas([
          {
            value: responseGlobal.data.totalPruebasExitosas,
            name: "Pruebas exitosas",
          },
          {
            value: responseGlobal.data.totalPruebasPendientes,
            name: "Pruebas pendientes",
          },
          {
            value: responseGlobal.data.totalPruebasErroneas,
            name: "Pruebas erroneas",
          },
        ]);
        setDataPieDefectos([
          {
            value: responseGlobal.data.defectosCerrados,
            name: "Defectos Cerrados",
          },
          {
            value: responseGlobal.data.defectosAbiertos,
            name: "Defectos abiertos",
          },
        ]);
      } catch (error) {
        console.error("Error al obtener las métricas globales:", error);
      }
    };
    fetchMetricas();
  }, []);

  if (data.length === 0) {
    return <div>Cargando métricas globales...</div>;
  }

  const optionsBar2 = {
    title: {
      text: "Pruebas x Proyecto",
    },
    tooltip: {},
    xAxis: {
      type: "category",
      data: data.proyectos,
      axisLabel: {
        interval: 0,
        formatter: (value) =>
          value.length > 10 ? `${value.slice(0, 15)}...` : value, // Acorta si es mayor a 10 caracteres
      },
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Total pruebas",
        type: "bar",
        data: data.pruebas,
        itemStyle: {
          color: "#3b82f6", // Color azul similar a TailwindCSS
        },
      },
    ],
  };

  const optionsBar3 = {
    title: {
      text: "Defectos x Proyecto",
    },
    tooltip: {},
    xAxis: {
      type: "category",
      data: data.proyectos,
      axisLabel: {
        interval: 0,
        formatter: (value) =>
          value.length > 10 ? `${value.slice(0, 15)}...` : value, // Acorta si es mayor a 10 caracteres
      },
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Total defectos",
        type: "bar",
        data: data.defectos,
        itemStyle: {
          color: "#3b82f6", // Color azul similar a TailwindCSS
        },
      },
    ],
  };

  const optionsPiePruebas = {
    title: {
      text: "Pruebas",
      subtext: "Detalle total de pruebas generales",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        color: colorPalette,
        name: "Cantidad pruebas",
        type: "pie",
        radius: "50%",
        data: dataPiePruebas,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  const optionsPieDefectos = {
    title: {
      text: "Defectos",
      subtext: "Detalle de defectos generales",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        color: colorPalette,
        name: "Cantidad defectos",
        type: "pie",
        radius: "50%",
        data: dataPieDefectos,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  return (
    <div className="App">
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-8">
          Informes generales del proyecto
        </h1>
        {/*<div className="flex justify-end mb-6">
          <select
            id="project-select"
            className="mt-2 p-2 border border-gray-300 rounded-md"
            value={selectedProject || ""}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="">-- Selecciona un Proyecto --</option>
            {data.proyectos.map((nombre, index) => (
              <option key={nombre}>{nombre}</option>
            ))}
          </select>
        </div>*/}
        <div className="grid grid-cols 1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-lg mb-8">
            <ReactECharts option={optionsPiePruebas} />
          </div>
          <div className="p-4 rounded-lg mb-8">
            <ReactECharts option={optionsPieDefectos} />
          </div>
        </div>
        <div className="p-4 rounded-lg mb-8">
          <ReactECharts option={optionsBar2} />
        </div>

        <div className="p-4 rounded-lg mb-8">
          <ReactECharts option={optionsBar3} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
