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
import MultiStopBtors from "../../components/MultiStopBtors";
import getBhosCountries from "../../lib/data/getBhosCountries";
import getCountries from "../../lib/data/getCountries";
import getDutchCabinets from "../../lib/data/getDutchCabinets";
import getBtorsGroupedByCountry, {
  BtorsGroupedByCountry,
} from "../../lib/data/queries/btors/getBtorsGroupedByCountry";
import getBtorsGroupedByCountryByDepartment, {
  BtorsGroupedByCountryByDepartment,
} from "../../lib/data/queries/btors/getBtorsGroupedByCountryByDepartment";
import TravelsByDepartmentPrismMap from "../../components/visuals/TravelsByDepartmentPrismMap";
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

type Props = SharedPageProps & {
  btorsByCountry: BtorsGroupedByCountry;
  btorsByCountryByDepartment: BtorsGroupedByCountryByDepartment;
  btorsByYear: BtorsGroupedByYear;
  bhosCountries: BhosCountry[];
  btorsByDepartment: BtorsGroupedByRegionByDepartment;
  dutchCabinets: DutchCabinet[];
  departments: Department[];
};

const Page: NextPage<Props> = ({
  btorsByCountry,
  btorsByCountryByDepartment,
  btorsByYear,
  bhosCountries,
  dutchCabinets,
  btorsByDepartment,
  neCountriesTopoJson,
  countries,
  departments,
}) => {
  const heroVisual = (
    <MapLayoutFluid projection={geoBertin1953()}>
      <BtorsByYearMap
        countries={countries}
        neCountries={neCountriesTopoJson}
        btors={btorsByYear}
      />
    </MapLayoutFluid>
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
        <div className="mt-5">
          <MultiStopBtors
            neCountries={neCountriesTopoJson}
            btors={btorsByCountry}
          />
          <Caption reference="Fig. 1">
            This maps shows something specific.
          </Caption>
        </div>
        <Paragraph>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eveniet,
          quisquam itaque quis voluptas perspiciatis asperiores iusto excepturi
          provident eaque magni similique consequuntur dignissimos eos ullam vel
          sit veritatis sunt quod!
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
          <div className="mt-5">
            <MapLayoutFluid projection={geoBertin1953()} extent={extent}>
              <BtorsByYearMap
                countries={countries}
                neCountries={neCountriesTopoJson}
                btors={btorsByYear}
              />
            </MapLayoutFluid>
            <Caption reference="Fig. 3">
              This map shows travels over time with destinations within Europe,
              showing a tendency to less travels over time across the
              contintent.
            </Caption>
          </div>
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
        <TravelsByDepartmentPrismMap
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
    btorsByCountry,
    btorsByCountryByDepartment,
    btorsByYear,
    btorsByDepartment,
    bhosCountries,
    dutchCabinets,
    neCountriesTopoJson,
    countries,
    departments,
  ] = await Promise.all([
    getBtorsGroupedByCountry(),
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
      btorsByCountry,
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
