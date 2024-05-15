import PageBase from "../../components/PageBase";
import Container from "../../components/Container";
import Section from "../../components/Section";
import Paragraph from "../../components/Paragraph";
import Callout from "../../components/Callout";
import dynamic from "next/dynamic";
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
import Caption from "../../components/Caption";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const Page = () => {
  const StaffChart = dynamic(() => import("../../components/StaffChart"), {
    ssr: false,
  });
  const ScientificStaffChart = dynamic(
    () => import("../../components/ScientificStaffChart"),
    {
      ssr: false,
    },
  );
  const SupportStaffChart = dynamic(
    () => import("../../components/SupportStaffChart"),
    {
      ssr: false,
    },
  );

  const options = {
    indexAxis: "y" as const,
    plugins: {
      title: {
        display: true,
        text: "Age distribution (%)",
      },
      legend: {
        display: false,
      },
    },
    responsive: true,
    scales: {
      x: {
        display: false,
      },
      y: { grid: { display: false } },
    },
  };

  const data1 = {
    labels: [
      "<25",
      "25-30",
      "30-35",
      "35-40",
      "40-45",
      "45-50",
      "50-55",
      "55-60",
      "60-65",
      ">65",
    ],
    datasets: [
      {
        data: [
          300 / 193,
          2100 / 193,
          3100 / 193,
          3500 / 193,
          3100 / 193,
          2300 / 193,
          1700 / 193,
          1400 / 193,
          1500 / 193,
          300 / 193,
        ],
        backgroundColor: [
          "rgb(255, 250, 240)",
          "rgb(253, 245, 230)",
          "rgb(250, 240, 230)",
          "rgb(250 235 215)",
          "rgb(255 239 213)",
          "rgb(255 235 205)",
          "rgb(255 228 196)",
          "rgb(255 218 185)",
          "rgb(255 222 173)",
          "rgb(255 228 181)",
        ],
        barPercentage: 0.9,
        categoryPercentage: 1,
      },
    ],
  };
  const data2 = {
    labels: [
      "<25",
      "25-30",
      "30-35",
      "35-40",
      "40-45",
      "45-50",
      "50-55",
      "55-60",
      "60-65",
      ">65",
    ],
    datasets: [
      {
        data: [
          200 / 107,
          1400 / 107,
          1100 / 107,
          900 / 107,
          600 / 107,
          1300 / 107,
          1500 / 107,
          1800 / 107,
          1600 / 107,
          300 / 107,
        ],
        backgroundColor: [
          "rgb(255, 250, 240)",
          "rgb(253, 245, 230)",
          "rgb(250, 240, 230)",
          "rgb(250 235 215)",
          "rgb(255 239 213)",
          "rgb(255 235 205)",
          "rgb(255 228 196)",
          "rgb(255 218 185)",
          "rgb(255 222 173)",
          "rgb(255 228 181)",
        ],
        barPercentage: 0.9,
        categoryPercentage: 1,
      },
    ],
  };

  return (
    <PageBase title="Facts about ITC">
      <Container>
        <Section>
          <h2>Staff, Finances, Facilities, Etc.</h2>
          <Paragraph>
            Overview of the ITC staff, in gender, category, age, nationality
            perspective.
          </Paragraph>
          <div className="max-w-screen-sm">
            <StaffChart />
            <Callout title="Category profile" className="mt-5">
              <details className="mt-2 text-sm">
                <summary className="font-bold">Scientific staff</summary>a Full
                Professor <br />b Associate Professor
                <br /> c Assistant Professor <br />d Lecturer
                <br /> e Researcher <br />f Doctoral Candidate (AIO)
              </details>
              <details className="mt-2 text-sm">
                <summary className="font-bold">Support staff</summary>Support
                has over 30 different function categories
              </details>
            </Callout>
            <Caption reference="Fig.1">
              The composition of ITC staff based on gender, category and age,
              per January 1, 2024.
            </Caption>
          </div>
        </Section>
        <Section>
          <div className="grid max-w-xl grid-cols-[repeat(3,288px)]">
            <ScientificStaffChart />
            <p />
            <SupportStaffChart />
            <Bar options={options} data={data1} />
            <p />
            <Bar options={options} data={data2} />
          </div>
          <Caption reference="Fig.2">
            The composition of ITC scientific staff (left) and support staff
            (right) based on gender, nationality and age, per January 1, 2024.
          </Caption>
        </Section>
      </Container>
    </PageBase>
  );
};

export default Page;
