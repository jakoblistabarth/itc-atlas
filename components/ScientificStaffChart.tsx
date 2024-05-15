import { FC } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import * as pattern from "patternomaly";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const ScientificStaffChart: FC = () => {
  const options = {
    indexAxis: "y" as const,
    plugins: {
      title: {
        display: true,
        text: "Scientific staff (193), show in percentage (%)",
      },
      legend: {
        display: false,
      },
    },
    responsive: true,
    x: { position: "top" },
    y: { position: "right" },
    scales: {
      x: {
        stacked: true,
        max: 100,
        min: 0,
        ticks: {
          stepSize: 25,
        },
      },
      y: {
        stacked: true,
        grid: { display: false },
      },
    },
  };

  const data = {
    labels: ["Gender", "Nationality"],
    datasets: [
      {
        label: "Female(%)",
        data: [6600 / 193, 0],
        barThickness: 60,
        backgroundColor: pattern.draw(
          "diagonal-right-left",
          "#ffffff",
          "#000000",
        ),
      },
      {
        label: "X(%)",
        data: [200 / 193, 0],
        barThickness: 60,
        backgroundColor: "#000000",
      },
      {
        label: "Male(%)",
        data: [12500 / 193, 0],
        barThickness: 60,
        backgroundColor: pattern.draw("line-vertical", "#ffffff", "#000000"),
      },
      {
        label: "Dutch(%)",
        data: [0, 6600 / 193],
        barThickness: 60,
        backgroundColor: "rgb(244, 164, 96)",
      },
      {
        label: "Other(%)",
        data: [0, 12700 / 193],
        barThickness: 60,
        backgroundColor: "rgb(245, 245, 220)",
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default ScientificStaffChart;
