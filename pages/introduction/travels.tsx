/** @jsxImportSource theme-ui */

import type { GetStaticProps, NextPage } from "next";
import { Box, Heading, Paragraph } from "theme-ui";
import getCountries from "../../lib/data/getCountries";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import HeroVisualPage from "../../components/HeroVisualPage";
import TravelsByDepartment from "../../components/visuals/maps/MultiStopBtors";
import getBtorsGroupedByCountry, {
  BtorsGroupedByCountry,
} from "../../lib/data/queries/btors/getBtorsGroupedByCountry";
import Caption from "../../components/Caption";
import BtorsByYearMap from "../../components/visuals/maps/BtorsByYear";
import getBtorsGroupedByYear, {
  BtorsGroupedByYear,
} from "../../lib/data/queries/btors/getBtorsGroupedByYear";
import { ExtendedFeature } from "d3-geo";
import getBhosCountries from "../../lib/data/getBhosCountries";
import getDutchCabinets from "../../lib/data/getDutchCabinets";
import { BhosCountry } from "../../types/BhosCountry";
import BtorsAndCabinets from "../../components/visuals/BtorsAndCabinets";
import { DutchCabinet } from "../../types/DutchCabinet";
import getBtorsGroupedByRegionByDepartment, {
  BtorsGroupedByRegionByDepartment,
} from "../../lib/data/queries/btors/getBtorsGroupedByRegionByDepartment";
import BtorsByDepartment from "../../components/visuals/maps/BtorsByDepartment";
import { SharedPageProps } from "../../types/Props";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";

type Props = SharedPageProps & {
  btorsByCountry: BtorsGroupedByCountry;
  btorsByYear: BtorsGroupedByYear;
  bhosCountries: BhosCountry[];
  btorsByDepartment: BtorsGroupedByRegionByDepartment;
  dutchCabinets: DutchCabinet[];
  neCountriesTopoJson: NeCountriesTopoJson;
};

const Page: NextPage<Props> = ({
  btorsByCountry,
  btorsByYear,
  bhosCountries,
  dutchCabinets,
  btorsByDepartment,
  neCountriesTopoJson,
  countries,
}) => {
  const heroVisual = (
    <BtorsByYearMap neCountries={neCountriesTopoJson} btors={btorsByYear} />
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
    <HeroVisualPage title="Staff travels over time" heroVisual={heroVisual}>
      <Paragraph variant="teaser">
        Where does ITC staff travel and what for? To answer this question we
        need to take a closer look on different travel destination, the
        development over time and the purpose of these travels. Two datasets are
        the basis for this analysis: the &ldquo;Back to Office Reports&rdquo;
        and all flights booked by ITC&apos;s travel angency for 2019.
      </Paragraph>
      <Box as="section" variant="layout.section">
        <Box
          sx={{ display: "grid", gridTemplateColumns: "2fr 1fr", columnGap: 5 }}
        >
          <Box>
            <Paragraph>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Soluta
              maiores debitis porro totam reiciendis, inventore quas, voluptatem
              eveniet ipsam veniam ex corporis eligendi ea doloribus.
              Consectetur vel aliquam id minus!
            </Paragraph>
            <Box variant="layout.inlineMap">
              <TravelsByDepartment
                neCountries={neCountriesTopoJson}
                btors={btorsByCountry}
              />
              <Caption reference="Fig. 1">
                This maps shows something specific.
              </Caption>
            </Box>
            <Paragraph>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eveniet,
              quisquam itaque quis voluptas perspiciatis asperiores iusto
              excepturi provident eaque magni similique consequuntur dignissimos
              eos ullam vel sit veritatis sunt quod!
            </Paragraph>
            <Heading as="h2">
              Travels in the context of Dutch development policies
            </Heading>
            <Paragraph>
              Dutch development policies change over time. According to the
              cabinets in office the perspective and focus on development shifts
              slighty, affecting ITC&apos;s work.
            </Paragraph>
            <Box variant="layout.inlineMap">
              <BtorsAndCabinets
                neCountries={neCountriesTopoJson}
                bhosCountries={bhosCountries}
                btorsByYear={btorsByYear}
                dutchCabinets={dutchCabinets}
              />
              <Caption reference="Fig. 2">
                This chart shows travels over time across the world
              </Caption>
            </Box>
            <Paragraph>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet
              molestiae, sequi animi est dolor nihil qui id, aperiam assumenda
              suscipit officia, veniam tenetur veritatis saepe! Recusandae animi
              incidunt fuga perferendis!
            </Paragraph>
            <Box variant="layout.inlineMap">
              <BtorsByYearMap
                neCountries={neCountriesTopoJson}
                btors={btorsByYear}
                extent={extent}
              />
              <Caption reference="Fig. 2">
                This map shows travels over time with destinations within
                Europe, showing a tendency to less travels over time across the
                contintent.
              </Caption>
            </Box>
            <Paragraph>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet
              molestiae, sequi animi est dolor nihil qui id, aperiam assumenda
              suscipit officia, veniam tenetur veritatis saepe! Recusandae animi
              incidunt fuga perferendis!
            </Paragraph>
            <Box variant="layout.inlineMap">
              <BtorsByDepartment
                neCountries={neCountriesTopoJson}
                countryCodes={countries}
                btors={btorsByDepartment}
              />
              <Caption reference="Fig. 2">
                This map shows travels per department.
              </Caption>
            </Box>
          </Box>
        </Box>
      </Box>
    </HeroVisualPage>
  );
};

export default Page;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [
    btorsByCountry,
    btorsByYear,
    btorsByDepartment,
    bhosCountries,
    dutchCabinets,
    neCountriesTopoJson,
    countries,
  ] = await Promise.all([
    getBtorsGroupedByCountry(),
    getBtorsGroupedByYear(),
    getBtorsGroupedByRegionByDepartment(),
    getBhosCountries(),
    getDutchCabinets(),
    getCountries(),
    getCountryCodes(),
  ]);

  return {
    props: {
      btorsByCountry,
      btorsByYear,
      btorsByDepartment,
      bhosCountries,
      dutchCabinets,
      neCountriesTopoJson,
      countries,
    },
  };
};
