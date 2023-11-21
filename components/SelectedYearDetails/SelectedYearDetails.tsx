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
    },
  };

  const itcColor = resolveConfig(tailwindConfig).theme?.colors;

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
        //@ts-expect-error tailwind types do not yet work well with extending themes
        backgroundColor: itcColor ? itcColor["itc-green"].DEFAULT : "black",
      },
    ],
  };

  return (
    <div className="mt-5">
      <h3>Projects in {selectedYear}</h3>
      {data.datasets[0].data.length > 0 ? (
        <Bar height={200} options={options} data={data} />
      ) : (
        <p className="text-xs">No projects in {selectedYear}</p>
      )}
    </div>
  );
};

export default SelectedYearDetails;
