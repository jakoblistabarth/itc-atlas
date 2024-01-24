import { ExtendedFeature } from "d3-geo";
import { geoBertin1953 } from "d3-geo-projection";
import type { GetStaticProps, NextPage } from "next";
import Caption from "../../components/Caption";
import MapLayoutFluid from "../../components/MapLayout/MapLayoutFluid";
import PageHeroVisual from "../../components/PageHeroVisual";
import Paragraph from "../../components/Paragraph";
import Teaser from "../../components/Teaser";
import BtorsAndCabinets from "../../components/visuals/BtorsAndCabinets";
import BtorsByDepartment from "../../components/visuals/maps/BtorsByDepartment";
import BtorsByYearMap from "../../components/visuals/maps/BtorsByYear";
import getBhosCountries from "../../lib/data/getBhosCountries";
import getCountries from "../../lib/data/getCountries";
import getDutchCabinets from "../../lib/data/getDutchCabinets";
import getBtorsGroupedByCountryByDepartment, {
  BtorsGroupedByCountryByDepartment,
} from "../../lib/data/queries/btors/getBtorsGroupedByCountryByDepartment";
import TravelsAcrossDepartmentsPrismMap from "../../components/TravelsAcrossDepartments";
import getBtorsGroupedByRegionByDepartment, {
  BtorsGroupedByRegionByDepartment,
} from "../../lib/data/queries/btors/getBtorsGroupedByRegionByDepartment";
import getBtorsGroupedByYear, {
  BtorsGroupedByYear,
} from "../../lib/data/queries/btors/getBtorsGroupedByYear";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";
import { BhosCountry } from "../../types/BhosCountry";
import { DutchCabinet } from "../../types/DutchCabinet";
import { SharedPageProps } from "../../types/Props";
import Section from "../../components/Section";
import getDepartments from "../../lib/data/queries/departments/getDepartments";
import { Department } from "@prisma/client";
import { useMemo } from "react";
import Container from "../../components/Container";
import Callout from "../../components/Callout";
import { HiCursorClick } from "react-icons/hi";

type Props = SharedPageProps & {
  btorsByCountryByDepartment: BtorsGroupedByCountryByDepartment;
  btorsByYear: BtorsGroupedByYear;
  bhosCountries: BhosCountry[];
  btorsByDepartment: BtorsGroupedByRegionByDepartment;
  dutchCabinets: DutchCabinet[];
  departments: Department[];
};

const Page: NextPage<Props> = ({
  btorsByCountryByDepartment,
  btorsByYear,
  bhosCountries,
  dutchCabinets,
  btorsByDepartment,
  neCountriesTopoJson,
  countries,
  departments,
}) => {
  const projection = useMemo(() => geoBertin1953(), []);
  const heroVisual = (
    <>
      <MapLayoutFluid projection={projection}>
        <BtorsByYearMap
          countries={countries}
          neCountries={neCountriesTopoJson}
          btors={btorsByYear}
        />
      </MapLayoutFluid>
      <Container>
        <Callout Icon={HiCursorClick}>
          Click on a symbol to retrieve additional information.
        </Callout>
      </Container>
    </>
  );

  const extent: ExtendedFeature = {
    type: "Feature",
    geometry: {
      type: "MultiPoint",
      coordinates: [
        [-30, 60],
        [48, 70],
        [34, 36],
        [-8, 35],
      ],
    },
    properties: {},
  };

  return (
    <PageHeroVisual title="Staff travels over time" heroVisual={heroVisual}>
      <Teaser>
        Where does ITC staff travel and what for? To answer this question we
        need to take a closer look on different travel destination, the
        development over time and the purpose of these travels.
      </Teaser>
      <Section>
        <Paragraph>
          Two datasets are the basis for this analysis: the &ldquo;Back to
          Office Reports&rdquo; and all flights booked by ITC&apos;s travel
          angency for 2019. Lorem ipsum dolor, sit amet consectetur adipisicing
          elit. Soluta maiores debitis porro totam reiciendis, inventore quas,
          voluptatem eveniet ipsam veniam ex corporis eligendi ea doloribus.
          Consectetur vel aliquam id minus!
        </Paragraph>
      </Section>
      <Section>
        <div className="max-w-2xl">
          <h2>Travels in the context of Dutch development policies</h2>
          <Paragraph>
            Dutch development policies change over time. According to the
            cabinets in office the perspective and focus on development shifts
            slighty, affecting ITC&apos;s work.
          </Paragraph>
          <div className="mt-5">
            <BtorsAndCabinets
              neCountries={neCountriesTopoJson}
              countries={countries}
              bhosCountries={bhosCountries}
              btorsByYear={btorsByYear}
              dutchCabinets={dutchCabinets}
            />
            <Caption reference="Fig. 2">
              This chart shows travels over time across the world
            </Caption>
          </div>
          <Paragraph>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet
            molestiae, sequi animi est dolor nihil qui id, aperiam assumenda
            suscipit officia, veniam tenetur veritatis saepe! Recusandae animi
            incidunt fuga perferendis!
          </Paragraph>
        </div>
      </Section>
      <Section>
        <Paragraph>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet
          molestiae, sequi animi est dolor nihil qui id, aperiam assumenda
          suscipit officia, veniam tenetur veritatis saepe! Recusandae animi
          incidunt fuga perferendis!
        </Paragraph>
        <div className="mt-5">
          <MapLayoutFluid projection={geoBertin1953()}>
            <BtorsByDepartment
              neCountries={neCountriesTopoJson}
              countryCodes={countries}
              btors={btorsByDepartment}
            />
          </MapLayoutFluid>
          <Caption reference="Fig. 4">
            This map shows travels per department.
          </Caption>
        </div>
      </Section>
      <Section>
        <Paragraph>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet
          molestiae, sequi animi est dolor nihil qui id, aperiam assumenda
          suscipit officia, veniam tenetur veritatis saepe! Recusandae animi
          incidunt fuga perferendis!
        </Paragraph>
        <TravelsAcrossDepartmentsPrismMap
          topology={neCountriesTopoJson}
          topologyObject={"ne_admin_0_countries"}
          projection={projection}
          width={10}
          length={10}
          btorsByCountryByDepartment={btorsByCountryByDepartment}
          departments={departments}
        />
        <Caption reference="Fig. 5">
          This map shows travels per department for per country.
        </Caption>
      </Section>
    </PageHeroVisual>
  );
};

export default Page;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [
    btorsByCountryByDepartment,
    btorsByYear,
    btorsByDepartment,
    bhosCountries,
    dutchCabinets,
    neCountriesTopoJson,
    countries,
    departments,
  ] = await Promise.all([
    getBtorsGroupedByCountryByDepartment(),
    getBtorsGroupedByYear(),
    getBtorsGroupedByRegionByDepartment(),
    getBhosCountries(),
    getDutchCabinets(),
    getCountries(),
    getCountryCodes(),
    getDepartments(),
  ]);

  return {
    props: {
      btorsByCountryByDepartment,
      btorsByYear,
      btorsByDepartment,
      bhosCountries,
      dutchCabinets,
      neCountriesTopoJson,
      countries,
      departments,
    },
  };
};
