import { scaleOrdinal } from "d3";
import AlumniOrginByLevel from "../../../components/AlumniOriginByLevel";
import { geoBertin1953 } from "d3-geo-projection";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { ParsedUrlQuery } from "querystring";
import { HiOutlineTag } from "react-icons/hi";
import { Card } from "../../../components/Card";
import Container from "../../../components/Container";
import CountryCodeBadge from "../../../components/CountryCodeBadge";
import KPIPanel from "../../../components/KPIPanel";
import MapLayerBase from "../../../components/MapLayerBase";
import MapLayerProportionalSymbols from "../../../components/MapLayerProportionalSymbols";
import MapLayoutFluid from "../../../components/MapLayout/MapLayoutFluid";
import PageBase from "../../../components/PageBase";
import Paragraph from "../../../components/Paragraph";
import PhdThesesBookChart from "../../../components/PhdThesesBookChart";
import { groupThesesByYear } from "../../../components/PhdThesesBookChart/PhdThesesBookChart.helpers";
import Section from "../../../components/Section";
import Teaser from "../../../components/Teaser";
import getCentroidByIsoCode from "../../../lib/data/getCentroidByIsoCode";
import getCountries from "../../../lib/data/getCountries";
import getCountryCodes from "../../../lib/data/queries/country/getCountryCodes";
import getCountryWithProjectCount from "../../../lib/data/queries/country/getCountryWithProjectCount";
import getDepartment from "../../../lib/data/queries/departments/getDepartment";
import getDepartments from "../../../lib/data/queries/departments/getDepartments";
import prisma from "../../../prisma/client";
import { SharedPageProps } from "../../../types/Props";
import { BtorsGroupedByCountryByDepartment } from "../../../lib/data/queries/btors/getBtorsGroupedByCountryByDepartment";
import getBtorsGroupedByCountryByDepartment from "../../../lib/data/queries/btors/getBtorsGroupedByCountryByDepartment";
import PrismMapTravelsDepartment from "../../../components/PrismMapTravelsDepartment";
import getCountryWithApplicantCount, {
  CountryWithApplicantCount,
} from "../../../lib/data/queries/country/getCountryWithApplicantCount";
import getApplicationLevels, {
  ApplicationLevels,
} from "../../../lib/data/queries/application/getApplicationLevels";
import FlightsFlowMap from "../../../components/FlightsFlowMap";
import getOdMatrix from "../../../lib/data/getOdMatrix";
import type { OdMatrix } from "../../../types/OdMatrix";
import getEmploymentExtent, {
  EmploymentExtent,
} from "../../../lib/data/queries/employment/employment-extent";

const Page = ({
  department,
  employeeCount,
  employmentExtent,
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
                description: `between ${employmentExtent._min.startYear} and ${employmentExtent._max.startYear}`,
              },
              { value: btorCount, unit: "Back-to-office reports" },
              {
                value: department.projectsMain.length,
                unit: "projects",
                description: "as primary department",
              },
              { value: department.phdsMain.length, unit: "PhD candidates" },
              {
                value: department.phdsSecondary.length,
                unit: "PhD candidates",
                description: "as secondary department",
              },
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
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet
            molestiae, sequi animi est dolor nihil qui id, aperiam assumenda
            suscipit officia, veniam tenetur veritatis saepe! Recusandae animi
            incidunt fuga perferendis!
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
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet
            molestiae, sequi animi est dolor nihil qui id, aperiam assumenda
            suscipit officia, veniam tenetur veritatis saepe! Recusandae animi
            incidunt fuga perferendis!
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
          <div className="max-w-screen-sm">
            <MapLayoutFluid projection={geoBertin1953()}>
              <MapLayerBase countries={neCountriesTopoJson} />
              <MapLayerProportionalSymbols data={data} maxRadius={10} />
            </MapLayoutFluid>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {department.projectsMain.map((d) => {
              return (
                <Card key={d.id}>
                  <Card.Body>
                    <h3>{d.name}</h3>
                    <div className="my-2 flex items-baseline gap-1 text-xs">
                      <HiOutlineTag />
                      <div>{d.type}</div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {d.countries.map(({ isoAlpha3 }) => (
                        <CountryCodeBadge
                          key={isoAlpha3}
                          isoAlpha3Code={isoAlpha3}
                        />
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
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
    employmentExtent,
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
          },
        },
      },
    }),
    getEmploymentExtent(),
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
      employmentExtent,
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
    employmentExtent: EmploymentExtent;
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
