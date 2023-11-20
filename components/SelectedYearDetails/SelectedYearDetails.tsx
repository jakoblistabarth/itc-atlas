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
import { InternMap } from "d3";
import { FC } from "react";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import getCountryName from "../../lib/getCountryName";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config";
import { Card } from "../Card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

type Props = {
  selectedYear: string;
  projectsByYearCountry: {
    year: string;
    countries: InternMap<string, number>;
  }[];
  neCountriesTopoJson: NeCountriesTopoJson;
};

const SelectedYearDetails: FC<Props> = ({
  selectedYear,
  projectsByYearCountry,
  neCountriesTopoJson,
}) => {
  const options = {
    indexAxis: "y" as const,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Projects in selected year",
      },
    },
  };

  const itc_color = resolveConfig(tailwindConfig).theme?.colors;

  const selectedYearCountries = projectsByYearCountry.find(
    (d) => d.year == selectedYear,
  )?.countries;

  const labels = Array.from(
    selectedYearCountries ? selectedYearCountries.keys() : [],
  ).map((d) => getCountryName(d, neCountriesTopoJson));

  const data = {
    labels,
    datasets: [
      {
        data: Array.from(
          selectedYearCountries ? selectedYearCountries.values() : [],
        ),
        backgroundColor: itc_color ? itc_color["itc-green"].DEFAULT : "black",
      },
    ],
  };

  return (
    <div>
      <Card>
        <Card.Header>
          <p className="text-xs italic">Details</p>
        </Card.Header>
        <Card.Body>
          <h2>Selected Year : {selectedYear}</h2>
          <Bar height={250} options={options} data={data} />
        </Card.Body>
      </Card>
    </div>
  );
};

export default SelectedYearDetails;
