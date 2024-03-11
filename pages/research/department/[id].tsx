import { scaleOrdinal } from "d3";
import { geoBertin1953 } from "d3-geo-projection";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { ParsedUrlQuery } from "querystring";
import AlumniOrginByLevel from "../../../components/AlumniOriginByLevel";
import Container from "../../../components/Container";
import FlightsFlowMap from "../../../components/FlightsFlowMap";
import KPIPanel from "../../../components/KPIPanel";
import MapLayerBase from "../../../components/MapLayerBase";
import MapLayerProportionalSymbols from "../../../components/MapLayerProportionalSymbols";
import MapLayoutFluid from "../../../components/MapLayout/MapLayoutFluid";
import PageBase from "../../../components/PageBase";
import Paragraph from "../../../components/Paragraph";
import PhdThesesBookChart from "../../../components/PhdThesesBookChart";
import { groupThesesByYear } from "../../../components/PhdThesesBookChart/PhdThesesBookChart.helpers";
import PrismMapTravelsDepartment from "../../../components/PrismMapTravelsDepartment";
import Section from "../../../components/Section";
import Teaser from "../../../components/Teaser";
import getCentroidByIsoCode from "../../../lib/data/getCentroidByIsoCode";
import getCountries from "../../../lib/data/getCountries";
import getOdMatrix from "../../../lib/data/getOdMatrix";
import getApplicationLevels, {
  ApplicationLevels,
} from "../../../lib/data/queries/application/getApplicationLevels";
import getBtorsGroupedByCountryByDepartment, {
  BtorsGroupedByCountryByDepartment,
} from "../../../lib/data/queries/btors/getBtorsGroupedByCountryByDepartment";
import getCountryCodes from "../../../lib/data/queries/country/getCountryCodes";
import getCountryWithApplicantCount, {
  CountryWithApplicantCount,
} from "../../../lib/data/queries/country/getCountryWithApplicantCount";
import getCountryWithProjectCount from "../../../lib/data/queries/country/getCountryWithProjectCount";
import getDepartment from "../../../lib/data/queries/departments/getDepartment";
import getDepartments from "../../../lib/data/queries/departments/getDepartments";
import prisma from "../../../prisma/client";
import type { OdMatrix } from "../../../types/OdMatrix";
import { SharedPageProps } from "../../../types/Props";
import { RiBarChartHorizontalFill } from "react-icons/ri";
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
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../../tailwind.config";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const Page = ({
  department,
  employeeCount,
  btorCount,
  neCountriesTopoJson,
  countriesWithProjectCount,
  btorsByCountryByDepartment,
  levels,
  applicants,
  odMatrix,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const thesesByYear = groupThesesByYear(department.phdsMain);
  const data = countriesWithProjectCount.flatMap((d) => {
    const centroid = getCentroidByIsoCode(d.isoAlpha3);
    return !d._count.projects || !centroid
      ? []
      : [
          {
            id: d.isoAlpha3,
            longitude: centroid.x,
            latitude: centroid.y,
            label: d.isoAlpha3,
            value: d._count.projects,
          },
        ];
  });

  const countMap = new Map();
  department.projectsMain.map((d) => {
    countMap.has(d.type)
      ? countMap.set(d.type, countMap.get(d.type) + 1)
      : countMap.set(d.type, 1);
  });

  const itcColor = resolveConfig(tailwindConfig).theme?.colors;

  const labels = Array.from(countMap.keys()).filter((d) => d);

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Projects in different categories",
      },
    },
    scales: {
      x: {
        ticks: {
          precision: 0,
        },
      },
    },
  };

  const barData = {
    labels,
    datasets: [
      {
        data: Array.from(countMap.values()).filter((d) => d),
        barThickness: 10,
        borderWidth: 2,
        //@ts-expect-error tailwind types do not yet work well with extending themes
        backgroundColor: itcColor ? itcColor["itc-green"].DEFAULT : "black",
      },
    ],
  };

  return (
    <PageBase title={`${department.id} department`}>
      <Container>
        <h2>{department.name}</h2>
        <Teaser>
          The departement&apos;s research focus are interfaces, infinitely
          reconfigurable schema for coping with emerging methodologies and
          leading-edge customer-directed systems.
        </Teaser>
        <Section>
          <KPIPanel
            data={[
              {
                value: employeeCount,
                unit: "employees",
                description: `in 2023`,
              },
              { value: btorCount, unit: "Back-to-office reports" },
              {
                value: department.projectsMain.length,
                unit: "projects",
                description: "as primary department",
              },
              { value: department.phdsMain.length, unit: "PhD candidates" },
            ]}
          />
        </Section>
        <Section>
          <Paragraph>
            We will enlarge our ability to iterate virtually. Without
            development, you will lack cross-media CAE. Our end-to-end feature
            set is unparalleled, but our plug-and-play re-purposing and easy
            configuration is usually considered a terrific achievement. Spriti
            introduced new capabilities to the ability to iterate virtually. It
            is pushing the envelope At the end of the customer journey. Without
            micro-resource-constrained performance, you will lack architectures.
            Without development, you will lack experiences. Is it more important
            for something to be leading-edge or to be dynamic or to be
            customer-directed?
          </Paragraph>
        </Section>
        <Section>
          <h2>PhD Theses</h2>
          <div className="max-w-screen-sm">
            <PhdThesesBookChart
              thesesByYear={thesesByYear}
              colorScale={scaleOrdinal<string, string, string>().unknown(
                "grey",
              )}
              startYear={1990}
            />
          </div>
        </Section>
        <Section>
          <h2>Travels</h2>
          <Paragraph>
            The interactive prism map shows the number of departmental trips to
            a particular country. Hover over the country to see exact number of
            trips.
          </Paragraph>
          <div className="max-w-screen-sm">
            <PrismMapTravelsDepartment
              topology={getCountries()}
              topologyObject={"ne_admin_0_countries"}
              projection={geoBertin1953()}
              width={10}
              length={10}
              extrudeGeometryOptions={{
                depth: 0.01,
                bevelSize: 0.005,
                bevelThickness: 0.005,
                bevelSegments: 12,
              }}
              btorsByCountryByDepartment={btorsByCountryByDepartment}
              department={department}
            />
          </div>
        </Section>

        <Section>
          <AlumniOrginByLevel
            neCountriesTopoJson={neCountriesTopoJson}
            levels={levels}
            applicants={applicants}
            department={department.id}
          />
        </Section>

        <Section>
          <h2>Flights</h2>
          <Paragraph>
            Number of flights made by members of the department in 2019.
          </Paragraph>
          <div className="max-w-screen-sm">
            <MapLayoutFluid projection={geoBertin1953()}>
              <FlightsFlowMap
                odMatrix={odMatrix}
                neCountriesTopoJson={neCountriesTopoJson}
              />
            </MapLayoutFluid>
          </div>
        </Section>

        <Section>
          <h2>Projects</h2>
          <Paragraph>
            Overview of the geographic distribution of projects found the ITC
            project database executed by the department.
          </Paragraph>
          <div className="max-w-screen-sm">
            <MapLayoutFluid projection={geoBertin1953()}>
              <MapLayerBase countries={neCountriesTopoJson} />
              <MapLayerProportionalSymbols data={data} maxRadius={10} />
            </MapLayoutFluid>
          </div>
          <div className="max-w-screen-sm">
            <RiBarChartHorizontalFill />
            <Bar options={options} data={barData} />
          </div>
        </Section>
      </Container>
    </PageBase>
  );
};

