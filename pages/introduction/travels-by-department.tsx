/** @jsxImportSource theme-ui */

import type { GetStaticProps, NextPage } from "next";
import { Box, Paragraph } from "theme-ui";
import getCountries from "../../lib/data/getCountries";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import HeroVisualPage from "../../components/HeroVisualPage";
import TravelsByDepartment from "../../components/visuals/TravelsByDepartment";
import getBtorsGroupedByCountry, {
  BtorsGroupedByCountry,
} from "../../lib/data/queries/btors/getBtorsGroupedByCountry";
import Caption from "../../components/Caption";
import BtorsByYear from "../../components/visuals/BtorsByYear";
import getBtorsGroupedByYear, {
  BtorsGroupedByYear,
} from "../../lib/data/queries/btors/getBtorsGroupedByYear";
import { geoChamberlinAfrica } from "d3-geo-projection";

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
            <Box>
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
            <Box>
              <BtorsByYear
                projection={geoChamberlinAfrica()}
                neCountries={neCountries}
                btors={btorsByYear}
              />
              <Caption reference="Fig. 2">
                This map shows something else.
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
