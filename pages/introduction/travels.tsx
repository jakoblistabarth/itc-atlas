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
      <figure>
        <MapLayoutFluid projection={projection}>
          <BtorsByYearMap
            countries={countries}
            neCountries={neCountriesTopoJson}
            btors={btorsByYear}
          />
        </MapLayoutFluid>
        <Container>
          <Caption reference="Fig.1">
            Number of flights to a country over the last twenty years
          </Caption>
        </Container>
      </figure>
      <Container>
        <Callout Icon={HiCursorClick}>
          Click on a symbol to retrieve additional information.
        </Callout>
      </Container>
    </>
  );

  return (
    <PageHeroVisual title="Connecting to the world" heroVisual={heroVisual}>
      <Teaser>ITC&apos;s travels</Teaser>
      <Section>
        <Paragraph>
          ITC staff members have an intense travel program. First to stay in
          touch with our target audience in the framework of development
          cooperation and second attending ‘normal’ academic conferences and
          workshops. However, with the climate in mind the travel behaviour has
          been slightly restrained, and on shorter distance the airplane is no
          longer the preferred mode of transport.
        </Paragraph>
        <Paragraph>
          Where did they all go? The first map depicting all travel destination
          by country over the last twenty is based on travel reports submitted
          by staff members [1].
        </Paragraph>
      </Section>
      <Section>
        <div className="max-w-2xl">
          <h2>Travels in the context of Dutch development policies</h2>
          <Paragraph>
            How do governmental policies influxes ITC travel behaviour? In this
            interactive graphic the focus countries for the different
            administrations are linked to a line graph that holds all trips made
            from 2000 to 2002. It is the same data as mapped in [1].
          </Paragraph>
          <Paragraph>
            One has to realise that for each administration it take time to
            formulate policy and decide on focus countries, but also time passed
            before ITC can tender for projects in those countries. Travel always
            lags behind and ITC is not active in all focus countries.
          </Paragraph>
          <figure className="mt-5">
            <BtorsAndCabinets
              neCountries={neCountriesTopoJson}
              countries={countries}
              bhosCountries={bhosCountries}
              btorsByYear={btorsByYear}
              dutchCabinets={dutchCabinets}
            />
            <Caption reference="Fig. 2">
              Relation between government policies and ITC travel.
            </Caption>
          </figure>
        </div>
      </Section>
      <Section>
        <h2>Which destination?</h2>
        <Paragraph>
          In [3] the travel destinations are grouped by the UN statistical
          regions and subregions spilt over ITC&apos;s scientific departments.
        </Paragraph>
        <div className="mt-5">
          <MapLayoutFluid projection={geoBertin1953()}>
            <BtorsByDepartment
              neCountries={neCountriesTopoJson}
              countryCodes={countries}
              btors={btorsByDepartment}
            />
          </MapLayoutFluid>
          <Caption reference="Fig.3">
            Travel destination split by department.
          </Caption>
        </div>
      </Section>
      <Section>
        <Paragraph>
          [4] offers an interactive 3d prism map showing the number of visits to
          county by a department.
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
        <Caption reference="Fig.4">
          Travel destination by country by department.
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
