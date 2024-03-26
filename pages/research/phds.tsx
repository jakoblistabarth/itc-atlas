import { Department } from "@prisma/client";
import { scaleOrdinal } from "d3";
import Paragraph from "../../components/Paragraph";
import PhdThesesBookChart from "../../components/PhdThesesBookChart";
import { groupThesesByYear } from "../../components/PhdThesesBookChart/PhdThesesBookChart.helpers";
import Section from "../../components/Section";
import Teaser from "../../components/Teaser";
import loadDepartments from "../../lib/data/load/loadDepartments";
import getPhdTheses, {
  PhdTheses,
} from "../../lib/data/queries/phd/getPhdTheses";
import { max, min, scaleSqrt } from "d3";
import { geoInterruptedMollweide } from "d3-geo-projection";
import type { GetStaticProps, NextPage } from "next";
import { useState } from "react";
import useSWRImmutable from "swr/immutable";
import LegendNominal from "../../components/LegendNominal";
import MapLayerBase from "../../components/MapLayerBase";
import MapLayoutFluid from "../../components/MapLayout/MapLayoutFluid";
import MarkScaledPieChart from "../../components/MarkScaledPieChart";
import PageBase from "../../components/PageBase";
import getCountries from "../../lib/data/getCountries";
import getPhdsByCountryByDepartment from "../../lib/data/queries/phd/getPhdsByCountryByDepartment";
import { departmentColorScale } from "../../lib/styles/departmentColorScale";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import prisma from "../../prisma/client";
import { SharedPageProps } from "../../types/Props";
import Container from "../../components/Container";

type Props = {
  phdsByCountryByDepartment: Awaited<
    ReturnType<typeof getPhdsByCountryByDepartment>
  >;
  phdTheses: PhdTheses;
  departments: Department[];
} & SharedPageProps;

const Page: NextPage<Props> = ({
  phdTheses,
  departments,
  neCountriesTopoJson,
  phdsByCountryByDepartment,
}) => {
  const thesesByYear = groupThesesByYear(phdTheses);

  const colorScale = scaleOrdinal<string, string, string>()
    .domain(departments.map((d) => d.id))
    .range([
      "yellow",
      "orange",
      "red",
      "purple",
      "cornflowerblue",
      "darkblue",
      "turquoise",
      "teal",
    ])
    .unknown("grey");

  const [isChecked, setIsChecked] = useState(false); //TODO: use more specific name "isFiltered"

  const handleOnChange = () => {
    setIsChecked(!isChecked);
  };
  const filter = isChecked ? "?graduated=true" : ""; //TODO: switch only true/false no separate variable?

  const { data, error, isLoading } = useSWRImmutable<
    Awaited<ReturnType<typeof getPhdsByCountryByDepartment>>
  >("/api/data/phd/by-country" + filter);

  if (error) return <div>failed to load</div>;

  const mapData = data ?? phdsByCountryByDepartment;

  const dimension = {
    width: 1280,
    height: 0,
  };

  const theme = defaultTheme;
  const projection = geoInterruptedMollweide();

  const phdCount = mapData.map((d) => d.totalCount, 0);
  const minCount = min(phdCount) ?? 0;
  const maxCount = max(phdCount) ?? 10;
  const scale = scaleSqrt().domain([minCount, maxCount]).range([5, 50]);

  const legendEntries = departmentColorScale.domain().map((d) => {
    return {
      label: d,
      color: departmentColorScale(d),
    };
  });

  return (
    <PageBase title="PhD at ITC">
      <Container>
        <Teaser>
          A PhD study at ITC is carried out in one of the six departments under
          the supervision of staff and promotor.
        </Teaser>
        <h2>PhD theses</h2>
        <PhdThesesBookChart
          colorScale={colorScale}
          thesesByYear={thesesByYear}
        />
        <br />
        <h2>PhD origins</h2>
        <div>
          <input
            type="checkbox"
            id="filter"
            // name="filter"
            // value="filter"
            checked={isChecked}
            onChange={handleOnChange}
          />
          <label htmlFor="filter">Show only graduates</label>
        </div>
        <MapLayoutFluid projection={projection}>
          <MapLayerBase countries={neCountriesTopoJson} theme={theme} />
          {!isLoading && (
            <g id="symbols">
              {mapData.map((country) => {
                if (!country.departments || !country.coordinates) return;
                return (
                  <MarkScaledPieChart
                    key={country.isoAlpha3}
                    longitude={country.coordinates?.[0]}
                    latitude={country.coordinates?.[1]}
                    radius={scale(country.totalCount)}
                    colorScale={departmentColorScale}
                    data={country.departments}
                    stroke="lightgrey"
                  />
                );
              })}
            </g>
          )}
          <LegendNominal title={"ITC's departments"} entries={legendEntries} />
          <g transform={`translate(${dimension.width - 170},0)`}>
            <LegendNominal
              title={"Top 5 PhD countries"}
              entries={mapData.slice(0, 5).map((d) => ({
                label: `${d.isoAlpha3} (${d.totalCount})`,
                color: "none",
                symbol: <g></g>,
              }))}
            />
          </g>
        </MapLayoutFluid>
        <Section>
          <h2>PhD categories</h2>
          <Paragraph>
            There are on average over a hundred PhD candidates at ITC, including
            research staff positions (AIO-positions). Most PhD candidates are
            full-time at ITC, aiming to submit and defend a PhD thesis within a
            four-year research period. Others are PhD interns spending periods
            of several months to one year at ITC as part of their studies.
          </Paragraph>
          <h2 className="mt-5">Programme overview</h2>
          <Paragraph>
            The task of a PhD researcher includes research activities, attending
            training courses and some teaching and supervising activities. The
            research activities will provide the PhD candidate with the skills
            and experience they need to become an independent researcher. Part
            of the research also involves disseminating the knowledge acquired,
            for example, through publications in academic journals. During the
            4-year PhD programme the candidate must obtain at least 30 credits
            worth of PhD courses or hands-on activities. These cover academic
            skills and career development, in depth disciplinary and
            wide-ranging courses. An integral part of a PhD is writing the PhD
            thesis and then, of course, presenting and defend the research in
            public. After successfully completing the PhD, you will be awarded
            the title of Doctor.
          </Paragraph>
        </Section>
      </Container>
    </PageBase>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [phdTheses, departments] = await Promise.all([
    getPhdTheses(),
    loadDepartments(),
  ]);
  const neCountriesTopoJson = getCountries();
  const [countries, phdsByCountryByDepartment] = await Promise.all([
    prisma.country.findMany(),
    getPhdsByCountryByDepartment(),
  ]);

  return {
    props: {
      phdTheses,
      departments,
      countries,
      phdsByCountryByDepartment,
      neCountriesTopoJson,
    },
  };
};

export default Page;
