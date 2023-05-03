/** @jsxImportSource theme-ui */

import type { GetStaticProps, NextPage } from "next";
import { Box, Paragraph } from "theme-ui";
import getCountries from "../../lib/data/getCountries";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import HeroVisualPage from "../../components/HeroVisualPage";
import TravelsByDepartment from "../../components/visuals/maps/MultiStopBtors";
import getBtorsGroupedByCountry, {
  BtorsGroupedByCountry,
} from "../../lib/data/queries/btors/getBtorsGroupedByCountry";
import Caption from "../../components/Caption";
import BtorsByYear from "../../components/visuals/maps/BtorsByYear";
import getBtorsGroupedByYear, {
  BtorsGroupedByYear,
} from "../../lib/data/queries/btors/getBtorsGroupedByYear";
import { ExtendedFeature } from "d3-geo";

type Props = {
  btorsByCountry: BtorsGroupedByCountry;
  btorsByYear: BtorsGroupedByYear;
  neCountries: NeCountriesTopoJson;
};

const Page: NextPage<Props> = ({
  btorsByCountry,
  btorsByYear,
  neCountries,
}) => {
  const heroVisual = (
    <BtorsByYear neCountries={neCountries} btors={btorsByYear} />
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
              ITC staff travels for different purposes and for different
              departments. The map above shows the following.
            </Paragraph>
            <Box variant="layout.inlineMap">
              <TravelsByDepartment
                neCountries={neCountries}
                btors={btorsByCountry}
              />
              <Caption reference="Fig. 1">
                This maps shows something specific.
              </Caption>
            </Box>
            <Paragraph>
              ITC staff travels for different purposes and for different
              departments. The map above shows the following.
            </Paragraph>
            <Box variant="layout.inlineMap">
              <BtorsByYear
                neCountries={neCountries}
                btors={btorsByYear}
                extent={extent}
              />
              <Caption reference="Fig. 2">
                This map shows travels over time with destinations within
                Europe, showing a tendency to less travels over time across the
                contintent.
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
  const [btorsByCountry, btorsByYear, neCountries] = await Promise.all([
    getBtorsGroupedByCountry(),
    getBtorsGroupedByYear(),
    getCountries(),
  ]);

  return {
    props: {
      btorsByCountry,
      btorsByYear,
      neCountries,
    },
  };
};
