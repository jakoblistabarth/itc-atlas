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

const StaffChart: FC = () => {
  const options = {
    indexAxis: "y" as const,
    plugins: {
      title: {
        display: true,
        text: "ITC staff January 2024 (409), show in percentage (%)",
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
    labels: ["Gender", "Category", "Age distribution"],
    datasets: [
      {
        label: "Female(%)",
        data: [17400 / 409, 0, 0],
        backgroundColor: pattern.draw(
          "diagonal-right-left",
          "#ffffff",
          "#000000",
        ),
      },
      {
        label: "X(%)",
        data: [200 / 409, 0, 0],
        backgroundColor: "#000000",
      },
      {
        label: "Male(%)",
        data: [23300 / 409, 0, 0],
        backgroundColor: pattern.draw("line-vertical", "#ffffff", "#000000"),
      },
      {
        label: "Support staff(%)",
        data: [0, 10700 / 409, 0],
        backgroundColor: "rgb(205 192 176)",
      },
      {
        label: "Scientific staff(%)",
        data: [0, 15400 / 409, 0],
        backgroundColor: "rgb(255 239 219)",
      },
      {
        label: "Doctoral Candidate, AIO(%)",
        data: [0, 3900 / 409, 0],
        backgroundColor: "rgb(255 239 219)",
        borderWidth: 2,
        borderColor: "rgb(238 224 229)",
        borderSkipped: false,
      },
      {
        label: "Phd students(%)",
        data: [0, 10900 / 409, 0],
        backgroundColor: "rgb(238 224 229)",
      },
      {
        label: "<25(%)",
        data: [0, 0, 700 / 409],
        backgroundColor: "rgb(207 207 207)",
        borderWidth: 0.5,
        borderColor: "#ffffff",
      },
      {
        label: "25-30(%)",
        data: [0, 0, 6800 / 409],
        backgroundColor: "rgb(207 207 207)",
        borderWidth: 0.5,
        borderColor: "#ffffff",
      },
      {
        label: "30-35(%)",
        data: [0, 0, 7100 / 409],
        backgroundColor: "rgb(207 207 207)",
        borderWidth: 0.5,
        borderColor: "#ffffff",
      },
      {
        label: "35-40(%)",
        data: [0, 0, 6900 / 409],
        backgroundColor: "rgb(207 207 207)",
        borderWidth: 0.5,
        borderColor: "#ffffff",
      },
      {
        label: "40-45(%)",
        data: [0, 0, 5200 / 409],
        backgroundColor: "rgb(207 207 207)",
        borderWidth: 0.5,
        borderColor: "#ffffff",
      },
      {
        label: "45-50(%)",
        data: [0, 0, 3900 / 409],
        backgroundColor: "rgb(207 207 207)",
        borderWidth: 0.5,
        borderColor: "#ffffff",
      },
      {
        label: "50-55(%)",
        data: [0, 0, 3300 / 409],
        backgroundColor: "rgb(207 207 207)",
        borderWidth: 0.5,
        borderColor: "#ffffff",
      },
      {
        label: "55-60(%)",
        data: [0, 0, 3300 / 409],
        backgroundColor: "rgb(207 207 207)",
        borderWidth: 0.5,
        borderColor: "#ffffff",
      },
      {
        label: "60-65(%)",
        data: [0, 0, 3100 / 409],
        backgroundColor: "rgb(207 207 207)",
        borderWidth: 0.5,
        borderColor: "#ffffff",
      },
      {
        label: ">65(%)",
        data: [0, 0, 600 / 409],
        backgroundColor: "rgb(207 207 207)",
        borderWidth: 0.5,
        borderColor: "#ffffff",
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default StaffChart;