export default Page;

export const getStaticPaths: GetStaticPaths<Params> = (async () => {
  const departments = await getDepartments(true);
  const paths = departments.map(({ id }) => ({
    params: {
      id,
    },
  }));
  return { paths, fallback: false };
}) satisfies GetStaticPaths;

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getStaticProps = (async (context) => {
  //@ts-expect-error: wrong typing of parsedqueryurl context
  const { id } = context.params;
  const [
    department,
    employeeCount,
    btorCount,
    countriesWithProjectCount,
    neCountriesTopoJson,
    countries,
    btorsByCountryByDepartment,
    applicants,
    levels,
    odMatrix,
  ] = await Promise.all([
    getDepartment(id),
    prisma.employee.count({
      where: {
        employment: {
          some: {
            departments: {
              some: {
                id: {
                  equals: id,
                },
              },
            },
            AND: {
              startYear: {
                lte: 2023,
              },
              AND: {
                endYear: {
                  gte: 2023,
                },
              },
            },
          },
        },
      },
    }),
    prisma.btor.count({
      where: {
        departments: {
          some: {
            id: {
              equals: id,
            },
          },
        },
      },
    }),
    getCountryWithProjectCount(id),
    getCountries(),
    getCountryCodes(),
    getBtorsGroupedByCountryByDepartment(),
    getCountryWithApplicantCount(),
    getApplicationLevels(),
    getOdMatrix(id),
  ]);
  return {
    props: {
      department,
      employeeCount,
      btorCount,
      countriesWithProjectCount,
      neCountriesTopoJson,
      countries,
      btorsByCountryByDepartment,
      applicants,
      levels,
      odMatrix,
    },
  };
}) satisfies GetStaticProps<
  {
    department: Awaited<ReturnType<typeof getDepartment>>;
    employeeCount: number;
    btorCount: number;
    countriesWithProjectCount: Awaited<
      ReturnType<typeof getCountryWithProjectCount>
    >;
    btorsByCountryByDepartment: BtorsGroupedByCountryByDepartment;
    applicants: CountryWithApplicantCount;
    levels: ApplicationLevels;
    odMatrix: OdMatrix;
  } & SharedPageProps
>;
