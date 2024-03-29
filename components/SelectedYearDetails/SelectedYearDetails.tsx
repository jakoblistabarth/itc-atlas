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
import getCountryName from "../../lib/getCountryName";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config";
import { Country } from "@prisma/client";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

type Props = {
  selectedYear: Date;
  projectsByYearCountry: {
    year: string;
    countries: InternMap<string, number>;
  }[];
  countries: Country[];
};

const SelectedYearDetails: FC<Props> = ({
  selectedYear,
  projectsByYearCountry,
  countries,
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
    (d) => d.year == selectedYear.getFullYear().toString(),
  )?.countries;

  const labels = Array.from(
    selectedYearCountries ? selectedYearCountries.keys() : [],
  ).map((d) => getCountryName(d, countries));

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
      <h3>Projects in {selectedYear.getFullYear()}</h3>
      {data.datasets[0].data.length > 0 ? (
        <Bar height={200} options={options} data={data} />
      ) : (
        <p className="text-xs">No projects in {selectedYear.getFullYear()}</p>
      )}
    </div>
  );
};

export default SelectedYearDetails;
